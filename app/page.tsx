"use client";
import { useState, useEffect } from "react";
import Header from "./components/layout/header";
import Footer from "./components/layout/footer";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [recipes, setRecipes] = useState<
    {
      id: string;
      title: string;
      tags: string[];
      ingredients?: string[];
      processes?: string[];
    }[]
  >([]);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    const storedUserEmail = localStorage.getItem("loggedInUser");
    if (storedUserEmail) {
      setUserEmail(storedUserEmail);

      const storedRecipes = localStorage.getItem(`recipes_${storedUserEmail}`);
      if (storedRecipes) {
        const allRecipes = JSON.parse(storedRecipes);
        setRecipes(allRecipes); // 레시피 설정
      }
    }
  }, []);

  const handleMore = (recipeId: string) => {
    router.push(`/detailRep?id=${recipeId}`);
  };

  return (
    <div
      className="bg-no-repeat"
      style={{
        backgroundImage: `url('/images/start1.jpg')`,
        backgroundSize: "100% auto",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="p-8 max-w-xl mx-auto min-h-screen flex flex-col bg-white">
        <Header />
        <div className="flex-grow mt-8">
          <h2 className="text-2xl font-bold mb-4">Recipe List</h2>
          {recipes.length === 0 ? (
            <p className="text-gray-500 font-bold">추가된 레시피가 없습니다.</p>
          ) : (
            <div className="space-y-4">
              {recipes.map((recipe, index) => (
                <div key={recipe.id} className="border p-4 rounded shadow">
                  <h2 className="text-xl font-semibold">{recipe.title}</h2>
                  <div className="flex mt-2 gap-2">
                    {recipe.tags.map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        className="bg-my-color text-gray-500 px-3 py-1 rounded-full"
                      >
                        #{tag}
                      </span>
                    ))}
                    <button
                      className="ml-auto rounded-lg text-sm bg-blue-500 text-white px-3 py-1"
                      onClick={() => handleMore(recipe.id)}
                    >
                      더보기
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <Footer />
      </div>
    </div>
  );
}
