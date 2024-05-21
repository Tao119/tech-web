import { MouseEventHandler } from "react";

interface Props {
  className?: string;
  onClick?: MouseEventHandler;
}

export const OverLay = (props: Props) => {
  return (
    <div
      className={`c-overlay ${props.className || ""}`}
      onClick={props.onClick}
    />
  );
};
