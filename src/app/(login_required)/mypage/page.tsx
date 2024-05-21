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
import { GroupData, createGroup, readGroupsByUserId } from "@/models/groups";
import {
  GroupRequestData,
  createRequest,
  readRequestsByOwnerId,
} from "@/models/groupRequests";

enum GroupOptions {
  null,
  join,
  create,
}
const MyPage = () => {
  const { userData } = useContext(UserContext)!;
  const [groups, setGroups] = useState<GroupData[]>([]);
  const [requests, setRequests] = useState<GroupRequestData[]>([]);
  const [groupIdOrName, setGroupIdOrName] = useState("");
  const [showPopup, setShowPopup] = useState(GroupOptions.null);
  const [showJoinOptions, setShowJoinOptions] = useState(false);
  const { startLottie, endLottie } = useContext(AnimationContext)!;
  const { selectedGroup, setGroup } = useContext(GroupContext)!;
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
    setShowPopup(GroupOptions.null);
    setGroupIdOrName("");
    endLottie();
  };

  const handleCreate = async () => {
    startLottie(LoadingAnimation);
    if (!userData) return;
    const res = await createGroup(groupIdOrName, userData.id);
    if (!res || !res.data) {
      console.error(res.error);
      endLottie();
      return;
    }
    setGroups((prev) => [...prev, res.data!]);
    setShowPopup(GroupOptions.null);
    setGroupIdOrName("");
    endLottie();
  };

  return (
    <>
      <div className="p-mypage">
        <span className="p-mypage__title">マイページ</span>
        <NotificationButton className="p-mypage__notification" />
        <div className="p-user-info">
          <span className="p-user-info__title">ユーザー情報</span>
          <div className="p-user-info__contents">
            <Image className="p-user-info__icon" src={SampleIcon} alt="" />
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
              </div>
            ))}
          </div>
        </div>
      </div>
      {showJoinOptions ? (
        <OverLay
          className="p-user-groups__overlay"
          onClick={() => setShowJoinOptions(false)}
        />
      ) : null}
    </>
  );
};

export default MyPage;
