import Image from "next/image";
import { MouseEventHandler } from "react";
import CrossImage from "@/assets/img/notification.svg";

interface Props {
  className?: string;
  onClick?: MouseEventHandler;
}

export const NotificationButton = (props: Props) => {
  return (
    <button
      className={`c-close-button ${props.className || ""}`}
      onClick={props.onClick}
    >
      <Image alt="" src={CrossImage} className="c-close-button__image" />
    </button>
  );
};
