import Image from "next/image";
import { MouseEventHandler } from "react";
import DeleteImage from "@/assets/img/trash.svg";

interface Props {
  className?: string;
  onClick?: MouseEventHandler;
}

export const DeleteButton = (props: Props) => {
  return (
    <button
      className={`c-delete-button ${props.className || ""}`}
      onClick={props.onClick}
    >
      <Image alt="" src={DeleteImage} className="c-delete-button__image" />
    </button>
  );
};
