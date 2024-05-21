"use client";
import { useContext, useEffect, useState } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db } from "@/firebase/client";
import { signIn as signInByNextAuth, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import hideInput from "@/assets/img/hide_input.svg";
import showInput from "@/assets/img/show_input.svg";
import Image from "next/image";
import SigninAnimation from "@/assets/json/signin-animation.json";
import { AnimationContext, UserContext } from "@/app/contextProvider";
import { FirebaseError } from "firebase/app";
import { createUser, readUserById } from "@/models/users";

const Page = () => {
  const { userData } = useContext(UserContext)!;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [name, setName] = useState("");
  const [err, setErr] = useState("");
  const router = useRouter();
  const { startLottie, endLottie } = useContext(AnimationContext)!;

  useEffect(() => {
    if (userData) router.push("mypage");
  }, [userData]);

  const handleSignUp = async () => {
    try {
      if (password !== passwordConfirm) {
        setErr("確認用パスワードが一致しません");
        return;
      }

      startLottie(SigninAnimation);

      try {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        const user = userCredential.user;

        await updateProfile(user, { displayName: name });

        await createUser(user.uid, user.email!, name);

        const idToken = await user.getIdToken();
        const userData = await readUserById(user.uid);

        const result = await signInByNextAuth("credentials", {
          idToken,
          userData,
          redirect: false,
        });

        if (result?.ok) {
          router.push("/mypage");
        } else {
          setErr("ユーザー登録中にエラーが発生しました");
        }
      } catch (firebaseError: any) {
        if (firebaseError instanceof FirebaseError) {
          switch (firebaseError.code) {
            case "auth/email-already-in-use":
              setErr("既に使用されているメールアドレスです");
              break;
            case "auth/invalid-email":
              setErr("無効なメールアドレスです");
              break;
            case "auth/operation-not-allowed":
              setErr("この操作は許可されていません");
              break;
            case "auth/weak-password":
              setErr("パスワードが弱すぎます");
              break;
            default:
              setErr("Firebaseエラーが発生しました");
          }
        } else {
          setErr("ユーザー登録中にエラーが発生しました");
        }
      }
    } catch (error: any) {
      setErr("ユーザー登録中にエラーが発生しました");
    }
    endLottie();
  };

  return (
    <div className="p-signup">
      <span className="p-signup__title">サインアップ</span>
      <span className="p-signin__err">{err}</span>
      <div className="p-signup__item">
        <span className="p-signup__input-label">メールアドレス</span>
        <input
          className="p-signup__input"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="example@co.jp"
        />
      </div>
      <div className="p-signup__item">
        <span className="p-signup__input-label">パスワード</span>
        <input
          className="p-signup__input"
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="password"
        />
        <Image
          className="p-signup__input-icon"
          src={showPassword ? hideInput : showInput}
          alt=""
          onClick={() => {
            setShowPassword(!showPassword);
          }}
        />
      </div>
      <div className="p-signup__item">
        <span className="p-signup__input-label">パスワード（確認用）</span>
        <input
          className="p-signup__input"
          type={showPasswordConfirm ? "text" : "password"}
          value={passwordConfirm}
          onChange={(e) => setPasswordConfirm(e.target.value)}
          placeholder="password(confirm)"
        />{" "}
        <Image
          className="p-signup__input-icon"
          src={showPasswordConfirm ? hideInput : showInput}
          alt=""
          onClick={() => {
            setShowPasswordConfirm(!showPasswordConfirm);
          }}
        />
      </div>
      <div className="p-signup__item">
        <span className="p-signup__input-label">名前</span>
        <input
          className="p-signup__input"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="name"
        />
      </div>
      <button
        className={`p-signup__submit ${
          !email! || !password! || !passwordConfirm! || !name!
            ? "-disabled"
            : ""
        }`}
        disabled={!email! || !password! || !passwordConfirm! || !name!}
        onClick={handleSignUp}
      >
        Sign Up
      </button>
      <span className="p-signup__link" onClick={() => router.push("signin")}>
        サインイン
      </span>
    </div>
  );
};

export default Page;
