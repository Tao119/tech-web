"use client";
import { useContext, useEffect, useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { signIn as signInByNextAuth, useSession } from "next-auth/react";
import { auth, db } from "@/firebase/client";
import { useRouter } from "next/navigation";
import hideInput from "@/assets/img/hide_input.svg";
import showInput from "@/assets/img/show_input.svg";
import Image from "next/image";
import SigninAnimation from "@/assets/json/signin-animation.json";
import { AnimationContext, UserContext } from "@/app/contextProvider";
import { FirebaseError } from "firebase/app";
import { readUserById } from "@/models/users";

const Page = () => {
  const { userData } = useContext(UserContext)!;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [err, setErr] = useState("");
  const router = useRouter();
  const { startLottie, endLottie } = useContext(AnimationContext)!;

  useEffect(() => {
    if (userData) router.push("mypage");
  }, [userData]);

  const handleSignIn = async () => {
    try {
      startLottie(SigninAnimation);

      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      const idToken = await user.getIdToken();
      const userData = await readUserById(user.uid);

      const result = await signInByNextAuth("credentials", {
        idToken,
        userData,
        redirect: false,
      });

      if (result?.ok) {
        router.push("/mypage");
      }
    } catch (error: any) {
      let errorMessage = "サインイン中にエラーが発生しました";

      if (error instanceof FirebaseError) {
        switch (error.code) {
          case "auth/invalid-email":
            errorMessage = "無効なメールアドレスです";
            break;
          case "auth/user-disabled":
            errorMessage = "このユーザーアカウントは無効化されています";
            break;
          case "auth/user-not-found":
            errorMessage = "ユーザーが見つかりません";
            break;
          case "auth/wrong-password":
            errorMessage = "パスワードが間違っています";
            break;
          case "auth/invalid-credential":
            errorMessage = "無効な認証情報です";
            break;
          default:
            errorMessage = "Firebaseエラーが発生しました";
        }
      } else if (error.message.includes("NextAuth")) {
        errorMessage = "認証中にエラーが発生しました";
      } else {
        errorMessage = "サインイン中にエラーが発生しました";
      }

      setErr(errorMessage);
      endLottie();
    }
  };

  return (
    <div className="p-signin">
      <span className="p-signin__title">サインイン</span>
      <span className="p-signin__err">{err}</span>
      <div className="p-signin__item">
        <span className="p-signin__input-label">メールアドレス</span>
        <input
          className="p-signin__input"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="example@co.jp"
        />
      </div>
      <div className="p-signin__item">
        <span className="p-signin__input-label">パスワード</span>
        <input
          className="p-signin__input"
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="password"
        />
        <Image
          className="p-signin__input-icon"
          src={showPassword ? hideInput : showInput}
          alt=""
          onClick={() => {
            setShowPassword(!showPassword);
          }}
        />
      </div>
      <button
        className={`p-signin__submit ${
          !email! || !password! ? "-disabled" : ""
        }`}
        disabled={!email! || !password!}
        onClick={handleSignIn}
      >
        Sign In
      </button>
      <span className="p-signin__link" onClick={() => router.push("/signup")}>
        サインアップ
      </span>
    </div>
  );
};

export default Page;
