"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import LoginButton from "../ui/LoginButton";

export default function Header() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn") === "true";
    setIsLoggedIn(loggedIn);
  }, []);

  const handleAddRecipe = () => {
    if (isLoggedIn) {
      router.push("/addRep");
    } else {
      alert("로그인 후에 레시피를 추가할 수 있습니다.");
    }
  };

  const handleMain = () => {
    router.push("/");
  };

  return (
    <>
      <header className="flex justify-between items-center p-4">
        <button
          className="text-4xl font-bold font-serif text-black"
          onClick={handleMain}
        >
          My Recipe
        </button>
        <div>
          <button
            className="mr-4 text-gray-500 px-4 py-2 font-bold hover:text-my-color2"
            onClick={handleAddRecipe}
          >
            레시피 추가
          </button>
          <LoginButton />
        </div>
      </header>
    </>
  );
}
