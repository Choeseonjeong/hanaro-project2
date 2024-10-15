// components/RecipeDetails.tsx
import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

interface Version {
  version: number;
  timestamp: string;
  title: string;
  tags: string[];
  ingredients: string[];
  processes: string[];
  activeVersion?: boolean;
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
  onEdit: (recipeId: number) => void;
  onRestore: (recipeId: number, version: Version) => void;
  onClose: () => void;
}

const RecipeDetails: React.FC<RecipeDetailsProps> = ({
  recipe,
  onEdit,
  onRestore,
  onClose,
}) => {
  const [title, setTitle] = useState<string>(recipe.title);
  const [tags, setTags] = useState<string[]>(recipe.tags);
  const [ingredients, setIngredients] = useState<string[]>(recipe.ingredients);
  const [processes, setProcesses] = useState<string[]>(recipe.processes);
  const [version, setVersion] = useState<number>(recipe.version);
  const [versionHistory, setVersionHistory] = useState<Version[]>(
    recipe.versionHistory
  );

  const restoreVersion = (versionToRestore: Version) => {
    const updatedVersionHistory = versionHistory.map((ver) =>
      ver.version === versionToRestore.version
        ? { ...ver, activeVersion: true }
        : { ...ver, activeVersion: false }
    );

    setTitle(versionToRestore.title);
    setTags(versionToRestore.tags);
    setIngredients(versionToRestore.ingredients);
    setProcesses(versionToRestore.processes);
    setVersion(versionToRestore.version);
    setVersionHistory(updatedVersionHistory);

    onRestore(recipe.id, versionToRestore);
    alert(`버전 ${versionToRestore.version}로 복원되었습니다.`);
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center">
      <div className="bg-white p-6 max-w-lg mx-auto w-full max-w-3xl max-h-[800px] overflow-auto relative">
        <h1 className="text-2xl font-bold mb-4">{title}</h1>
        <h2 className="text-xl mb-4">조리 과정</h2>
        <ul className="list-decimal list-inside mb-4">
          {processes.map((step, index) => (
            <li key={index} className="mb-2">
              Step {index + 1}: {step}
            </li>
          ))}
        </ul>
        <h3 className="text-lg mt-8 mb-2">#태그</h3>
        <div className="mb-4 flex flex-wrap gap-2">
          {tags.map((tag, index) => (
            <span key={index} className="bg-gray-200 px-3 py-1 rounded-full">
              #{tag}
            </span>
          ))}
        </div>
        <h3 className="text-lg mb-4">버전: {version}</h3>

        {/* 버전 관리 UI */}
        <div className="mb-4">
          <h3 className="text-lg mb-2">수정 기록</h3>
          {versionHistory.map((ver, index) => (
            <div key={index} className="mb-2">
              <span className="mr-2">
                버전 {ver.version} (수정일: {ver.timestamp}){" "}
                {ver.activeVersion && "(현재 버전)"}
              </span>
              <button
                onClick={() => restoreVersion(ver)}
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
            onClick={() => onEdit(recipe.id)}
          >
            수정
          </button>
          <button
            className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
            onClick={onClose}
          >
            목록으로
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecipeDetails;
