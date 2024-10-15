"use client";
import { useState, useEffect } from "react";
import Header from "./components/layout/header";
import Footer from "./components/layout/footer";
import RecipeAdd from "./components/layout/RecipeAdd";
import RecipeDetails from "./components/layout/RecipeDetail";

export default function Home() {
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
  const [isAddingRecipe, setIsAddingRecipe] = useState<boolean>(false);
  const [selectedRecipe, setSelectedRecipe] = useState<null | {
    id: string;
    title: string;
    tags: string[];
    ingredients?: string[];
    processes?: string[];
    version?: number;
    versionHistory?: any[];
  }>(null);

  useEffect(() => {
    const storedUserEmail = localStorage.getItem("loggedInUser");
    if (storedUserEmail) {
      setUserEmail(storedUserEmail);

      const storedRecipes = localStorage.getItem(`recipes_${storedUserEmail}`);
      if (storedRecipes) {
        const allRecipes = JSON.parse(storedRecipes);

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

  const handleMore = (recipeId: string) => {
    const recipe = recipes.find((r) => r.id === recipeId);
    if (recipe) {
      setSelectedRecipe(recipe);
    }
  };

  const handleAddRecipe = (newRecipe: {
    title: string;
    tags: string[];
    ingredients: string[];
    processes: string[];
  }) => {
    const updatedRecipes = [
      ...recipes,
      { id: Date.now().toString(), ...newRecipe },
    ];
    setRecipes(updatedRecipes);
    localStorage.setItem(
      `recipes_${userEmail}`,
      JSON.stringify(updatedRecipes)
    );
    setIsAddingRecipe(false);
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
        <Header onShowAddRecipe={() => setIsAddingRecipe(true)} />
        <div className="flex-grow mt-8">
          {isAddingRecipe ? (
            <RecipeAdd onAddRecipe={handleAddRecipe} />
          ) : selectedRecipe ? (
            <div className="bg-white rounded-lg p-6 w-full">
              <RecipeDetails
                recipe={{
                  id: parseInt(selectedRecipe.id, 10),
                  title: selectedRecipe.title,
                  tags: selectedRecipe.tags,
                  ingredients: selectedRecipe.ingredients || [],
                  processes: selectedRecipe.processes || [],
                  version: selectedRecipe.version || 1,
                  versionHistory: selectedRecipe.versionHistory || [],
                }}
                onEdit={(recipeId) => {
                  // Logic to handle edit
                }}
                onRestore={(recipeId, version) => {
                  // Logic to handle version restore
                }}
                onClose={() => setSelectedRecipe(null)}
              />
              <div className="flex gap-4 mt-4">
                <button
                  className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
                  onClick={() => setSelectedRecipe(null)}
                >
                  목록으로
                </button>
              </div>
            </div>
          ) : (
            <>
              <h2 className="text-2xl font-bold mb-4">Recipe List</h2>
              {recipes.length === 0 ? (
                <p className="text-gray-500 font-bold">
                  추가된 레시피가 없습니다.
                </p>
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
            </>
          )}
        </div>
        <Footer />
      </div>
    </div>
  );
}
