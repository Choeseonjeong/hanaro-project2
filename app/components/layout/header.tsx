"use client";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import LoginButton from "../ui/LoginButton";

export default function Header({
  onShowAddRecipe,
}: {
  onShowAddRecipe: () => void;
}) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // 로컬 스토리지에서 로그인 정보 확인
    const loggedInUser = localStorage.getItem("loggedInUser");
    if (loggedInUser) {
      setIsLoggedIn(true); // 로그인 되어 있으면 상태를 true로 설정
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  const handleAddRecipe = () => {
    onShowAddRecipe(); // 로그인 여부와 상관없이 바로 레시피 추가
  };

  const handleLogout = () => {
    // 로컬 스토리지에서 로그인 정보 제거
    localStorage.removeItem("loggedInUser");

    signOut({ callbackUrl: "/" });

    // 상태 업데이트
    setIsLoggedIn(false);
  };

  return (
    <>
      <header className="flex justify-between items-center p-4">
        <button className="text-4xl font-bold font-serif text-black">
          My Recipe
        </button>
        <div>
          <button
            className="mr-4 text-gray-500 px-4 py-2 font-bold hover:text-my-color2"
            onClick={handleAddRecipe}
          >
            레시피 추가
          </button>
          {isLoggedIn ? (
            <button
              className="text-gray-500 px-4 py-2 font-bold hover:text-red-500"
              onClick={handleLogout}
            >
              로그아웃
            </button>
          ) : (
            <LoginButton />
          )}
        </div>
      </header>
    </>
  );
}
