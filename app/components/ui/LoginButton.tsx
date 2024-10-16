"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function LoginButton() {
  const { data: session, status } = useSession();
  const [isLocalLoggedIn, setIsLocalLoggedIn] = useState<boolean>(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const localLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    setIsLocalLoggedIn(localLoggedIn);

    if (session || localLoggedIn) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, [session]);

  const handleLoginPage = () => {
    router.push("/login");
  };

  const clearUserData = () => {
    const loggedInUser = localStorage.getItem("loggedInUser");
    if (loggedInUser) {
      console.log(`사용자 ${loggedInUser}의 데이터가 유지`);
    }

    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("loggedInUser");
  };

  const handleLocalSignOut = () => {
    clearUserData();
    setIsLocalLoggedIn(false);
    setIsLoggedIn(false);
    alert("로그아웃되었습니다.");
    window.location.reload();
  };

  const handleGoogleSignOut = async () => {
    try {
      clearUserData();
      await signOut({ callbackUrl: "/" });
      console.log("Google 로그아웃 완료");
    } catch (error) {
      console.error("Google 로그아웃 중 오류가 발생:", error);
    }
  };

  const handleSignOut = () => {
    if (session) {
      handleGoogleSignOut();
    } else {
      handleLocalSignOut();
    }
  };

  if (isLoggedIn) {
    return (
      <button
        className="text-gray-500 hover:text-black"
        onClick={handleSignOut}
      >
        로그아웃
      </button>
    );
  }

  return (
    <button
      className="text-gray-400 font-bold text-sm"
      onClick={handleLoginPage}
    >
      로그인
    </button>
  );
}
