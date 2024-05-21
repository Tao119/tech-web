import SignOutButton from "@/components/signOutButton";
import { useRouter } from "next/navigation";

const Menu = ({
  children: icon,
  closeMenu,
}: {
  children: React.ReactNode;
  closeMenu: () => void;
}) => {
  const router = useRouter();
  return (
    <div className="l-menu">
      {icon}
      <span className="l-menu__title">メニュー</span>
      <span
        className="l-menu__link"
        onClick={() => {
          router.push("/mypage");
          closeMenu();
        }}
      >
        マイページ
      </span>
      <span
        className="l-menu__link"
        onClick={() => {
          router.push("info");
          closeMenu();
        }}
      >
        情報(工事中)
      </span>
      <span
        className="l-menu__link"
        onClick={() => {
          router.push("question");
          closeMenu();
        }}
      >
        質問(工事中)
      </span>
      <span
        className="l-menu__link"
        onClick={() => {
          router.push("sushida");
          closeMenu();
        }}
      >
        寿司打
      </span>
      <span
        className="l-menu__link"
        onClick={() => {
          router.push("games");
          closeMenu();
        }}
      >
        おすすめゲーム(工事中)
      </span>
      <span
        className="l-menu__link"
        onClick={() => {
          router.push("products");
          closeMenu();
        }}
      >
        作品コーナー(工事中)
      </span>
      <SignOutButton className="l-menu-signout" label="サインアウト" />
    </div>
  );
};

export default Menu;
