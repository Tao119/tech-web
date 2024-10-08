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
import Accordion from "@/components/accordion";

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
  }, [userData, selectedGroup]);

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
        {/* <Link href="" target="_brank" className="p-info__link">
          TMS
        </Link> */}
        {groupData?.messenger ? (
          <Link
            href={groupData?.messenger}
            target="_brank"
            className="p-info__link"
          >
            Messengerグループ(チーム)
          </Link>
        ) : null}
        {groupData?.facebook ? (
          <Link href="" target="_brank" className="p-info__link">
            FaceBookグループ
          </Link>
        ) : null}
        {userData?.tms ? (
          <Link href={userData.tms} target="_brank" className="p-info__link">
            TMS
          </Link>
        ) : null}
        {userData?.kikakusho ? (
          <Link
            href={userData.kikakusho}
            target="_brank"
            className="p-info__link"
          >
            企画書
          </Link>
        ) : null}
        {userData?.mypage ? (
          <Link href={userData.mypage} target="_brank" className="p-info__link">
            TMS
          </Link>
        ) : null}
        <Link
          href="https://learning.life-is-tech.com/slides/1712820266612x757838633518497800"
          target="_brank"
          className="p-info__link"
        >
          みんなの作品ページ(2024年春)
        </Link>
        <Accordion title="プレゼンの教科書" className="p-info__acc">
          <Link
            href="https://lit.sh/Presenv1"
            target="_brank"
            className="p-info__link"
          >
            プレゼンの教科書(初級)
          </Link>
          <Link
            href="https://lit.sh/Presenv2"
            target="_brank"
            className="p-info__link"
          >
            プレゼンの教科書(中級)
          </Link>{" "}
          <Link
            href="https://lit.sh/Presenv3"
            target="_brank"
            className="p-info__link"
          >
            プレゼンの教科書(上級)
          </Link>
        </Accordion>
      </div>
    </div>
  );
};

export default Page;
