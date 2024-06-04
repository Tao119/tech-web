import React, { ReactElement, ReactNode } from "react";

type Props = {
  title: string;
  open?: boolean;
  children: ReactNode;
  isSelected: boolean;
  setSelection: Function;
};

export const Accordion: React.VFC<Props> = (props) => {
  const accordionClick = (e: React.MouseEvent<HTMLElement>) => {
    const _this: HTMLElement = e.currentTarget;
    const thisParent = _this.closest<HTMLElement>(".c-accordion");
    const thisContent = thisParent?.querySelector(".c-accordion__content");

    if (thisContent && thisParent) {
      if (thisParent.classList.contains("-active")) {
        thisParent.classList.remove("-active");
        thisContent.classList.remove("-active");
      } else {
        thisParent.classList.add("-active");
        thisContent.classList.add("-active");
      }
    }
  };
  return (
    <>
      <div className={props.open ? "c-accordion -active" : "c-accordion"}>
        <div className="c-accordion__header">
          <input
            type="checkbox"
            className="c-accordion__check"
            onChange={() => props.setSelection()}
            checked={props.isSelected}
          />
          <span onClick={accordionClick} className="c-accordion__title">
            {props.title}
          </span>
        </div>
        <div className="c-accordion__content">{props.children}</div>
      </div>
    </>
  );
};

export default Accordion;
