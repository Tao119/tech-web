"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const ClientComponent = () => {
  const router = useRouter();
  useEffect(() => {
    router.push("mypage");
  }, []);

  return <></>;
};

export default ClientComponent;
