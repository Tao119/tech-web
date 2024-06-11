"use client";
import { useContext, useEffect, useState } from "react";

import { AnimationContext, GroupContext, UserContext } from "./contextProvider";
import { useSession } from "next-auth/react";
import { convertToCamelCase } from "@/services/convert";
import LoadingAnimation from "@/assets/json/loading-animation.json";
import { UserData, readUserById } from "@/models/users";
import { readGroupsByUserId } from "@/models/groups";

export default function GuestTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session } = useSession();
  const { setUserData } = useContext(UserContext)!;
  const { setGroup } = useContext(GroupContext)!;
  const { startLottie, endLottie } = useContext(AnimationContext)!;
  useEffect(() => {
    if (!session) return;

    const fetchData = async () => {
      startLottie(LoadingAnimation);
      const res = await readUserById(session.user.uid);
      if (!res || !res.data) {
        console.error(res.error);
        endLottie();
        return;
      }
      setUserData(res.data);

      const groupId = localStorage.getItem("selected_group_id");
      if (groupId) {
        setGroup(groupId);
      } else {
        const groups = await readGroupsByUserId(session.user.uid);
        if (groups.success && groups.data && groups.data?.length > 0) {
          setGroup(groups.data[0].id);
        }
      }

      endLottie();
    };
    fetchData();
  }, [session]);
  return <>{children}</>;
}
