"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Header from "../components/layout/header";
import Footer from "../components/layout/footer";

export default function RecipeDetails() {
  const [title, setTitle] = useState<string>("");
  const [tags, setTags] = useState<string[]>([]);
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [processes, setProcesses] = useState<string[]>([]);
  const [version, setVersion] = useState<number>(1);
  const [versionHistory, setVersionHistory] = useState<any[]>([]);
  const [recipeIndex, setRecipeIndex] = useState<number | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const index = searchParams.get("id");
    if (index !== null) {
      const storedRecipes = localStorage.getItem("recipes");
      if (storedRecipes) {
        const recipes = JSON.parse(storedRecipes);
        const selectedRecipe = recipes[parseInt(index, 10)];
        if (selectedRecipe) {
          setTitle(selectedRecipe.title);
          setTags(selectedRecipe.tags || []);
          setIngredients(selectedRecipe.ingredients || []);
          setProcesses(selectedRecipe.processes || []);
          setVersion(selectedRecipe.version || 1);
          setVersionHistory(selectedRecipe.versionHistory || []);
          setRecipeIndex(parseInt(index, 10));
        }
      }
    }
  }, [searchParams]);

  const restoreVersion = (versionToRestore: any) => {
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

    const storedRecipes = localStorage.getItem("recipes");
    if (storedRecipes && recipeIndex !== null) {
      const recipes = JSON.parse(storedRecipes);
      recipes[recipeIndex] = {
        ...recipes[recipeIndex],
        ...versionToRestore,
        id: recipes[recipeIndex].id,
        versionHistory: updatedVersionHistory,
      };
      localStorage.setItem("recipes", JSON.stringify(recipes));
    }

    alert(`버전 ${versionToRestore.version}로 복원되었습니다.`);
  };

  const handleEdit = () => {
    if (recipeIndex !== null) {
      router.push(`/editRep?id=${recipeIndex}`);
    }
  };

  return (
    <div className="p-8 max-w-xl mx-auto min-h-screen bg-white">
      <Header />
      <h1 className="text-2xl font-bold mb-4">{title}</h1>
      <h2 className="text-xl mb-4">조리 과정</h2>
      {processes.map((step, index) => (
        <div key={index} className="mb-4">
          <p>
            Step {index + 1}: {step}
          </p>
        </div>
      ))}
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
          onClick={handleEdit}
        >
          수정
        </button>
        <button
          className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
          onClick={() => router.push("/")}
        >
          목록으로
        </button>
      </div>
      <Footer />
    </div>
  );
}
