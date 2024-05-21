import Image from "next/image";
import { MouseEventHandler } from "react";
import CrossImage from "@/assets/img/cross.svg";

interface Props {
  className?: string;
  onClick?: MouseEventHandler;
}

export const CloseButton = (props: Props) => {
  return (
    <button
      className={`c-close-button ${props.className || ""}`}
      onClick={props.onClick}
    >
      <Image alt="" src={CrossImage} className="c-close-button__image" />
    </button>
  );
};
