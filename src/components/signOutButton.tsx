"use client";
import { signOut } from "next-auth/react";
import Image, { StaticImageData } from "next/image";

interface Props {
  className?: string;
  label?: string;
  disabled?: boolean;
  image?: StaticImageData;
}

const SignOutButton = (props: Props) => {
  return (
    <button
      className={`c-button ${props.className || ""}`}
      onClick={() => signOut({ callbackUrl: "/" })}
      disabled={props.disabled}
    >
      {props.image ? (
        <Image className="c-button__img" src={props.image} alt="pause" />
      ) : (
        props.label
      )}
    </button>
  );
};
export default SignOutButton;
