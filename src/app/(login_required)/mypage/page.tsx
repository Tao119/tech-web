"use client";
import { useContext, useEffect, useState } from "react";
import {
  AnimationContext,
  GroupContext,
  UserContext,
} from "@/app/contextProvider";
import Image from "next/image";
import { useRouter } from "next/navigation";
import SampleIcon from "@/assets/img/icon-sample.png";
import { CloseButton } from "@/components/closeButton";
import { PlusButton } from "@/components/plusButton";
import { NotificationButton } from "@/components/notificationButton";
import { OverLay } from "@/components/overlay";
import LoadingAnimation from "@/assets/json/loading-animation.json";
import {
  GroupData,
  createGroup,
  readGroupById,
  readGroupsByUserId,
} from "@/models/groups";
import {
  GroupRequestData,
  createRequest,
  readRequestsByOwnerId,
} from "@/models/groupRequests";
import { Notification } from "./notification";
import {
  NotificationData,
  NotificationType,
  readNotificationDataByUserId,
  uploadNotification,
} from "@/models/notification";
import { createReqestsString } from "@/constant/strings";
import { Timestamp } from "firebase/firestore";
import { Button } from "@/components/button";
import { updateProfileImage } from "@/models/users";

enum GroupOptions {
  null,
  join,
  create,
}
const MyPage = () => {
  const { userData, setUserData } = useContext(UserContext)!;
  const [groups, setGroups] = useState<GroupData[]>([]);
  const [requests, setRequests] = useState<GroupRequestData[]>([]);
  const [groupIdOrName, setGroupIdOrName] = useState("");
  const [showPopup, setShowPopup] = useState(GroupOptions.null);
  const [showNotification, setShowNotification] = useState(false);
  const [showJoinOptions, setShowJoinOptions] = useState(false);
  const [showProfileImagePopup, setShowProfileImagePopup] = useState(false);
  const { startLottie, endLottie } = useContext(AnimationContext)!;
  const { selectedGroup, setGroup } = useContext(GroupContext)!;
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [imageStr, setImageStr] = useState("");
  const [uploadedImage, uploadImage] = useState<File>();
  const unread = notifications.some((d) => !d.read);
  const router = useRouter();

  useEffect(() => {
    if (!userData) return;
    const fetchData = async () => {
      startLottie(LoadingAnimation);
      const res = await readGroupsByUserId(userData.id);
      if (!res || !res.data) {
        console.error(res.error);
        endLottie();
        return;
      }

      setGroups(res.data);
      const res2 = await readNotificationDataByUserId(userData.id);
      if (!res2 || !res2.data) {
        console.error(res2.error);
        endLottie();
        return;
      }
      setNotifications(res2.data);
      endLottie();
    };
    fetchData();
  }, [userData]);

  useEffect(() => {
    const fetchRequests = async () => {
      if (!userData) return;
      startLottie(LoadingAnimation);
      const res = await readRequestsByOwnerId(userData.id);
      if (!res || !res.data) {
        console.error(res.error);
        endLottie();
        return;
      }
      setRequests(res.data);
      endLottie();
    };

    fetchRequests();
  }, [groups]);

  const handleJoin = async () => {
    if (!userData) return;
    startLottie(LoadingAnimation);
    const res = await createRequest(userData.id, groupIdOrName);
    if (!res.success || !res.data) {
      console.error(res.error);
      endLottie();
      return;
    }
    const res2 = await readGroupById(groupIdOrName);
    if (!res2.success || !res2.data) {
      console.error(res2.error);
      endLottie();
      return;
    }

    const res3 = await uploadNotification({
      requestId: res.data.id,
      time: Timestamp.fromDate(new Date()),
      userId: res2.data.owner!,
      type: NotificationType.request,
      date: new Date(),
      read: false,
      ...createReqestsString(userData.name, res2.data.name),
    });
    if (!res3.success) {
      console.error(res3.error);
      endLottie();
      return;
    }
    setShowPopup(GroupOptions.null);
    setGroupIdOrName("");
    endLottie();
  };

  const handleCreate = async () => {
    startLottie(LoadingAnimation);
    if (!userData) return;
    const res = await createGroup(groupIdOrName, userData.id);
    if (!res.success || !res.data) {
      console.error(res.error);
      endLottie();
      return;
    }
    setGroups((prev) => [...prev, res.data!]);
    setShowPopup(GroupOptions.null);
    setGroupIdOrName("");
    endLottie();
  };
  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (!e.target.files || e.target.files?.length == 0) return;
    const file = e.target.files[0];
    const imageUrl = URL.createObjectURL(file);
    setImageStr(imageUrl);

    const selectedImage = e.target.files[0];
    uploadImage(selectedImage);
  };

  const setProfileImage = async () => {
    if (!userData) return;
    if (!uploadedImage && !confirm("アップロードした画像を削除しますか？"))
      return;
    startLottie(LoadingAnimation);
    const res = await updateProfileImage(userData?.id, uploadedImage);
    if (!res.success) {
      console.error(res.error);
      alert("失敗しました");
      endLottie();
      return;
    }
    setShowProfileImagePopup(false);
    uploadImage(null!);
    setImageStr("");
    setUserData({ ...userData, image: res.imageUrl });
    alert("更新しました");
    endLottie();
  };

  return (
    <>
      <div className="p-mypage">
        <span className="p-mypage__title">マイページ</span>
        <NotificationButton
          unread={unread}
          className="p-mypage__notification"
          onClick={() => setShowNotification(true)}
        />
        {showNotification ? (
          <Notification
            notifications={notifications}
            close={() => {
              setShowNotification(false);
            }}
          />
        ) : null}
        <div className="p-user-info">
          <span className="p-user-info__title">ユーザー情報</span>
          <div className="p-user-info__contents">
            <Image
              className="p-user-info__icon"
              src={userData?.image ? userData.image : SampleIcon}
              width={200}
              height={200}
              alt=""
              onClick={() => setShowProfileImagePopup(true)}
            />
            {showProfileImagePopup ? (
              <div className="p-user-info__upload">
                <CloseButton
                  className="p-user-info__upload-close"
                  onClick={() => setShowProfileImagePopup(false)}
                />
                <span className="p-user-info__upload-title">
                  プロフィール画像をアップロード
                </span>
                <input
                  className="p-user-info__upload-input-image"
                  type="file"
                  onChange={handleInput}
                  accept="image/*"
                />
                {uploadedImage ? (
                  <Image
                    className="p-user-info__upload-image"
                    id="target"
                    src={imageStr}
                    alt="user image"
                    width={200}
                    height={200}
                  />
                ) : (
                  <Image
                    className="p-user-info__upload-image"
                    id="target"
                    src={SampleIcon}
                    alt="sample"
                    width={200}
                    height={200}
                  />
                )}
                <Button
                  className={`p-user-info__upload-submit`}
                  label="送信する"
                  onClick={() => {
                    setProfileImage();
                  }}
                />
              </div>
            ) : null}
            <div className="p-user-info__info">
              <span className="p-user-info__label">email</span>
              <span className="p-user-info__email">{userData?.email}</span>
              <span className="p-user-info__label">name</span>
              <span className="p-user-info__name">{userData?.name}</span>
            </div>
          </div>
        </div>
        <div className="p-user-groups">
          <span className="p-user-groups__title">グループ</span>
          <PlusButton
            className="p-user-groups__plus"
            onClick={() => setShowJoinOptions(true)}
          />
          {showJoinOptions ? (
            <div className="p-user-groups__join-options">
              <li
                className="p-user-groups__join-option"
                onClick={() => {
                  setShowPopup(GroupOptions.join);
                  setShowJoinOptions(false);
                }}
              >
                参加する
              </li>
              {userData?.isAdmin ? (
                <li
                  className="p-user-groups__join-option"
                  onClick={() => {
                    setShowPopup(GroupOptions.create);
                    setShowJoinOptions(false);
                  }}
                >
                  作成する
                </li>
              ) : null}
            </div>
          ) : null}
          {showPopup != GroupOptions.null ? (
            <div className="p-user-groups__join">
              <CloseButton
                className="p-user-groups__close"
                onClick={() => {
                  setShowPopup(GroupOptions.null);
                  setGroupIdOrName("");
                }}
              />
              <span className="p-user-groups__join-title">
                グループ{showPopup == GroupOptions.join ? "に参加" : "を作成"}
              </span>
              <input
                className="p-user-groups__join-input"
                type="text"
                value={groupIdOrName}
                onChange={(e) => setGroupIdOrName(e.target.value)}
                placeholder={
                  showPopup == GroupOptions.join ? "グループID" : "グループ名"
                }
              />
              <button
                className={`p-user-groups__join-submit ${
                  !groupIdOrName! ? "-disabled" : ""
                }`}
                disabled={!groupIdOrName!}
                onClick={
                  showPopup == GroupOptions.join ? handleJoin : handleCreate
                }
              >
                {showPopup == GroupOptions.join ? "参加" : "作成"}
              </button>
            </div>
          ) : null}
          <div className="p-user-groups__groups">
            {groups.map((group) => (
              <div
                className={`p-user-groups__group ${
                  selectedGroup == group.id ? "-active" : ""
                }`}
                onClick={() => {
                  setGroup(group.id);
                  localStorage.setItem("selected_group_id", group.id);
                }}
                key={group.id}
              >
                <span className="p-user-groups__name">{group.name}</span>
                <span className="p-user-groups__id">{group.id}</span>
                <ul className="p-user-groups__members">
                  {group.membersName?.map((m, i) => (
                    <li key={i} className="p-user-groups__member">
                      {m}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
      {showJoinOptions ? (
        <OverLay
          className="p-user-groups__overlay"
          onClick={() => {
            setShowJoinOptions(false);
          }}
        />
      ) : null}
      {showNotification ? (
        <OverLay
          className="p-notification__overlay"
          onClick={() => {
            setShowNotification(false);
          }}
        />
      ) : null}
      {showProfileImagePopup ? (
        <OverLay
          className="p-user-info__overlay"
          onClick={() => {
            setShowProfileImagePopup(false);
          }}
        />
      ) : null}
    </>
  );
};

export default MyPage;
