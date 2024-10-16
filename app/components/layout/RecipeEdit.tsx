import React from "react";

interface Recipe {
  id: number;
  title: string;
  tags: string[];
  ingredients: string[];
  processes: string[];
  timers: number[];
  version: number;
  versionHistory: {
    version: number;
    timestamp: string;
    title: string;
    tags: string[];
    ingredients: string[];
    processes: string[];
    timers: number[];
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
    setEditedRecipe({
      ...editedRecipe,
      processes: updatedProcesses,
    });
  };

  const handleSave = () => {
    const updatedRecipe = {
      ...editedRecipe,
      version: (editedRecipe.versionHistory?.length ?? 0) + 1,
      versionHistory: [
        ...(editedRecipe.versionHistory ?? []),
        {
          version: (editedRecipe.versionHistory?.length ?? 0) + 1,
          timestamp: new Date().toISOString(),
          title: editedRecipe.title,
          tags: editedRecipe.tags,
          ingredients: editedRecipe.ingredients,
          processes: editedRecipe.processes,
          timers: editedRecipe.timers,
        },
      ],
    };
    onSaveChanges(updatedRecipe);
  };

  return (
    <div className="p-6 bg-white rounded-lg">
      <h2 className="text-xl font-bold mb-4 text-black">레시피 수정</h2>
      {/* 제목 */}
      <input
        type="text"
        name="title"
        value={editedRecipe.title}
        onChange={handleInputChange}
        placeholder="레시피 제목"
        className="border border-gray-300 rounded-md p-2 mb-4 w-full focus:outline-none focus:ring-2 focus:ring-green-400"
      />

      {/* 재료 */}
      <div className="mb-4">
        <h3 className="font-semibold mb-2 text-black">재료 목록</h3>
        {editedRecipe.ingredients.map((ingredient, index) => (
          <div key={index} className="flex items-center mb-2">
            <input
              type="text"
              value={ingredient}
              onChange={(e) => handleIngredientChange(index, e.target.value)}
              placeholder={`재료 ${index + 1}`}
              className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-green-400"
            />
            <button
              onClick={() => handleDeleteIngredient(index)}
              className="text-my-color2 text-lg font-bold ml-2"
            >
              &times;
            </button>
          </div>
        ))}
        <button
          onClick={handleAddIngredient}
          className="bg-my-color2 text-white hover:text-black rounded-md p-2"
        >
          재료 추가
        </button>
      </div>

      {/* 태그 */}
      <div className="mb-4">
        <h3 className="font-semibold mb-2 text-black">태그</h3>
        {editedRecipe.tags.map((tag, index) => (
          <div key={index} className="flex items-center mb-2">
            <input
              type="text"
              value={tag}
              onChange={(e) => handleTagChange(index, e.target.value)}
              placeholder={`태그 ${index + 1}`}
              className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-green-400"
            />
            <button
              onClick={() => handleDeleteTag(index)}
              className="text-my-color2 text-lg font-bold ml-2"
            >
              &times;
            </button>
          </div>
        ))}
        <button
          onClick={handleAddTag}
          className="bg-my-color2 text-white hover:text-black rounded-md p-2"
        >
          태그 추가
        </button>
      </div>

      {/* 조리 과정 */}
      <div className="mb-4">
        <h3 className="font-semibold mb-2 text-black">조리 과정</h3>
        {editedRecipe.processes.map((process, index) => (
          <div key={index} className="flex items-center mb-2">
            <input
              type="text"
              value={process}
              onChange={(e) => handleProcessChange(index, e.target.value)}
              placeholder={`조리 과정 ${index + 1}`}
              className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-green-400"
            />
            <button
              onClick={() => handleDeleteProcess(index)}
              className="text-my-color2 text-lg font-bold ml-2"
            >
              &times;
            </button>
          </div>
        ))}
        <button
          onClick={handleAddProcess}
          className="bg-my-color2 text-white hover:text-black rounded-md p-2"
        >
          조리 과정 추가
        </button>
      </div>

      <div className="flex justify-end mt-4">
        <button
          onClick={handleSave}
          className="bg-my-color2 hover:text-black text-white rounded-md p-2  mr-2"
        >
          저장
        </button>
        <button
          onClick={onClose}
          className="bg-gray-500 text-white rounded-md p-2 hover:text-black"
        >
          닫기
        </button>
      </div>
    </div>
  );
};

export default RecipeEditForm;
