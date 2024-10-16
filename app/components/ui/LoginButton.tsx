"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function LoginButton() {
  const { data: session, status } = useSession(); // 세션 상태 가져오기
  const [isLocalLoggedIn, setIsLocalLoggedIn] = useState<boolean>(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false); // 최종 로그인 상태
  const router = useRouter();

  useEffect(() => {
    // 로컬 스토리지에서 로그인 상태 확인
    const localLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    setIsLocalLoggedIn(localLoggedIn);

    // 세션이 유효하거나 로컬 로그인이 되어 있으면 isLoggedIn을 true로 설정
    if (session || localLoggedIn) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, [session]); // 세션이 변경될 때마다 확인

  const handleLoginPage = () => {
    router.push("/login");
  };

  const handleLocalSignOut = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("loggedInUser");
    setIsLocalLoggedIn(false);
    setIsLoggedIn(false);
    alert("로그아웃되었습니다.");
    window.location.reload(); // 로그아웃 후 페이지 새로고침
  };

  const handleSignOut = () => {
    if (session) {
      signOut({ callbackUrl: "/" }); // 로그아웃 후 홈으로 리디렉션
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
        Sign out
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
