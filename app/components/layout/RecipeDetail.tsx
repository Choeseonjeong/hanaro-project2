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
  recipe: {
    id: number;
    title: string;
    tags: string[];
    ingredients: string[];
    processes: string[];
    timers: number[];
    version: number;
    versionHistory: Version[];
  };
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
    const savedRecipe = localStorage.getItem(`recipe_${recipe.id}`);
    if (savedRecipe) {
      const parsedRecipe = JSON.parse(savedRecipe);

      if (
        !parsedRecipe.versionHistory ||
        parsedRecipe.versionHistory.length === 0
      ) {
        const initialVersion: Version = {
          version: 1,
          timestamp: new Date().toISOString(),
          title: parsedRecipe.title,
          tags: parsedRecipe.tags,
          ingredients: parsedRecipe.ingredients,
          processes: parsedRecipe.processes,
          timers: parsedRecipe.timers,
          activeVersion: true,
        };
        parsedRecipe.versionHistory = [initialVersion];
      }

      setEditedRecipe(parsedRecipe);
    }
  }, [recipe.id]);

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
  };

  const handleEdit = () => {
    setEditMode(true);
  };

  const handleSaveChanges = (updatedRecipe: Recipe) => {
    setEditedRecipe(updatedRecipe);
    saveToLocalStorage(updatedRecipe);
    setEditMode(false);
  };

  const handleStartTimer = (index: number, duration: number) => {
    setTimeout(() => {
      alert(`Step ${index + 1}의 타이머가 완료되었습니다.`);
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

  useEffect(() => {
    setTimers(editedRecipe.timers || []);
    saveToLocalStorage(editedRecipe);
  }, [editedRecipe]);

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
                  className="px-3 py-1 bg-blue-500 text-white rounded-lg"
                >
                  타이머 시작
                </button>
              </div>
            </li>
          ))}
        </ul>
        <h3 className="text-lg mt-8 mb-2">#태그</h3>
        <div className="mb-4 flex flex-wrap gap-2">
          {editedRecipe.tags.map((tag, index) => (
            <span key={index} className="bg-gray-200 px-3 py-1 rounded-full">
              #{tag}
            </span>
          ))}
        </div>

        <div className="mb-4">
          <h3 className="text-lg mb-2">수정 기록</h3>
          {editedRecipe?.versionHistory?.map((ver, index) => (
            <div key={index} className="mb-2">
              <span className="mr-2">
                버전 {ver.version} (수정일: {ver.timestamp})
              </span>
              <button
                onClick={() => handleRestore(ver)}
                className="px-3 py-1 bg-blue-500 text-white rounded-lg"
              >
                이 버전으로 복원
              </button>
            </div>
          ))}
        </div>

        <div className="flex gap-4 mt-4">
          <button
            className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
            onClick={handleEdit}
          >
            수정
          </button>
          <button
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
            onClick={() => onDelete(editedRecipe.id)} // 삭제 버튼 핸들러
          >
            삭제
          </button>
          <button
            className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
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
