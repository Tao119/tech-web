import Image from "next/image";
import { useState, useEffect } from "react";
import ArrowLeft from "@/assets/img/arrow_left.svg";
import ArrowRight from "@/assets/img/arrow_right.svg";

interface Props {
  className?: string;
  page?: number;
  total?: number;
  all: number;
  updatePage: (_: number) => void;
}

export const Pagination = (props: Props) => {
  const [current, setPage] = useState(props.page || 1);
  const [[prev, next], setStatus] = useState<string[]>(["", ""]);
  const [items, setItems] = useState<(string | number)[]>([]);
  const total = props.total || 20;
  const all = props.all;
  const max = Math.ceil(all / total);

  useEffect(() => {
    setPage(props.page!);

    setStatus([
      current <= 1 ? "is-hidden" : "",
      current >= max ? "is-hidden" : "",
    ]);

    const paginationItems = [];
    for (let i = current; i <= Math.min(current + 4, max); i++) {
      paginationItems.push(i);
    }
    if (paginationItems.length < 5) {
      for (let i = current - 1; i > 0; i--) {
        paginationItems.unshift(i);
        if (paginationItems.length === 5) break;
      }
    }
    setItems(paginationItems);
  }, [props, all, current, max, total]);

  const updatePage = (page: number) => {
    if (page > 0 && page <= max) {
      setPage(page);
      props.updatePage(page);
    }
  };

  return (
    <>
      <div className={`c-pagination ${props.className || ""}`}>
        <div className="c-pagination__nav">
          <ul className="c-pagination__nav-item">
            {max > 5 && current > 1 ? (
              <li
                className={"c-pagination__nav-link " + prev}
                onClick={() => updatePage(current - 1)}
              >
                <Image src={ArrowLeft} alt="" />
              </li>
            ) : (
              <></>
            )}
            {items.map((page, index) => (
              <li
                key={index}
                className={`c-pagination__nav-link ${
                  page === current
                    ? "-active"
                    : page === "..."
                    ? "-disabled"
                    : ""
                }`}
                onClick={() => updatePage(page as number)}
              >
                <div className="c-pagination__nav-text">{page}</div>
              </li>
            ))}
            {max > 5 && current < max ? (
              <li
                className={"c-pagination__nav-link " + next}
                onClick={() => updatePage(current + 1)}
              >
                <Image src={ArrowRight} alt="" />
              </li>
            ) : (
              <></>
            )}
          </ul>
        </div>
      </div>
    </>
  );
};
