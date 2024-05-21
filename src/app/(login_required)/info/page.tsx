"use client";
import React, { useContext, useEffect, useRef, useState } from "react";
import {
  AnimationContext,
  GroupContext,
  UserContext,
} from "@/app/contextProvider";
import LoadingAnimation from "@/assets/json/loading-animation.json";
import { GroupData, readGroupById, readGroupsByUserId } from "@/models/groups";
import { useRouter } from "next/navigation";
import Link from "next/link";

const Page = () => {
  const [err, setErr] = useState("");
  const [groupData, setGroupData] = useState<GroupData>();
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
    const res = await readGroupById(selectedGroup);
    if (!res.success || !res.data) {
      console.error(res.error);
      return;
    }
    setGroupData(res.data);
    endLottie();
  };

  return (
    <div className="p-info">
      <span className="p-info__title">情報</span>
      <div className="p-info__links">
        <Link href="" target="_brank" className="p-info__link">
          TMS
        </Link>
        <Link href="" target="_brank" className="p-info__link">
          Messengerグループ(チーム)
        </Link>
        <Link href="" target="_brank" className="p-info__link">
          Messengerグループ(メンター)
        </Link>
        <Link href="" target="_brank" className="p-info__link">
          FaceBookグループ
        </Link>
      </div>
    </div>
  );
};

export default Page;
