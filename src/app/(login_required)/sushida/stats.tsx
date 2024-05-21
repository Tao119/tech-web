import React, { useContext, useEffect, useRef, useState } from "react";
import moment from "moment";
import { courses } from "./save";
import { Switcher } from "@/components/switcher";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { SushidaData } from "@/models/sushida";
import { Pagination } from "@/components/pagination";

const Stats = (props: { data: SushidaData[] }) => {
  const [selectedCourse, setCourse] = useState(3000);
  const [page, setPage] = useState(1);
  const total = 5;

  const formatData = (data: SushidaData[]) => {
    const newData: { [course: number]: SushidaData[] } = {};
    courses.forEach((course) => {
      newData[course] = data.filter((d) => d.course == course);
    });
    return newData;
  };
  const sushidaData: { [course: number]: SushidaData[] } = formatData(
    props.data
  );

  const sortedDataByScore = [...sushidaData[selectedCourse]].sort((a, b) =>
    a.score < b.score ? 1 : -1
  );

  const sortedDataByDate = [...sushidaData[selectedCourse]].sort((a, b) =>
    a.date < b.date ? 1 : -1
  );
  const showData = sortedDataByDate
    .slice((page - 1) * total, page * total)
    .reverse();

  const maxScore =
    Math.ceil(Math.max(...showData.map((item) => item.score)) / 1000) * 1000;

  return (
    <>
      <Switcher
        className="p-sushida-stats__switcher"
        contents={courses}
        data={courses}
        onChange={setCourse}
      />
      <div className="p-sushida-stats__highscore">
        <div className="p-sushida-stats__highscore-text">
          現在の最高スコア：
          <span className="p-sushida-stats__highscore-number">
            {sortedDataByScore.length > 0
              ? sortedDataByScore[0].score
              : "スコアが存在しません"}
          </span>
        </div>
      </div>
      <div className="p-sushida-stats__graph">
        <LineChart
          width={400}
          height={200}
          data={showData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="" />
          <XAxis
            dataKey="date"
            tickFormatter={(unixTime) => moment(unixTime).format("M/D")}
          />
          <YAxis
            domain={[-3000, maxScore]}
            ticks={[-1 * selectedCourse, 0, maxScore]}
          />
          <Tooltip
            labelFormatter={(label) => moment(label).format("MMMM D, YYYY")}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="score"
            name="点数"
            stroke="#8884d8"
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </div>
      <div className="p-sushida-stats__history">
        <span className="p-sushida-stats__history-title">過去の結果</span>
        <ul className="p-sushida-stats__history-list">
          {sortedDataByDate
            .slice((page - 1) * total, page * total)
            .map((data) => (
              <li className="p-sushida-stats__history-item">
                <div className="p-sushida-stats__history-score">
                  {data.score}
                </div>
                <div className="p-sushida-stats__history-others">
                  <div className="p-sushida-stats__history-data">
                    タイプ速度：{data.typeSpeed}
                  </div>
                  <div className="p-sushida-stats__history-data">
                    ミスタイプ：{data.missNum}
                  </div>
                  <div className="p-sushida-stats__history-data">
                    登録日時　：{data.date.toLocaleDateString()}
                  </div>
                </div>
              </li>
            ))}
        </ul>
        <div className="p-sushida-stats__pagination">
          <Pagination
            page={page}
            all={sortedDataByDate.length}
            total={total}
            updatePage={setPage}
          />
          <span className="p-sushida-stats__pagination-page">
            {sortedDataByDate.length}件中{(page - 1) * total + 1}~{page * total}
            件を表示
          </span>
        </div>
      </div>
    </>
  );
};
export default Stats;
