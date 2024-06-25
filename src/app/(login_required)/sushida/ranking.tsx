import { AnimationContext, GroupContext } from "@/app/contextProvider";
import React, { useContext, useEffect, useRef, useState } from "react";
import LoadingAnimation from "@/assets/json/loading-animation.json";
import { convertToCamelCase } from "@/services/convert";
import {
  RankingData,
  SushidaData,
  readSushidaDataByGroupId,
} from "@/models/sushida";
import Image from "next/image";
import { Switcher } from "@/components/switcher";
import { courses } from "./save";
import { Pagination } from "@/components/pagination";
import { GroupData, readGroupById } from "@/models/groups";
import SampleIcon from "@/assets/img/icon-sample.png";

const Ranking = () => {
  const { selectedGroup, setGroup } = useContext(GroupContext)!;
  const [groupData, setGroupData] = useState<GroupData>();
  const [selectedCourse, setCourse] = useState(3000);
  const [data, setData] = useState<RankingData[]>([]);
  const { startLottie, endLottie } = useContext(AnimationContext)!;

  const today = new Date();
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(today.getDate() - 6);
  oneWeekAgo.setHours(0, 0, 0, 0);

  const sortedDataByDate = [...data].sort((a, b) => (a.date < b.date ? 1 : -1));
  const maxScoresByName = [...data].reduce<Record<string, RankingData>>(
    (acc, item) => {
      if (!acc[item.userName] || acc[item.userName].score < item.score) {
        acc[item.userName] = item;
      }
      return acc;
    },
    {}
  );
  const maxScoresByNameThisWeek = [...data]
    .filter((d) => d.date >= oneWeekAgo)
    .reduce<Record<string, RankingData>>((acc, item) => {
      if (!acc[item.userName] || acc[item.userName].score < item.score) {
        acc[item.userName] = item;
      }
      return acc;
    }, {});

  const sortedDataByScore: RankingData[] = Object.values(maxScoresByName).sort(
    (a, b) => b.score - a.score
  );

  const sortedDataByScoreInThisWeek = Object.values(
    maxScoresByNameThisWeek
  ).sort((a, b) => b.score - a.score);

  const [page, setPage] = useState(1);
  const total = 10;

  useEffect(() => {
    const fetchData = async () => {
      if (!selectedGroup) return;
      startLottie(LoadingAnimation);
      const res = await readSushidaDataByGroupId(selectedGroup);
      const res2 = await readGroupById(selectedGroup);
      if (!res.success || !res.data || !res2.success || !res2.data) {
        console.error(res.error);
        return;
      }
      setData(res.data);
      setGroupData(res2.data);
      endLottie();
    };
    fetchData();
  }, [selectedGroup]);

  return (
    <>
      <Switcher
        className="p-sushida-stats__switcher"
        contents={courses}
        data={courses}
        onChange={setCourse}
      />
      <div className="p-sushida-ranking__top">
        <span className="p-sushida-ranking__top-title">
          {selectedCourse}円コース　ランキング({groupData?.name})
        </span>
        <div className="p-sushida-ranking__top-contents">
          <div className="p-sushida-ranking__top-content">
            <span className="p-sushida-ranking__top-sub">全期間</span>
            {sortedDataByScore.filter((d) => d.course == selectedCourse)
              .length == 0 ? (
              <span>データが存在しません</span>
            ) : (
              sortedDataByScore
                .filter((d) => d.course == selectedCourse)
                .slice(0, 3)
                .map((d, index) => (
                  <li className="p-sushida-ranking__top-item" key={index}>
                    <div
                      className={`p-sushida-ranking__top-rank ${
                        index == 0
                          ? "-gold"
                          : index == 1
                          ? "-silver"
                          : "-bronze"
                      }`}
                    >
                      {index + 1}位
                    </div>
                    <div className="p-sushida-ranking__top-data">
                      <div className="p-sushida-ranking__top-score u-mr36">
                        {d.score}
                      </div>
                      {d.userIcon ? (
                        <Image
                          className="p-sushida-ranking__top-icon"
                          src={d.userIcon}
                          alt=""
                          height={30}
                          width={30}
                        />
                      ) : (
                        <Image
                          className="p-sushida-ranking__top-icon"
                          src={SampleIcon}
                          alt=""
                        />
                      )}
                      <div className="p-sushida-ranking__top-name">
                        {d.userName}
                      </div>
                    </div>
                    {d.image ? <Image src={d.image} alt="" /> : null}
                  </li>
                ))
            )}
          </div>
          <div className="p-sushida-ranking__top-content">
            <span className="p-sushida-ranking__top-sub">今週</span>
            {sortedDataByScoreInThisWeek.filter(
              (d) => d.course == selectedCourse
            ).length == 0 ? (
              <span>データが存在しません</span>
            ) : (
              sortedDataByScoreInThisWeek
                .filter((d) => d.course == selectedCourse)
                .slice(0, 3)
                .map((d, index) => (
                  <li className="p-sushida-ranking__top-item" key={index}>
                    <div
                      className={`p-sushida-ranking__top-rank ${
                        index == 0
                          ? "-gold"
                          : index == 1
                          ? "-silver"
                          : "-bronze"
                      }`}
                    >
                      {index + 1}位
                    </div>
                    <div className="p-sushida-ranking__top-data">
                      <div className="p-sushida-ranking__top-score u-mr36">
                        {d.score}
                      </div>
                      {d.userIcon ? (
                        <Image
                          className="p-sushida-ranking__top-icon"
                          src={d.userIcon}
                          alt=""
                          height={30}
                          width={30}
                        />
                      ) : (
                        <Image
                          className="p-sushida-ranking__top-icon"
                          src={SampleIcon}
                          alt=""
                        />
                      )}
                      <div className="p-sushida-ranking__top-name">
                        {d.userName}
                      </div>
                    </div>
                    {d.image ? <Image src={d.image} alt="" /> : null}
                  </li>
                ))
            )}
          </div>
        </div>
      </div>
      <div className="p-sushida-ranking__timeline">
        <span className="p-sushida-ranking__timeline-title">タイムライン</span>
        <ul className="p-sushida-ranking__timeline-list">
          {sortedDataByDate
            .slice((page - 1) * total, page * total)
            .map((d, index) => (
              <li key={index} className="p-sushida-ranking__timeline-item">
                <div className="p-sushida-ranking__timeline-score">
                  {d.score}
                </div>
                {d.userIcon ? (
                  <Image
                    className="p-sushida-ranking__timeline-icon"
                    src={d.userIcon}
                    alt=""
                    height={30}
                    width={30}
                  />
                ) : (
                  <Image
                    className="p-sushida-ranking__timeline-icon"
                    src={SampleIcon}
                    alt=""
                  />
                )}
                <div className="p-sushida-ranking__timeline-name">
                  {d.userName}
                </div>
                <div className="p-sushida-stats__timeline-others">
                  <div className="p-sushida-ranking__timeline-data">
                    コース：{d.course}
                  </div>
                  <div className="p-sushida-ranking__timeline-data">
                    タイプ速度：{d.typeSpeed}
                  </div>
                  <div className="p-sushida-ranking__timeline-data">
                    ミスタイプ：{d.missNum}
                  </div>
                </div>
                <div className="p-sushida-ranking__timeline-date">
                  <div className="p-sushida-ranking__timeline-data">
                    {d.date.toLocaleDateString()}
                  </div>
                </div>
              </li>
            ))}
        </ul>
        <Pagination
          page={page}
          all={sortedDataByDate.length}
          total={total}
          updatePage={setPage}
        />
      </div>
    </>
  );
};
export default Ranking;
