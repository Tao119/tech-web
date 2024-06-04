import React, { ReactElement, ReactNode } from "react";

type Props = {
  title: string;
  open?: boolean;
  children: ReactNode;
  isSelected: boolean;
  setSelection: Function;
  checkbox?: boolean;
};

export const Accordion = (props: Props) => {
  const accordionClick = (e: React.MouseEvent<HTMLElement>) => {
    const _this: HTMLElement = e.currentTarget;
    const thisParent = _this.closest<HTMLElement>(".c-accordion");
    const thisContent = thisParent?.querySelector(".c-accordion__content");

    if (thisContent) {
      if (thisContent.classList.contains("-active")) {
        thisContent.classList.remove("-active");
      } else {
        thisContent.classList.add("-active");
      }
    }
  };
  return (
    <>
      <div className="c-accordion">
        <div className="c-accordion__header">
          {props.checkbox ? (
            <input
              type="checkbox"
              className="c-accordion__check"
              onChange={() => props.setSelection()}
              checked={props.isSelected}
            />
          ) : null}
          <span onClick={accordionClick} className="c-accordion__title">
            {props.title}
          </span>
        </div>
        <div
          className={
            props.open ? "c-accordion__content -active" : "c-accordion__content"
          }
        >
          {props.children}
        </div>
      </div>
    </>
  );
};

export default Accordion;
