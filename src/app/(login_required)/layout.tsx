"use client";
import Image from "next/image";
import MenuImage from "@/assets/img/menu.png";
import CloseImage from "@/assets/img/close.png";
import Menu from "./menu";
import { useContext, useEffect, useState } from "react";
import { useParams, usePathname, useRouter } from "next/navigation";
import LoadingAnimation from "@/assets/json/loading-animation.json";
import { Filter } from "@/components/filter";
import {
  AnimationContext,
  GroupContext,
  UserContext,
} from "../contextProvider";
import { GroupData, readGroupsByUserId } from "@/models/groups";

export default function GuestLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathName = usePathname();
  const [showMenu, setShowMenu] = useState(false);
  const { userData } = useContext(UserContext)!;
  const { selectedGroup, setGroup } = useContext(GroupContext)!;
  const { startLottie, endLottie } = useContext(AnimationContext)!;
  const [groups, setGroups] = useState<GroupData[]>([]);

  const selectGroup = (id: string) => {
    setGroup(id);
    localStorage.setItem("selected_group_id", id);
  };

  const groupsData = groups.map((g) => ({ label: g.name, value: g.id }));

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

  return (
    <>
      {showMenu ? (
        <Menu closeMenu={() => setShowMenu(false)}>
          <Image
            className="l-menu-icon"
            alt=""
            src={CloseImage}
            onClick={() => {
              setShowMenu(!showMenu);
            }}
          />
        </Menu>
      ) : (
        <Image
          className="l-menu-icon"
          alt=""
          src={MenuImage}
          onClick={() => {
            setShowMenu(!showMenu);
          }}
        />
      )}
      {pathName != "/mypage" ? (
        <Filter
          options={groupsData}
          onChange={selectGroup}
          selectedValue={selectedGroup}
          className="l-filter"
        />
      ) : null}

      {children}
    </>
  );
}
