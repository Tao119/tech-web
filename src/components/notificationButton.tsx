import Image from "next/image";
import { MouseEventHandler } from "react";
import CrossImage from "@/assets/img/notification.svg";

interface Props {
  className?: string;
  onClick?: MouseEventHandler;
  unread?: boolean;
}

export const NotificationButton = (props: Props) => {
  return (
    <button
      className={`c-notification-button ${props.className || ""}`}
      onClick={props.onClick}
    >
      <Image alt="" src={CrossImage} className="c-notification-button__image" />
      {props.unread ? <div className="c-notification-button__new"></div> : null}
    </button>
  );
};
