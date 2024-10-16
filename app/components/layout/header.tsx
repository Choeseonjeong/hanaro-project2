"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import LoginButton from "../ui/LoginButton";
import { useSession } from "next-auth/react";

export default function Header({
  onShowAddRecipe,
}: {
  onShowAddRecipe: () => void;
}) {
  const { data: session } = useSession();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const loggedIn = session ? true : false;
    setIsLoggedIn(loggedIn);
  }, [session]);

  const handleAddRecipe = () => {
    if (isLoggedIn) {
      onShowAddRecipe();
    } else {
      alert("로그인 해주세요.");
    }
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
          <LoginButton />
        </div>
      </header>
    </>
  );
}
