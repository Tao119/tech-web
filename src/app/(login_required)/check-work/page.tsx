"use client";
import React, { useContext, useEffect, useRef, useState } from "react";
import {
  AnimationContext,
  GroupContext,
  UserContext,
} from "@/app/contextProvider";
import LoadingAnimation from "@/assets/json/loading-animation.json";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { CheckWorkData, readCheckWorkDataByUserId } from "@/models/checkWorks";
import Link from "next/link";

const Page = () => {
  const [err, setErr] = useState("");
  const [checkworkData, setCheckworkData] = useState<CheckWorkData[]>([]);
  const { startLottie, endLottie } = useContext(AnimationContext)!;
  const { userData } = useContext(UserContext)!;
  const { selectedGroup, setGroup } = useContext(GroupContext)!;
  const router = useRouter();

  useEffect(() => {
    if (!userData) return;
    const fetchData = async () => {
      startLottie(LoadingAnimation);
      const res = await readCheckWorkDataByUserId(userData.id);
      if (!res || !res.data) {
        console.error(res.error);
        endLottie();
        return;
      }
      setCheckworkData(res.data);
      endLottie();
    };
    fetchData();
  }, [userData, selectedGroup]);

  return (
    <div className="p-check-works">
      <span className="p-check-works__title">チェックワーク</span>
      {checkworkData.map((d, i) => (
        <Link
          className="p-check-works__link"
          key={i}
          href={d.url}
          target="_brank"
        >
          {d.semester}
        </Link>
      ))}
    </div>
  );
};

export default Page;
