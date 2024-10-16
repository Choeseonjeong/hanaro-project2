"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function LoginButton() {
  const { data: session } = useSession();
  const [isLocalLoggedIn, setIsLocalLoggedIn] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    if (isLoggedIn === "true") {
      setIsLocalLoggedIn(true);
    }
  }, []);

  const handleLoginPage = () => {
    router.push("/login");
  };
  const handleSignInPage = () => {
    router.push("/signin");
  };

  const handleLocalSignOut = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("loggedInUser");
    setIsLocalLoggedIn(false);
    alert("로그아웃되었습니다.");
    window.location.reload();
  };

  if (session || isLocalLoggedIn) {
    return (
      <>
        <button
          className="text-gray-500 hover:text-black"
          onClick={() => (session ? signOut() : handleLocalSignOut())}
        >
          Sign out
        </button>
      </>
    );
  }

  return (
    <>
      <button
        className="text-gray-400 font-bold text-sm"
        onClick={handleLoginPage}
      >
        로그인
      </button>
      &nbsp;&nbsp;
      <button
        className="text-gray-400  font-bold text-sm"
        onClick={handleSignInPage}
      >
        회원가입
      </button>
    </>
  );
}
