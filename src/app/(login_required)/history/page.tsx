"use client";
import React, { useContext, useEffect, useRef, useState } from "react";
import {
  AnimationContext,
  GroupContext,
  UserContext,
} from "@/app/contextProvider";
import LoadingAnimation from "@/assets/json/loading-animation.json";
import { useRouter } from "next/navigation";
import SampleIcon from "@/assets/img/icon-sample.png";
import {
  HistoryData,
  deleteHistory,
  readHistoryData,
  toggleLikePost,
  uploadHistory,
} from "@/models/history";
import Image from "next/image";
import { GroupData, readGroupById } from "@/models/groups";
import { PlusButton } from "@/components/plusButton";
import { OverLay } from "@/components/overlay";
import { Button } from "@/components/button";
import SampleImage from "@/assets/img/sample-image.jpeg";
import { CloseButton } from "@/components/closeButton";
import { DeleteButton } from "@/components/deleteButton";
import { Pagination } from "@/components/pagination";
import EmptyHeart from "@/assets/img/heart-empty.svg";
import FilledHeart from "@/assets/img/heart-fill.svg";

const Page = () => {
  const [err, setErr] = useState("");
  const [historyData, setHistoryData] = useState<HistoryData[]>([]);
  const [showUploadPopup, setShowUploadPopup] = useState(false);
  const [imageStr, setImageStr] = useState("");
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [uploadedImage, uploadImage] = useState<File>();
  const { startLottie, endLottie } = useContext(AnimationContext)!;
  const { userData } = useContext(UserContext)!;
  const [groupData, setGroupData] = useState<GroupData>();
  const { selectedGroup, setGroup } = useContext(GroupContext)!;

  const [page, setPage] = useState(1);
  const total = 5;

  const sortedByDate = [...historyData].sort((a, b) =>
    a.date > b.date ? -1 : 1
  );

  const router = useRouter();

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (!e.target.files || e.target.files?.length == 0) return;
    const file = e.target.files[0];
    const imageUrl = URL.createObjectURL(file);
    setImageStr(imageUrl);

    const selectedImage = e.target.files[0];
    uploadImage(selectedImage);
  };

  useEffect(() => {
    if (!userData) return;
    fetchData();
  }, [userData, selectedGroup]);

  const fetchData = async () => {
    startLottie(LoadingAnimation);
    const res = await readHistoryData(selectedGroup);
    if (!res.success || !res.data) {
      console.error(res.error);
      return;
    }
    setHistoryData(res.data);

    const res2 = await readGroupById(selectedGroup);
    if (!res2.success || !res2.data) {
      console.error(res2.error);
      return;
    }
    setGroupData(res2.data);
    endLottie();
  };

  const deleteImage = async (id: string | undefined) => {
    if (!id) return;
    if (!confirm("本当に削除しますか？")) return;
    startLottie(LoadingAnimation);
    const res = await deleteHistory(id);

    if (res.success) {
      const newData = historyData.filter((d) => d.id !== id);
      setHistoryData(newData);
    } else {
      alert("失敗しました");
    }
    endLottie();
  };

  const sendImage = async () => {
    if (!uploadedImage || !userData) return;
    startLottie(LoadingAnimation);
    const res = await uploadHistory(
      uploadedImage,
      selectedGroup,
      userData.id,
      comment,
      title
    );

    if (res.success && res.data) {
      setHistoryData((prev) => [
        ...prev!,
        { userName: userData.name, ...res.data! },
      ]);
      setShowUploadPopup(false);
      uploadImage(undefined);
      setImageStr("");
      setTitle("");
      setComment("");
      alert("送信しました");
    } else {
      alert("送信できませんでした");
    }
    endLottie();
  };
  const likePost = async (d: HistoryData) => {
    if (!d.id || !userData) return;

    const res = await toggleLikePost(d.id, userData.id);

    if (res.success) {
      const newData = [...historyData];
      if (d.like.indexOf(userData.id) == -1) {
        newData[newData.indexOf(d)].like.push(userData.id);
      } else {
        newData[newData.indexOf(d)].like.splice(d.like.indexOf(userData.id));
      }

      setHistoryData(newData);
    }
  };

  return (
    <div className="p-history">
      <span className="p-history__title">写真集({groupData?.name})</span>
      <PlusButton
        className="p-history__plus"
        onClick={() => setShowUploadPopup(true)}
      />
      <div className="p-history__images">
        {sortedByDate.slice((page - 1) * total, page * total).map((d, i) => (
          <div className="p-history__image-container" key={i}>
            <div className="p-history__header">
              {d.userIcon ? (
                <Image
                  className="p-history__image-icon"
                  src={d.userIcon}
                  alt=""
                  height={30}
                  width={30}
                />
              ) : (
                <Image
                  className="p-games__image-icon"
                  src={SampleIcon}
                  alt=""
                />
              )}
              <span className="p-history__image-user">
                {d.userName ? `${d.userName}` : ""}
              </span>
              {d.userId == userData?.id ? (
                <DeleteButton
                  className="p-history__image-delete"
                  onClick={(e) => {
                    e.preventDefault();
                    deleteImage(d.id);
                  }}
                />
              ) : null}
            </div>
            <span className="p-history__image-title">{d.title}</span>
            <span className="p-history__image-comment">{d.comment}</span>
            <Image
              className="p-history__image"
              width={400}
              height={300}
              src={d.image}
              objectFit="cover"
              alt=""
            />
            <div className="p-history__image-like-container">
              <Image
                className="p-history__image-like"
                alt=""
                src={
                  d.like && d.like.includes(userData?.id!)
                    ? FilledHeart
                    : EmptyHeart
                }
                onClick={(e) => {
                  e.preventDefault();
                  likePost(d);
                }}
              />
              <span className="p-history__image-like-number">
                {d.like ? d.like.length : 0}
              </span>
            </div>
          </div>
        ))}
      </div>
      <Pagination
        page={page}
        all={sortedByDate.length}
        total={total}
        updatePage={setPage}
      />
      {showUploadPopup ? (
        <>
          <div className="p-history__upload">
            <CloseButton
              className="p-history__upload-close"
              onClick={() => setShowUploadPopup(false)}
            />
            <span className="p-history__upload-title">写真をアップロード</span>
            <input
              className="p-history__upload-input-image"
              type="file"
              onChange={handleInput}
              accept="image/*"
            />
            {uploadedImage ? (
              <Image
                className="p-history__upload-image"
                id="target"
                src={imageStr}
                alt="user image"
                width={400}
                height={300}
              />
            ) : (
              <Image
                className="p-history__upload-image"
                id="target"
                src={SampleImage}
                alt="sample"
                width={400}
                height={300}
              />
            )}
            <input
              className="p-history__upload-input"
              type="text"
              onChange={(e) => setTitle(e.target.value)}
              placeholder="タイトルを入力"
            />
            <input
              className="p-history__upload-input"
              type="text"
              onChange={(e) => setComment(e.target.value)}
              placeholder="コメントを入力"
            />
            <Button
              className={`p-history__upload-submit ${
                !uploadedImage ? "-disabled" : ""
              }`}
              disabled={!uploadedImage}
              label="送信する"
              onClick={() => {
                sendImage();
              }}
            />
          </div>
          <OverLay
            onClick={() => setShowUploadPopup(false)}
            className="p-history__upload-overlay"
          />
        </>
      ) : null}
    </div>
  );
};

export default Page;
