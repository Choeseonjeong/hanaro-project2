"use client";
import { useState, useEffect } from "react";
import Header from "../components/layout/header";
import Footer from "../components/layout/footer";
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
      version?: number;
      activeVersion?: boolean;
    }[]
  >([]);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  // 유저 이메일 및 레시피 불러오기
  useEffect(() => {
    const storedUserEmail = localStorage.getItem("loggedInUser");
    if (storedUserEmail) {
      setUserEmail(storedUserEmail);

      const storedRecipes = localStorage.getItem(`recipes_${storedUserEmail}`);
      if (storedRecipes) {
        const allRecipes = JSON.parse(storedRecipes);

        // 각 레시피의 활성화된 버전만 불러오기
        const activeRecipes = allRecipes.map((recipe: any) => {
          const versionHistory = JSON.parse(
            localStorage.getItem(`versionHistory_${recipe.id}`) || "[]"
          );
          const activeVersion = versionHistory.find(
            (ver: any) => ver.activeVersion
          );
          return activeVersion || recipe;
        });

        setRecipes(activeRecipes);
      }
    }
  }, []);

  // 새로 추가된 레시피를 불러와서 업데이트
  useEffect(() => {
    if (userEmail) {
      const storedRecipe = localStorage.getItem("newRecipe");
      if (storedRecipe) {
        const newRecipe = JSON.parse(storedRecipe);
        const updatedRecipes = [...recipes, newRecipe];
        setRecipes(updatedRecipes);
        localStorage.setItem(
          `recipes_${userEmail}`,
          JSON.stringify(updatedRecipes)
        );
        localStorage.removeItem("newRecipe");
      }
    }
  }, [userEmail]); // recipes 의존성 제거

  // "더보기" 버튼 클릭 시 레시피 상세 정보 보기
  const handleMore = (recipeId: string) => {
    router.push(`/detailRep?id=${recipeId}`); // 레시피 ID를 URL에 포함하여 상세 페이지로 이동
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
                <div key={index} className="border p-4 rounded shadow">
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
                      onClick={() => handleMore(recipe.id)} // 고유 레시피 ID로 이동
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
