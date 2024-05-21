import { useState, useEffect } from "react";

interface Props {
  selectDate: (_: string) => void;
}

export const Calendar = (props: Props) => {
  const daysOfWeek = ["S", "M", "T", "W", "T", "F", "S"];
  const today = new Date();
  const todayYear = today.getFullYear();
  const todayMonth = today.getMonth();
  const todayDate = today.getDate();
  const [displayMonth, setMonth] = useState([todayYear, todayMonth]);
  const [selectodayDate, selectDate] = useState([
    todayYear,
    todayMonth,
    todayDate,
  ]);
  const [calendar, setCalendar] = useState(
    [] as ({ date: number; progress: number } | null)[][]
  );

  useEffect(() => {
    const [year, month] = displayMonth;
    const firstDay = new Date(year, month, 1).getDay();
    const lastDate = new Date(year, month + 1, 0).getDate();
    const data = [] as { date: number; progress: number }[][];
    let index = firstDay;
    let week = new Array(7).fill(null);

    for (let i = 1; i <= lastDate; i++) {
      let totalTasks = 0;
      let doneTasks = 0;

      week[index] = {
        date: i,
        progress: totalTasks == 0 ? null : doneTasks / totalTasks,
      };

      index = (index + 1) % 7;
      if (index == 0 || i == lastDate) {
        data.push(week);
        week = new Array(7).fill(null);
      }
    }
    setCalendar(data);
    selectDate([
      year,
      month,
      todayMonth == month && todayYear == year ? todayDate : 1,
    ]);
  }, [displayMonth, todayMonth, todayYear, todayDate]);

  const updateMonth = (direction: number) => {
    const [year, month] = displayMonth;
    const [newYear, newMonth] =
      month + direction == 12
        ? [year + 1, 0]
        : month + direction == -1
        ? [year - 1, 11]
        : [year, month + direction];

    setMonth([newYear, newMonth]);
    props.selectDate(
      `${newYear}-${(newMonth + 1).toString().padStart(2, "0")}-${
        todayMonth == newMonth && todayYear == newYear
          ? todayDate.toString().padStart(2, "0")
          : "01"
      }`
    );
  };

  return (
    <>
      <div className="p-calendar">
        <div className="p-calendar__items">
          <div className="p-calendar__select-date">{`${selectodayDate[0]} 年 ${
            selectodayDate[1] + 1
          } 月 ${selectodayDate[2]} 日`}</div>
          <div className="p-calendar__buttons">
            <div
              className="p-calendar__button"
              onClick={() => {
                updateMonth(-1);
              }}
            >
              <img
                className="p-calendar__button-icon"
                src="assets/img/triangle-left.png"
              />
            </div>
            <div
              className="p-calendar__button"
              onClick={() => {
                updateMonth(1);
              }}
            >
              <img
                className="p-calendar__button-icon"
                src="assets/img/triangle-right.png"
              />
            </div>
          </div>
        </div>
        <table className="p-calendar__calendar-outline">
          <thead>
            <tr>
              {daysOfWeek.map((day) => (
                <th className="p-calendar__cell .-header">{day}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {calendar.map((week) => (
              <tr>
                {week.map((day) => (
                  <td
                    className={`p-calendar__cell 
                                            ${
                                              displayMonth[0] ==
                                                selectodayDate[0] &&
                                              displayMonth[1] ==
                                                selectodayDate[1] &&
                                              day?.date == selectodayDate[2]
                                                ? "-selected "
                                                : ""
                                            }\
                                            ${
                                              displayMonth[0] == todayYear &&
                                              displayMonth[1] == todayMonth &&
                                              day?.date === todayDate
                                                ? "-today "
                                                : ""
                                            }`}
                    onClick={() => {
                      day?.date != null &&
                        (selectDate([
                          displayMonth[0],
                          displayMonth[1],
                          day?.date,
                        ]),
                        props.selectDate(
                          `${displayMonth[0]}-${(displayMonth[1] + 1)
                            .toString()
                            .padStart(2, "0")}-${day.date
                            .toString()
                            .padStart(2, "0")}`
                        ));
                    }}
                  >
                    <span className="p-calendar__label">{day?.date}</span>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};
