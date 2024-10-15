// components/RecipeEditForm.tsx
import React from "react";

interface Recipe {
  id: number;
  title: string;
  tags: string[];
  ingredients: string[];
  processes: string[];
  timers: number[]; // 각 조리 과정의 타이머 (초)
  version: number;
  versionHistory: {
    version: number;
    timestamp: string;
    title: string;
    tags: string[];
    ingredients: string[];
    processes: string[];
    timers: number[]; // 버전별 타이머
    activeVersion?: boolean;
  }[];
}

interface RecipeEditFormProps {
  editedRecipe: Recipe;
  setEditedRecipe: React.Dispatch<React.SetStateAction<Recipe>>;
  onSaveChanges: (updatedRecipe: Recipe) => void;
  onClose: () => void;
}

const RecipeEditForm: React.FC<RecipeEditFormProps> = ({
  editedRecipe,
  setEditedRecipe,
  onSaveChanges,
  onClose,
}) => {
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setEditedRecipe({ ...editedRecipe, [name]: value });
  };

  const handleAddIngredient = () => {
    setEditedRecipe((prev) => ({
      ...prev,
      ingredients: [...prev.ingredients, ""],
    }));
  };

  const handleIngredientChange = (index: number, value: string) => {
    const updatedIngredients = [...editedRecipe.ingredients];
    updatedIngredients[index] = value;
    setEditedRecipe({ ...editedRecipe, ingredients: updatedIngredients });
  };

  const handleDeleteIngredient = (index: number) => {
    const updatedIngredients = editedRecipe.ingredients.filter(
      (_, i) => i !== index
    );
    setEditedRecipe({ ...editedRecipe, ingredients: updatedIngredients });
  };

  const handleAddTag = () => {
    setEditedRecipe((prev) => ({
      ...prev,
      tags: [...prev.tags, ""],
    }));
  };

  const handleTagChange = (index: number, value: string) => {
    const updatedTags = [...editedRecipe.tags];
    updatedTags[index] = value;
    setEditedRecipe({ ...editedRecipe, tags: updatedTags });
  };

  const handleDeleteTag = (index: number) => {
    const updatedTags = editedRecipe.tags.filter((_, i) => i !== index);
    setEditedRecipe({ ...editedRecipe, tags: updatedTags });
  };

  const handleAddProcess = () => {
    setEditedRecipe((prev) => ({
      ...prev,
      processes: [...prev.processes, ""],
      timers: [...prev.timers, 0], // 새로운 과정 추가 시 기본 타이머 0초 설정
    }));
  };

  const handleProcessChange = (index: number, value: string) => {
    const updatedProcesses = [...editedRecipe.processes];
    updatedProcesses[index] = value;
    setEditedRecipe({ ...editedRecipe, processes: updatedProcesses });
  };

  const handleDeleteProcess = (index: number) => {
    const updatedProcesses = editedRecipe.processes.filter(
      (_, i) => i !== index
    );
    const updatedTimers = editedRecipe.timers.filter((_, i) => i !== index); // 타이머도 함께 삭제
    setEditedRecipe({
      ...editedRecipe,
      processes: updatedProcesses,
      timers: updatedTimers,
    });
  };

  // 타이머 설정 변경
  const handleTimerChange = (index: number, value: string) => {
    const updatedTimers = [...editedRecipe.timers];
    updatedTimers[index] = parseInt(value) || 0; // 숫자로 변환, 숫자가 아니면 0으로 설정
    setEditedRecipe({ ...editedRecipe, timers: updatedTimers });
  };

  // 버전 히스토리 로컬에 저장
  const handleSave = () => {
    const updatedRecipe = {
      ...editedRecipe,
      version: editedRecipe.version + 1,
      versionHistory: [
        ...(editedRecipe.versionHistory ?? []), // versionHistory가 undefined인 경우 빈 배열로 초기화
        {
          version: editedRecipe.version,
          timestamp: new Date().toISOString(),
          title: editedRecipe.title,
          tags: editedRecipe.tags,
          ingredients: editedRecipe.ingredients,
          processes: editedRecipe.processes,
          timers: editedRecipe.timers, // 저장할 때 타이머 정보도 포함
        },
      ],
    };
    onSaveChanges(updatedRecipe);
  };

  return (
    <div className="p-6 bg-white rounded-lg">
      <h2 className="text-xl font-bold mb-4 text-green-800">레시피 수정</h2>
      <input
        type="text"
        name="title"
        value={editedRecipe.title}
        onChange={handleInputChange}
        placeholder="레시피 제목"
        className="border border-green-300 rounded-md p-2 mb-4 w-full focus:outline-none focus:ring-2 focus:ring-green-400"
      />

      {/* 재료 목록 */}
      <div className="mb-4">
        <h3 className="font-semibold mb-2 text-green-600">재료 목록</h3>
        {editedRecipe.ingredients.map((ingredient, index) => (
          <div key={index} className="flex items-center mb-2">
            <input
              type="text"
              value={ingredient}
              onChange={(e) => handleIngredientChange(index, e.target.value)}
              placeholder={`재료 ${index + 1}`}
              className="border border-green-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-green-400"
            />
            <button
              onClick={() => handleDeleteIngredient(index)}
              className="bg-red-500 text-white rounded-md p-2 ml-2 hover:bg-red-600 whitespace-nowrap"
            >
              삭제
            </button>
          </div>
        ))}
        <button
          onClick={handleAddIngredient}
          className="bg-green-500 text-white rounded-md p-2 hover:bg-green-600"
        >
          재료 추가
        </button>
      </div>

      {/* 태그 */}
      <div className="mb-4">
        <h3 className="font-semibold mb-2 text-green-600">태그</h3>
        {editedRecipe.tags.map((tag, index) => (
          <div key={index} className="flex items-center mb-2">
            <input
              type="text"
              value={tag}
              onChange={(e) => handleTagChange(index, e.target.value)}
              placeholder={`태그 ${index + 1}`}
              className="border border-green-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-green-400"
            />
            <button
              onClick={() => handleDeleteTag(index)}
              className="bg-red-500 text-white rounded-md p-2 ml-2 hover:bg-red-600 whitespace-nowrap"
            >
              삭제
            </button>
          </div>
        ))}
        <button
          onClick={handleAddTag}
          className="bg-green-500 text-white rounded-md p-2 hover:bg-green-600"
        >
          태그 추가
        </button>
      </div>

      {/* 조리 과정 */}
      <div className="mb-4">
        <h3 className="font-semibold mb-2 text-green-600">조리 과정</h3>
        {editedRecipe.processes.map((process, index) => (
          <div key={index} className="mb-2">
            <div className="flex items-center">
              <input
                type="text"
                value={process}
                onChange={(e) => handleProcessChange(index, e.target.value)}
                placeholder={`조리 과정 ${index + 1}`}
                className="border border-green-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-green-400"
              />
              <button
                onClick={() => handleDeleteProcess(index)}
                className="bg-red-500 text-white rounded-md p-2 ml-2 hover:bg-red-600 whitespace-nowrap"
              >
                삭제
              </button>
            </div>
            <input
              type="number"
              value={editedRecipe.timers[index] || 0} // undefined일 경우 0으로 처리
              onChange={(e) => handleTimerChange(index, e.target.value)}
              placeholder="타이머 설정 (초)"
              className="border border-blue-300 rounded-md p-2 w-full mt-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
        ))}
        <button
          onClick={handleAddProcess}
          className="bg-green-500 text-white rounded-md p-2 hover:bg-green-600"
        >
          조리 과정 추가
        </button>
      </div>

      <div className="flex justify-end mt-4">
        <button
          onClick={handleSave}
          className="bg-blue-500 text-white rounded-md p-2 hover:bg-blue-600 mr-2"
        >
          저장
        </button>
        <button
          onClick={onClose}
          className="bg-gray-500 text-white rounded-md p-2 hover:bg-gray-600"
        >
          닫기
        </button>
      </div>
    </div>
  );
};

export default RecipeEditForm;
