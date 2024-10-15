"use client";
import { useState, useEffect } from "react";
import Header from "./components/layout/header";
import Footer from "./components/layout/footer";
import RecipeAdd from "./components/layout/RecipeAdd";
import RecipeDetails from "./components/layout/RecipeDetail";
import RecipeEditForm from "./components/layout/RecipeEdit";

interface Recipe {
  id: number;
  title: string;
  tags: string[];
  ingredients: string[];
  processes: string[];
  version: number;
  versionHistory: {
    version: number;
    timestamp: string;
    title: string;
    tags: string[];
    ingredients: string[];
    processes: string[];
    activeVersion?: boolean;
  }[];
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

  const handleRestoreVersion = (recipeId: number, version: any) => {
    const updatedRecipes = recipes.map((recipe) => {
      if (recipe.id === recipeId) {
        const restoredRecipe: Recipe = {
          ...recipe,
          title: version.title,
          tags: version.tags,
          ingredients: version.ingredients,
          processes: version.processes,
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
                  // 레시피 업데이트
                  const updatedRecipes = recipes.map((recipe) =>
                    recipe.id === updatedRecipe.id ? updatedRecipe : recipe
                  );

                  setRecipes(updatedRecipes);

                  // 로컬 스토리지에도 저장
                  if (userEmail) {
                    localStorage.setItem(
                      `recipes_${userEmail}`,
                      JSON.stringify(updatedRecipes)
                    );
                  }

                  // 선택된 레시피 상태 초기화
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
