"use client";
import Image from "next/image";
import MenuImage from "@/assets/img/menu.png";
import CloseImage from "@/assets/img/close.png";
import Menu from "./menu";
import { useState } from "react";
import { useParams, usePathname, useRouter } from "next/navigation";

export default function GuestLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathName = usePathname();
  const [showMenu, setShowMenu] = useState(false);

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
      {pathName != "/mypage" ? <></> : null}
      {children}
    </>
  );
}
