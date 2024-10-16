"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function LoginButton() {
  const { data: session, status } = useSession(); // 세션 정보와 상태 가져오기
  const [isLocalLoggedIn, setIsLocalLoggedIn] = useState<boolean>(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false); // 최종 로그인 상태
  const router = useRouter();

  useEffect(() => {
    // 로컬 스토리지에서 로그인 상태 확인
    const localLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    setIsLocalLoggedIn(localLoggedIn);

    // 세션이 유효하거나 로컬 로그인이 되어 있으면 최종 로그인 상태를 true로 설정
    if (session || localLoggedIn) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, [session]); // 세션이 변경될 때마다 확인

  const handleLoginPage = () => {
    router.push("/login");
  };

  const clearUserData = () => {
    const loggedInUser = localStorage.getItem("loggedInUser");
    if (loggedInUser) {
      console.log(`사용자 ${loggedInUser}의 데이터가 유지됩니다.`);
    }

    // 로그인 상태 제거 (하지만 사용자의 데이터는 유지)
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("loggedInUser");
  };

  const handleLocalSignOut = () => {
    clearUserData();
    setIsLocalLoggedIn(false);
    setIsLoggedIn(false);
    alert("로그아웃되었습니다.");
    window.location.reload(); // 로그아웃 후 페이지 새로고침
  };

  const handleGoogleSignOut = async () => {
    try {
      clearUserData(); // 로컬 스토리지 정리
      await signOut({ callbackUrl: "/" }); // Google OAuth 세션 로그아웃
      console.log("Google 로그아웃 완료");
    } catch (error) {
      console.error("Google 로그아웃 중 오류가 발생했습니다:", error);
    }
  };

  const handleSignOut = () => {
    if (session) {
      handleGoogleSignOut(); // Google OAuth 로그아웃 처리
    } else {
      handleLocalSignOut(); // 로컬 로그아웃 처리
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
