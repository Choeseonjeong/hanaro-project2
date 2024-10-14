"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import LoginButton from "../ui/LoginButton";

export default function Header() {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleAddRecipe = () => {
    if (isClient) {
      router.push("/addRep");
    }
  };
  const handleMain = () => {
    if (isClient) {
      router.push("/");
    }
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
