"use client";
import React, { useContext, useEffect, useRef, useState } from "react";
import {
  AnimationContext,
  GroupContext,
  UserContext,
} from "@/app/contextProvider";
import LoadingAnimation from "@/assets/json/loading-animation.json";
import SampleIcon from "@/assets/img/icon-sample.png";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { GroupData, readGroupById } from "@/models/groups";
import { PlusButton } from "@/components/plusButton";
import { OverLay } from "@/components/overlay";
import { Button } from "@/components/button";
import SampleImage from "@/assets/img/sample-image.jpeg";
import { CloseButton } from "@/components/closeButton";
import { DeleteButton } from "@/components/deleteButton";
import { Pagination } from "@/components/pagination";
import {
  RecommendedGameData,
  deleteRecommendedGame,
  readRecommendedGameData,
  uploadRecommendedGame,
} from "@/models/games";
import Link from "next/link";

const Page = () => {
  const [err, setErr] = useState("");
  const [gamesData, setGamesData] = useState<RecommendedGameData[]>([]);
  const [showUploadPopup, setShowUploadPopup] = useState(false);
  const [imageStr, setImageStr] = useState("");
  const [title, setTitle] = useState("");
  const [link, setLink] = useState("");
  const [comment, setComment] = useState("");
  const [uploadedImage, uploadImage] = useState<File>();
  const { startLottie, endLottie } = useContext(AnimationContext)!;
  const { userData } = useContext(UserContext)!;
  const [groupData, setGroupData] = useState<GroupData>();
  const { selectedGroup, setGroup } = useContext(GroupContext)!;

  const [page, setPage] = useState(1);
  const total = 5;

  const sortedByDate = [...gamesData].sort((a, b) =>
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
    const res = await readRecommendedGameData(selectedGroup);
    if (!res.success || !res.data) {
      console.error(res.error);
      return;
    }
    setGamesData(res.data);

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
    const res = await deleteRecommendedGame(id);

    if (res.success) {
      const newData = gamesData.filter((d) => d.id !== id);
      setGamesData(newData);
    } else {
      alert("失敗しました");
    }
    endLottie();
  };

  const sendImage = async () => {
    if (!userData || !title) return;
    startLottie(LoadingAnimation);
    const res = await uploadRecommendedGame(
      selectedGroup,
      userData.id,
      title,
      comment,
      link,
      uploadedImage
    );

    if (res.success && res.data) {
      setGamesData((prev) => [
        ...prev!,
        { userName: userData.name, ...res.data! },
      ]);
      setShowUploadPopup(false);
      uploadImage(undefined);
      setImageStr("");
      setTitle("");
      setComment("");
      setLink("");
      alert("送信しました");
    } else {
      alert("送信できませんでした");
    }
    endLottie();
  };

  const content = (d: RecommendedGameData) => (
    <>
      <div className="p-games__header">
        {d.userIcon ? (
          <Image
            className="p-games__image-icon"
            src={d.userIcon}
            alt=""
            height={30}
            width={30}
          />
        ) : (
          <Image className="p-games__image-icon" src={SampleIcon} alt="" />
        )}
        <span className="p-games__image-user">
          {d.userName ? `${d.userName}` : ""}
        </span>
        {d.userId == userData?.id ? (
          <DeleteButton
            className="p-games__image-delete"
            onClick={(e) => {
              e.preventDefault();
              deleteImage(d.id);
            }}
          />
        ) : null}
      </div>
      <span className="p-games__image-title">{d.title}</span>
      <span className="p-games__image-comment">{d.comment}</span>
      {d.image ? (
        <Image
          className="p-games__image"
          width={400}
          height={300}
          src={d.image}
          objectFit="cover"
          alt=""
        />
      ) : null}
      <span className="p-games__image-user">
        {d.userName ? `by ${d.userName}` : ""}
      </span>
    </>
  );

  return (
    <div className="p-games">
      <span className="p-games__title">
        おすすめゲーム集({groupData?.name})
      </span>
      <PlusButton
        className="p-games__plus"
        onClick={() => setShowUploadPopup(true)}
      />
      <div className="p-games__images">
        {sortedByDate.slice((page - 1) * total, page * total).map((d, i) =>
          d.link == "" ? (
            <div className="p-games__container" key={i}>
              {content(d)}
            </div>
          ) : (
            <Link
              className="p-games__container -link"
              key={i}
              href={d.link}
              target="_brank"
            >
              {content(d)}
            </Link>
          )
        )}
      </div>
      <Pagination
        page={page}
        all={sortedByDate.length}
        total={total}
        updatePage={setPage}
      />
      {showUploadPopup ? (
        <>
          <div className="p-games__upload">
            <CloseButton
              className="p-games__upload-close"
              onClick={() => setShowUploadPopup(false)}
            />
            <span className="p-games__upload-title">ゲームをアップロード</span>
            <input
              className="p-games__upload-input-image"
              type="file"
              onChange={handleInput}
              accept="image/*"
            />
            {uploadedImage ? (
              <Image
                className="p-games__upload-image"
                id="target"
                src={imageStr}
                alt="user image"
                width={400}
                height={300}
              />
            ) : (
              <Image
                className="p-games__upload-image"
                id="target"
                src={SampleImage}
                alt="sample"
                width={400}
                height={300}
              />
            )}
            <input
              className="p-games__upload-input"
              type="text"
              onChange={(e) => setTitle(e.target.value)}
              placeholder="ゲームのタイトルを入力"
            />
            <input
              className="p-games__upload-input"
              type="text"
              onChange={(e) => setComment(e.target.value)}
              placeholder="コメントを入力"
            />
            <input
              className="p-games__upload-input"
              type="text"
              onChange={(e) => setLink(e.target.value)}
              placeholder="リンクを入力"
            />
            <Button
              className={`p-games__upload-submit ${!title ? "-disabled" : ""}`}
              disabled={!title}
              label="送信する"
              onClick={() => {
                sendImage();
              }}
            />
          </div>
          <OverLay
            onClick={() => setShowUploadPopup(false)}
            className="p-games__upload-overlay"
          />
        </>
      ) : null}
    </div>
  );
};

export default Page;
