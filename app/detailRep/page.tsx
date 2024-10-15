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
  const [version, setVersion] = useState<number>(1); // 버전 정보 추가
  const [versionHistory, setVersionHistory] = useState<any[]>([]); // 버전 기록
  const [recipeIndex, setRecipeIndex] = useState<number | null>(null); // 레시피 인덱스
  const router = useRouter();
  const searchParams = useSearchParams(); // URL에서 인덱스를 가져옴

  useEffect(() => {
    const index = searchParams.get("id"); // URL의 레시피 인덱스 값
    if (index !== null) {
      const storedRecipes = localStorage.getItem("recipes"); // 레시피 배열 가져오기
      if (storedRecipes) {
        const recipes = JSON.parse(storedRecipes);
        const selectedRecipe = recipes[parseInt(index, 10)]; // 배열의 인덱스로 레시피 가져오기
        if (selectedRecipe) {
          setTitle(selectedRecipe.title);
          setTags(selectedRecipe.tags || []);
          setIngredients(selectedRecipe.ingredients || []);
          setProcesses(selectedRecipe.processes || []);
          setVersion(selectedRecipe.version || 1);
          setVersionHistory(selectedRecipe.versionHistory || []);
          setRecipeIndex(parseInt(index, 10)); // 현재 레시피 인덱스 저장
        }
      }
    }
  }, [searchParams]);

  // 복원 기능: 선택한 버전을 activeVersion: true로 설정하고 나머지는 false
  const restoreVersion = (versionToRestore: any) => {
    const updatedVersionHistory = versionHistory.map(
      (ver) =>
        ver.version === versionToRestore.version
          ? { ...ver, activeVersion: true } // 선택한 버전을 활성화
          : { ...ver, activeVersion: false } // 나머지는 비활성화
    );

    // 상태 업데이트
    setTitle(versionToRestore.title);
    setTags(versionToRestore.tags);
    setIngredients(versionToRestore.ingredients);
    setProcesses(versionToRestore.processes);
    setVersion(versionToRestore.version);
    setVersionHistory(updatedVersionHistory);

    // 레시피 목록 업데이트
    const storedRecipes = localStorage.getItem("recipes");
    if (storedRecipes && recipeIndex !== null) {
      const recipes = JSON.parse(storedRecipes);
      recipes[recipeIndex] = {
        ...recipes[recipeIndex],
        ...versionToRestore,
      }; // 복원된 버전으로 업데이트
      localStorage.setItem("recipes", JSON.stringify(recipes)); // 업데이트된 레시피 저장
    }

    alert(`버전 ${versionToRestore.version}로 복원되었습니다.`);
  };

  // 수정 페이지로 이동하는 함수
  const handleEdit = () => {
    if (recipeIndex !== null) {
      router.push(`/editRep?id=${recipeIndex}`); // 레시피 인덱스로 수정 페이지로 이동
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
