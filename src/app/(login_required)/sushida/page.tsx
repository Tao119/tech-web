"use client";
import React, { useContext, useEffect, useRef, useState } from "react";
import { AnimationContext, UserContext } from "@/app/contextProvider";
import { Switcher } from "@/components/switcher";
import LoadingAnimation from "@/assets/json/loading-animation.json";
import SaveResult from "./save";
import Stats from "./stats";
import Ranking from "./ranking";
import { SushidaData, readSushidaDataByUserId } from "@/models/sushida";
import Link from "next/link";

enum SushidaMenu {
  "結果",
  "登録",
  "ランキング",
}

const Page = () => {
  const [err, setErr] = useState("");
  const [data, setData] = useState<SushidaData[]>([]);
  const { startLottie, endLottie } = useContext(AnimationContext)!;
  const { userData } = useContext(UserContext)!;
  const [openingMenu, setMenu] = useState<SushidaMenu>(SushidaMenu.結果);

  useEffect(() => {
    const loadData = async () => {
      startLottie(LoadingAnimation);
      await fetchData();
      endLottie();
    };
    loadData();
  }, [userData]);

  const fetchData = async () => {
    if (!userData) return;
    const res = await readSushidaDataByUserId(userData.id);
    if (!res || !res.data) {
      console.error(res.error);
      return;
    }
    setData(res.data);
  };

  return (
    <div className="p-sushida">
      <span className="p-sushida__title">
        寿司打 (
        <Link
          href="https://sushida.net/play.html"
          target="_brank"
          className="p-sushida__title-link"
        >
          sushida.net
        </Link>
        )
      </span>

      <div className="p-sushida__content">
        <Switcher
          className="p-sushida__switcher"
          onChange={setMenu}
          contents={Object.keys(SushidaMenu).filter((key) =>
            isNaN(Number(key))
          )}
          data={
            Object.values(SushidaMenu).filter(
              (value) => typeof value === "number"
            ) as SushidaMenu[]
          }
        />
        {openingMenu == SushidaMenu.結果 ? (
          <Stats data={data} />
        ) : openingMenu == SushidaMenu.登録 ? (
          <SaveResult fetchData={fetchData} />
        ) : (
          <Ranking />
        )}
      </div>
    </div>
  );
};

export default Page;
