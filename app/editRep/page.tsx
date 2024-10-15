"use client";
import React, { useState, useEffect } from "react";
import Header from "../components/layout/header";
import Footer from "../components/layout/footer";
import { useRouter, useSearchParams } from "next/navigation";

export default function EditRep() {
  const [title, setTitle] = useState<string>("");
  const [tag, setTag] = useState<string>("");
  const [tags, setTags] = useState<string[]>([]);
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [ingredient, setIngredient] = useState<string>("");
  const [process, setProcess] = useState<string>("");
  const [processes, setProcesses] = useState<string[]>([]);
  const [version, setVersion] = useState<number>(1); // 버전 정보 추가
  const [versionHistory, setVersionHistory] = useState<any[]>([]); // 버전 기록
  const [recipeId, setRecipeId] = useState<string>(""); // 고유한 레시피 ID

  const router = useRouter();
  const searchParams = useSearchParams(); // URL에서 레시피 ID를 가져옴

  useEffect(() => {
    let id = searchParams.get("id");

    // 새로운 레시피일 경우 고유한 ID를 현재 시간으로 생성
    if (!id) {
      id = Date.now().toString();
    }

    setRecipeId(id);

    const savedRecipe = localStorage.getItem(`selectedRecipe_${id}`);
    const savedVersionHistory = localStorage.getItem(`versionHistory_${id}`);

    if (savedRecipe) {
      const recipe = JSON.parse(savedRecipe);
      setTitle(recipe.title);
      setTags(recipe.tags || []);
      setIngredients(recipe.ingredients || []);
      setProcesses(recipe.processes || []);
      setVersion(recipe.version || 1);
    }

    if (savedVersionHistory) {
      setVersionHistory(JSON.parse(savedVersionHistory));
    }
  }, [searchParams]);

  // add functions
  const addTag = () => {
    if (tag.trim() !== "") {
      setTags([...tags, tag.trim()]);
      setTag("");
    }
  };

  const addIngredient = () => {
    if (ingredient.trim() !== "") {
      setIngredients([...ingredients, ingredient]);
      setIngredient("");
    }
  };

  const addProcess = () => {
    if (process.trim() !== "") {
      setProcesses([...processes, process]);
      setProcess("");
    }
  };

  const removeTag = (index: number) => {
    const newTags = tags.filter((_, i) => i !== index);
    setTags(newTags);
  };

  const removeIngredient = (index: number) => {
    const newIngredients = ingredients.filter((_, i) => i !== index);
    setIngredients(newIngredients);
  };

  const removeProcess = (index: number) => {
    const newProcesses = processes.filter((_, i) => i !== index);
    setProcesses(newProcesses);
  };

  // 저장 버튼 클릭 시 모든 데이터를 로컬 스토리지에 저장하고 버전 업데이트
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim() === "" || tags.length === 0) {
      alert("제목과 태그를 입력해주세요.");
      return;
    }

    const newVersion = version + 1; // 새로운 버전
    const timestamp = new Date().toLocaleString(); // 수정 시간 기록

    // 현재 버전의 레시피를 버전 기록에 저장
    const currentVersion = {
      title,
      tags,
      ingredients,
      processes,
      version,
      timestamp, // 저장 시간 기록
      activeVersion: false, // 현재는 활성화되지 않은 버전
    };

    const updatedVersionHistory = [...versionHistory, currentVersion];
    setVersionHistory(updatedVersionHistory);

    // 새로운 레시피는 activeVersion: true로 설정
    const newRecipe = {
      id: recipeId, // 고유 레시피 ID
      title,
      tags,
      ingredients,
      processes,
      version: newVersion,
      activeVersion: true, // 새로 저장된 레시피는 활성화 상태로 설정
    };

    // 로컬 스토리지에 해당 레시피의 버전 및 내용을 저장
    localStorage.setItem(
      `selectedRecipe_${recipeId}`,
      JSON.stringify(newRecipe)
    ); // 수정된 레시피 저장
    localStorage.setItem(
      `versionHistory_${recipeId}`,
      JSON.stringify(updatedVersionHistory)
    ); // 버전 기록 저장

    // 레시피 목록에 추가하거나 업데이트
    const storedRecipes = localStorage.getItem("recipes") || "[]";
    const recipes = JSON.parse(storedRecipes);

    // 기존에 활성화된 레시피를 비활성화 (activeVersion: false로 변경)
    const updatedRecipes = recipes.map((r: any) =>
      r.id === recipeId ? { ...r, activeVersion: false } : r
    );

    // 새로운 레시피 추가
    updatedRecipes.push(newRecipe);
    localStorage.setItem("recipes", JSON.stringify(updatedRecipes));

    alert(`레시피가 저장되었습니다. 버전: ${newVersion}`);
    router.push(`/detailRep?id=${recipeId}`); // 저장 후 detailRep으로 이동
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
      <section className="p-8 max-w-xl mx-auto min-h-screen flex flex-col bg-white">
        <div className="flex-grow mt-8">
          <h2 className="text-xl mb-4 font-bold">Edit Recipe</h2>

          {/* Title */}
          <div className="mb-4">
            <label className="block mb-2">Title</label>
            <input
              type="text"
              placeholder="레시피 제목을 입력하세요"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 border rounded-lg"
            />
          </div>

          {/* Tag */}
          <div className="mb-4">
            <label className="block mb-2">Tag</label>
            <div className="flex">
              <input
                type="text"
                placeholder="태그를 입력하세요"
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                className="flex-grow p-2 border rounded-lg"
              />
              <button
                onClick={addTag}
                className="ml-2  px-4 py-2 rounded-lg bg-my-color2 text-white hover:text-black"
              >
                추가
              </button>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {tags.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center bg-gray-100 px-3 py-1 rounded-full shadow-md"
                >
                  <span className="mr-2">{item}</span>
                  <button
                    onClick={() => removeTag(index)}
                    className="text-my-color2 text-lg font-bold"
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Ingredient */}
          <div className="mb-4">
            <label className="block mb-2">Ingredient List</label>
            <div className="flex">
              <input
                type="text"
                placeholder="재료를 입력하세요"
                value={ingredient}
                onChange={(e) => setIngredient(e.target.value)}
                className="flex-grow p-2 border rounded-lg"
              />
              <button
                onClick={addIngredient}
                className="ml-2 px-4 py-2 rounded-lg bg-my-color2 text-white hover:text-black"
              >
                추가
              </button>
            </div>
            <ul className="mt-4">
              {ingredients.map((item, index) => (
                <li key={index} className="flex items-center mb-2">
                  {item}
                  <button
                    onClick={() => removeIngredient(index)}
                    className="text-red-500 ml-2"
                  >
                    삭제
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Step */}
          <div className="mb-4">
            <label className="block mb-2">조리 과정</label>
            <div className="flex">
              <input
                type="text"
                placeholder="조리 과정을 입력하세요"
                value={process}
                onChange={(e) => setProcess(e.target.value)}
                className="flex-grow p-2 border rounded-lg"
              />
              <button
                onClick={addProcess}
                className="ml-2 bg-my-color2 text-white hover:text-black px-4 py-2 rounded-lg"
              >
                추가
              </button>
            </div>
            <ul className="mt-4">
              {processes.map((item, index) => (
                <li key={index} className="flex items-center mb-2">
                  {index + 1}. {item}
                  <button
                    onClick={() => removeProcess(index)}
                    className="text-red-500 ml-2"
                  >
                    삭제
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Store */}
          <button
            type="submit"
            onClick={handleSubmit}
            className="w-full bg-my-color2 font-bold text-white hover:text-black px-4 py-2 rounded-lg"
          >
            레시피 저장
          </button>
        </div>
        <Footer />
      </section>
    </div>
  );
}
