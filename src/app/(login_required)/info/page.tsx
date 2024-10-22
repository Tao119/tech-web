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
import { Links, LinksData, readLinks } from "@/models/links";
import { CommonLinksData, readCommonLinks } from "@/models/commonLinks";

const Page = () => {
  const [err, setErr] = useState("");
  const [groupData, setGroupData] = useState<GroupData>();
  const [linksData, setLinksData] = useState<Links[]>([]);
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

    const linksRes = await readLinks(userData?.id!, res.data.id);
    const commonLinksRes = await readCommonLinks(res.data.id);

    if (
      linksRes.success &&
      commonLinksRes.success &&
      linksRes.data &&
      commonLinksRes.data
    ) {
      const l = linksRes.data.concat(commonLinksRes.data);
      setLinksData(l);
    }
    setGroupData(res.data);
    endLottie();
  };

  return (
    <div className="p-info">
      <span className="p-info__title">情報</span>
      <div className="p-info__links">
        {linksData?.map((l) => (
          <Link
            href={l.link}
            target="_brank"
            className="p-info__link"
            key={l.label}
          >
            {l.label}
          </Link>
        ))}
        {/* <Accordion title="プレゼンの教科書" className="p-info__acc">
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
        </Accordion> */}
      </div>
    </div>
  );
};

export default Page;
