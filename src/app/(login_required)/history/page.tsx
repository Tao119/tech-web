"use client";
import React, { useContext, useEffect, useRef, useState } from "react";
import {
  AnimationContext,
  GroupContext,
  UserContext,
} from "@/app/contextProvider";
import LoadingAnimation from "@/assets/json/loading-animation.json";
import { useRouter } from "next/navigation";
import { HistoryData, readHistoryData } from "@/models/history";
import Image from "next/image";

const Page = () => {
  const [err, setErr] = useState("");
  const [historyData, setHistoryData] = useState<HistoryData[]>();
  const { startLottie, endLottie } = useContext(AnimationContext)!;
  const { userData } = useContext(UserContext)!;
  const { selectedGroup, setGroup } = useContext(GroupContext)!;
  const router = useRouter();

  useEffect(() => {
    if (!userData) return;
    fetchData();
  }, [userData]);

  const fetchData = async () => {
    startLottie(LoadingAnimation);
    const res = await readHistoryData(selectedGroup);
    if (!res.success || !res.data) {
      console.error(res.error);
      return;
    }
    setHistoryData(res.data);
    endLottie();
  };

  return (
    <div className="p-history">
      <span className="p-history__title">写真集</span>
      <div className="p-history__images">
        {historyData?.map((d) => (
          <div className="p-history__image-container">
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
          </div>
        ))}
      </div>
    </div>
  );
};

export default Page;
