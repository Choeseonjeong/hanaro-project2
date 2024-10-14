"use client";
import { useState, useEffect } from "react";
import Header from "./components/layout/header";
import Footer from "./components/layout/footer";

export default function Home() {
  const [recipes, setRecipes] = useState<{ title: string; tags: string[] }[]>(
    []
  );

  useEffect(() => {
    const storedRecipe = localStorage.getItem("newRecipe");
    if (storedRecipe) {
      const newRecipe = JSON.parse(storedRecipe);
      setRecipes((prevRecipes) => [...prevRecipes, newRecipe]);

      localStorage.removeItem("newRecipe");
    }
  }, []);

  return (
    <div className="p-8 max-w-xl mx-auto">
      <Header />
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">List</h2>
        {recipes.length === 0 ? (
          <p className="text-gray-500">추가된 레시피가 없습니다.</p>
        ) : (
          <div className="space-y-4">
            {recipes.map((recipe, index) => (
              <div key={index} className="border p-4 rounded shadow">
                <h2 className="text-xl font-semibold">{recipe.title}</h2>
                <div className="flex flex-wrap gap-2 mt-2">
                  {recipe.tags.map((tag, tagIndex) => (
                    <span
                      key={tagIndex}
                      className="bg-gray-200 text-gray-800 px-3 py-1 rounded-full"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
