// components/RecipeDetails.tsx
import React, { useState, useEffect } from "react";
import RecipeEditForm from "./RecipeEdit";

interface Version {
  version: number;
  timestamp: string;
  title: string;
  tags: string[];
  ingredients: string[];
  processes: string[];
  activeVersion?: boolean;
}
interface Recipe {
  id: number;
  title: string;
  tags: string[];
  ingredients: string[];
  processes: string[];
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
    version: number;
    versionHistory: Version[];
  };
  onRestore: (recipeId: number, version: Version) => void;
  onClose: (updatedRecipe: Recipe) => void; // 인자로 updatedRecipe를 받도록 수정
}

const RecipeDetails: React.FC<RecipeDetailsProps> = ({
  recipe,
  onRestore,
  onClose,
}) => {
  const [editMode, setEditMode] = useState<boolean>(false);
  const [editedRecipe, setEditedRecipe] = useState(recipe);

  // 로컬 스토리지에서 데이터 로드
  useEffect(() => {
    const savedRecipe = localStorage.getItem(`recipe_${recipe.id}`);
    if (savedRecipe) {
      setEditedRecipe(JSON.parse(savedRecipe));
    }
  }, [recipe.id]);

  // 로컬 스토리지에 데이터 저장
  const saveToLocalStorage = (updatedRecipe: typeof recipe) => {
    localStorage.setItem(`recipe_${recipe.id}`, JSON.stringify(updatedRecipe));
  };

  // 복원 함수가 호출될 때 해당 버전으로 데이터를 업데이트하고 저장
  const handleRestore = (version: Version) => {
    const restoredRecipe = {
      ...editedRecipe,
      title: version.title,
      tags: version.tags,
      ingredients: version.ingredients,
      processes: version.processes,
      version: version.version,
    };
    setEditedRecipe(restoredRecipe);
    saveToLocalStorage(restoredRecipe); // 로컬 스토리지에 저장
  };

  const handleEdit = () => {
    setEditMode(true);
  };

  const handleSaveChanges = (updatedRecipe: typeof recipe) => {
    // 수정된 내용을 로컬 스토리지에 저장
    setEditedRecipe(updatedRecipe);
    saveToLocalStorage(updatedRecipe); // 로컬 스토리지에 저장
    setEditMode(false);
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
    <div className="fixed inset-0 flex justify-center items-center">
      <div className="bg-white p-6 max-w-lg mx-auto w-full max-w-3xl max-h-[800px] overflow-auto relative">
        <h1 className="text-2xl font-bold mb-4">{editedRecipe.title}</h1>
        <h2 className="text-xl mb-4">조리 과정</h2>
        <ul className="list-decimal list-inside mb-4">
          {editedRecipe.processes.map((step, index) => (
            <li key={index} className="mb-2">
              Step {index + 1}: {step}
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
        <h3 className="text-lg mb-4">버전: {editedRecipe.version}</h3>

        {/* 버전 관리 UI */}
        <div className="mb-4">
          <h3 className="text-lg mb-2">수정 기록</h3>
          {editedRecipe?.versionHistory?.map((ver, index) => (
            <div key={index} className="mb-2">
              <span className="mr-2">
                버전 {ver.version} (수정일: {ver.timestamp}){" "}
                {ver.activeVersion && "(현재 버전)"}
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
            className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
            onClick={() => onClose(editedRecipe)} // 현재 상태 전달
          >
            목록으로
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecipeDetails;
