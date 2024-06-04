import { useRouter } from "next/navigation";
import BackImage from "@/assets/img/arrow_left.svg";
import Image from "next/image";

interface Props {
  className?: string;
  back?: Function;
}

export const BackButton = (props: Props) => {
  const router = useRouter();
  return (
    <Image
      src={BackImage}
      alt=""
      className={`c-back-button ${props.className || ""}`}
      onClick={() => {
        props.back ? props.back() : router.back();
      }}
    />
  );
};
