"use client";
import { useState, useEffect } from "react";
import Header from "./components/layout/header";
import Footer from "./components/layout/footer";
import RecipeAdd from "./components/layout/RecipeAdd";
import RecipeDetails from "./components/layout/RecipeDetail";
import RecipeEditForm from "./components/layout/RecipeEdit";

// Recipe 및 Version 인터페이스 정의
interface Version {
  version: number;
  timestamp: string;
  title: string;
  tags: string[];
  ingredients: string[];
  processes: string[];
  timers: number[];
  activeVersion?: boolean; // 선택적 속성으로 정의
}

interface Recipe {
  id: number;
  title: string;
  tags: string[];
  ingredients: string[];
  processes: string[];
  timers: number[]; // 타이머 속성 추가
  version: number;
  versionHistory: Version[]; // versionHistory에 Version 타입을 적용
}

export default function Home() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isAddingRecipe, setIsAddingRecipe] = useState<boolean>(false);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [isEditingRecipe, setIsEditingRecipe] = useState<boolean>(false);
  const [editedRecipe, setEditedRecipe] = useState<Recipe | null>(null);

  useEffect(() => {
    const storedUserEmail = localStorage.getItem("loggedInUser");
    if (storedUserEmail) {
      setUserEmail(storedUserEmail);

      const storedRecipes = localStorage.getItem(`recipes_${storedUserEmail}`);
      if (storedRecipes) {
        const allRecipes: Recipe[] = JSON.parse(storedRecipes);

        const activeRecipes = allRecipes.map((recipe) => {
          const activeVersion = recipe.versionHistory.find(
            (ver) => ver.activeVersion
          );
          return activeVersion ? { ...recipe, ...activeVersion } : recipe;
        });

        setRecipes(activeRecipes);
      }
    }
  }, []);

  const handleMore = (recipeId: number) => {
    const recipe = recipes.find((r) => r.id === recipeId);
    if (recipe) {
      const activeVersion = recipe.versionHistory.find(
        (ver) => ver.activeVersion
      );
      const selectedRecipe = activeVersion
        ? { ...recipe, ...activeVersion }
        : recipe;
      setSelectedRecipe(selectedRecipe);
    }
  };

  const handleAddRecipe = (newRecipe: {
    title: string;
    tags: string[];
    ingredients: string[];
    processes: string[];
    timers: number[]; // 타이머 추가
  }) => {
    const updatedRecipes: Recipe[] = [
      ...recipes,
      {
        id: Date.now(),
        ...newRecipe,
        version: 1,
        versionHistory: [],
      },
    ];
    setRecipes(updatedRecipes);
    localStorage.setItem(
      `recipes_${userEmail}`,
      JSON.stringify(updatedRecipes)
    );
    setIsAddingRecipe(false);
  };

  const handleEditRecipe = (recipeId: number) => {
    const recipeToEdit = recipes.find((r) => r.id === recipeId);
    if (recipeToEdit) {
      setEditedRecipe(recipeToEdit);
      setIsEditingRecipe(true);
    }
  };

  const handleSaveEditedRecipe = (updatedRecipe: Recipe) => {
    const updatedRecipes = recipes.map((recipe) =>
      recipe.id === updatedRecipe.id
        ? {
            ...updatedRecipe,
            versionHistory: [
              ...updatedRecipe.versionHistory,
              {
                version: recipe.version,
                timestamp: new Date().toISOString(),
                title: recipe.title,
                tags: recipe.tags,
                ingredients: recipe.ingredients,
                processes: recipe.processes,
                timers: recipe.timers, // 타이머도 기록에 추가
                activeVersion: false,
              },
            ],
          }
        : recipe
    );

    setRecipes(updatedRecipes);
    if (userEmail) {
      localStorage.setItem(
        `recipes_${userEmail}`,
        JSON.stringify(updatedRecipes)
      );
    }

    setIsEditingRecipe(false);
    setSelectedRecipe(null);
  };

  const handleRestoreVersion = (recipeId: number, version: Version) => {
    const updatedRecipes = recipes.map((recipe) => {
      if (recipe.id === recipeId) {
        const restoredRecipe: Recipe = {
          ...recipe,
          title: version.title,
          tags: version.tags,
          ingredients: version.ingredients,
          processes: version.processes,
          timers: version.timers, // 복원할 때 타이머도 포함
          version: version.version,
        };

        const updatedVersionHistory = recipe.versionHistory.map((ver) => ({
          ...ver,
          activeVersion: ver.version === version.version,
        }));

        return {
          ...restoredRecipe,
          versionHistory: updatedVersionHistory,
        };
      }
      return recipe;
    });

    setRecipes(updatedRecipes);
    if (userEmail) {
      localStorage.setItem(
        `recipes_${userEmail}`,
        JSON.stringify(updatedRecipes)
      );
    }

    setSelectedRecipe(null);
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
          ) : isEditingRecipe && editedRecipe ? (
            <RecipeEditForm
              editedRecipe={editedRecipe}
              setEditedRecipe={
                setEditedRecipe as React.Dispatch<React.SetStateAction<Recipe>>
              }
              onSaveChanges={handleSaveEditedRecipe}
              onClose={() => {
                setIsEditingRecipe(false);
                setEditedRecipe(null);
              }}
            />
          ) : selectedRecipe ? (
            <div className="bg-white rounded-lg p-6 shadow-lg w-full">
              <RecipeDetails
                recipe={selectedRecipe}
                onRestore={(recipeId, version) => {
                  handleRestoreVersion(recipeId, version);
                }}
                onClose={(updatedRecipe) => {
                  const updatedRecipes = recipes.map((recipe) =>
                    recipe.id === updatedRecipe.id ? updatedRecipe : recipe
                  );

                  setRecipes(updatedRecipes);

                  if (userEmail) {
                    localStorage.setItem(
                      `recipes_${userEmail}`,
                      JSON.stringify(updatedRecipes)
                    );
                  }

                  setSelectedRecipe(null);
                }}
              />
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
                  {recipes.map((recipe) => (
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
