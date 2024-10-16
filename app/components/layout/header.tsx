"use client";
import { useEffect, useState } from "react";
import LoginButton from "../ui/LoginButton";

export default function Header({
  onShowAddRecipe,
}: {
  onShowAddRecipe: () => void;
}) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const loggedInUser = localStorage.getItem("loggedInUser");
    if (loggedInUser) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  const handleAddRecipe = () => {
    onShowAddRecipe();
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
