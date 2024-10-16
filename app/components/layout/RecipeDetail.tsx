import React, { useState, useEffect } from "react";
import RecipeEditForm from "./RecipeEdit";

interface Version {
  version: number;
  timestamp: string;
  title: string;
  tags: string[];
  ingredients: string[];
  processes: string[];
  timers: number[];
  activeVersion?: boolean;
}
interface Recipe {
  id: number;
  title: string;
  tags: string[];
  ingredients: string[];
  processes: string[];
  timers: number[];
  version: number;
  versionHistory: Version[];
}
interface RecipeDetailsProps {
  recipe: Recipe;
  onRestore: (recipeId: number, version: Version) => void;
  onClose: (updatedRecipe: Recipe) => void;
  onDelete: (recipeId: number) => void;
}

const RecipeDetails: React.FC<RecipeDetailsProps> = ({
  recipe,
  onRestore,
  onClose,
  onDelete,
}) => {
  const [editMode, setEditMode] = useState<boolean>(false);
  const [editedRecipe, setEditedRecipe] = useState(recipe);
  const [timers, setTimers] = useState<number[]>(recipe.timers || []);

  useEffect(() => {
    if (
      !editedRecipe.versionHistory ||
      editedRecipe.versionHistory.length === 0
    ) {
      const initialVersion: Version = {
        version: 1,
        timestamp: new Date().toISOString(),
        title: editedRecipe.title,
        tags: editedRecipe.tags,
        ingredients: editedRecipe.ingredients,
        processes: editedRecipe.processes,
        timers: editedRecipe.timers,
        activeVersion: true,
      };

      const updatedRecipe = {
        ...editedRecipe,
        versionHistory: [initialVersion],
      };

      setEditedRecipe(updatedRecipe);
      saveToLocalStorage(updatedRecipe);
    }
  }, [editedRecipe]);

  const saveToLocalStorage = (updatedRecipe: Recipe) => {
    localStorage.setItem(`recipe_${recipe.id}`, JSON.stringify(updatedRecipe));
  };

  const handleRestore = (version: Version) => {
    const restoredRecipe = {
      ...editedRecipe,
      title: version.title,
      tags: version.tags,
      ingredients: version.ingredients,
      processes: version.processes,
      timers: version.timers,
      version: version.version,
    };
    setEditedRecipe(restoredRecipe);
    setTimers(version.timers);
    saveToLocalStorage(restoredRecipe);

    localStorage.setItem(
      `recipe_${recipe.id}_lastVersion`,
      version.version.toString()
    );
  };

  const handleEdit = () => {
    setEditMode(true);
  };

  const handleSaveChanges = (updatedRecipe: Recipe) => {
    const newVersion: Version = {
      version: editedRecipe.versionHistory.length + 1,
      timestamp: new Date().toISOString(),
      title: updatedRecipe.title,
      tags: updatedRecipe.tags,
      ingredients: updatedRecipe.ingredients,
      processes: updatedRecipe.processes,
      timers: updatedRecipe.timers,
      activeVersion: true,
    };

    const updatedVersionHistory = editedRecipe.versionHistory.map((ver) => ({
      ...ver,
      activeVersion: false,
    }));

    const updatedRecipeWithVersion = {
      ...updatedRecipe,
      versionHistory: [...updatedVersionHistory, newVersion],
    };

    setEditedRecipe(updatedRecipeWithVersion);
    saveToLocalStorage(updatedRecipeWithVersion);
    setEditMode(false);
  };

  const handleStartTimer = (index: number, duration: number) => {
    setTimeout(() => {
      alert(`Step ${index + 1}의 시간이 지났습니다.`);
    }, duration * 1000);
  };

  const handleSetTimer = (index: number, duration: number) => {
    const updatedTimers = [...timers];
    updatedTimers[index] = duration;
    setTimers(updatedTimers);

    const updatedRecipe = { ...editedRecipe, timers: updatedTimers };
    setEditedRecipe(updatedRecipe);
    saveToLocalStorage(updatedRecipe);

    handleStartTimer(index, duration);
  };

  if (editMode) {
    return (
      <RecipeEditForm
        editedRecipe={editedRecipe}
        setEditedRecipe={setEditedRecipe}
        onSaveChanges={handleSaveChanges}
        onClose={() => setEditMode(false)}
      />
    );
  }

  return (
    <div className=" inset-0 flex justify-center items-center">
      <div
        className="bg-white p-6 max-w-lg mx-auto w-full max-w-3xl overflow-auto"
        style={{ maxHeight: "500px", scrollbarWidth: "none" }}
      >
        <h1 className="text-2xl font-bold mb-4">{editedRecipe.title}</h1>
        <h2 className="text-xl mb-4">조리 과정</h2>
        <ul className="list-decimal list-inside mb-4">
          {editedRecipe.processes.map((step, index) => (
            <li key={index} className="mb-2">
              Step {index + 1}: {step}
              <div className="flex items-center mt-2">
                <input
                  type="number"
                  placeholder="타이머 설정 (초)"
                  value={timers[index] || 0}
                  onChange={(e) =>
                    handleSetTimer(index, Number(e.target.value))
                  }
                  className="border p-1 w-24 mr-2"
                />
                <button
                  onClick={() => handleStartTimer(index, timers[index])}
                  className="px-3 py-1  text-white rounded-lg bg-my-color2 hover:text-black"
                >
                  타이머 시작
                </button>
              </div>
            </li>
          ))}
        </ul>
        <h3 className="text-lg mt-8 mb-2 font-bold">#태그</h3>
        <div className="mb-4 flex flex-wrap gap-2">
          {editedRecipe.tags.map((tag, index) => (
            <span key={index} className="bg-gray-200 px-3 py-1 rounded-full">
              #{tag}
            </span>
          ))}
        </div>

        <div className="mb-4">
          <h3 className="text-lg mb-2 font-bold">수정 기록</h3>

          {editedRecipe?.versionHistory?.map((ver, index) => (
            <div key={index} className="mb-2">
              <span className="mr-2">
                버전 {ver.version} (수정일: {ver.timestamp})
              </span>
              <button
                onClick={() => handleRestore(ver)}
                className="px-3 py-1 bg-my-color2 hover:text-black text-white rounded-lg"
              >
                이 버전으로 복원
              </button>
            </div>
          ))}
        </div>

        <div className="flex gap-4 mt-4">
          <button
            className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:text-black"
            onClick={handleEdit}
          >
            수정
          </button>
          <button
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:text-black"
            onClick={() => onDelete(editedRecipe.id)}
          >
            삭제
          </button>
          <button
            className="px-4 py-2 bg-gray-300 rounded-lg text-white hover:text-black"
            onClick={() => onClose(editedRecipe)}
          >
            목록으로
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecipeDetails;
