"use client";
import React, { useState, useEffect } from "react";
import Header from "../components/layout/header";
import Footer from "../components/layout/footer";
import { useRouter } from "next/navigation";

export default function AddRep() {
  const [title, setTitle] = useState<string>("");
  const [tag, setTag] = useState<string>("");
  const [tags, setTags] = useState<string[]>([]);
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [ingredient, setIngredient] = useState<string>("");
  const [process, setProcess] = useState<string>("");
  const [processes, setProcesses] = useState<string[]>([]);

  const router = useRouter();

  // 태그, 재료, 과정 추가 함수
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

  // 저장 버튼 클릭 시 로컬 스토리지에 저장
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim() === "" || tags.length === 0) {
      alert("제목과 태그를 입력해주세요.");
      return;
    }

    const loggedInUser = localStorage.getItem("loggedInUser");
    if (!loggedInUser) {
      alert("로그인 정보가 없습니다.");
      return;
    }

    // 새로운 레시피 추가
    const newRecipe = {
      id: Date.now().toString(), // 고유 ID 추가
      title,
      tags,
      ingredients,
      processes,
    };

    // 기존 레시피 목록 불러오기
    const storedRecipes =
      localStorage.getItem(`recipes_${loggedInUser}`) || "[]";
    const recipes = JSON.parse(storedRecipes);
    recipes.push(newRecipe); // 새 레시피 추가

    // 새로운 레시피 목록을 로컬 스토리지에 저장
    localStorage.setItem(`recipes_${loggedInUser}`, JSON.stringify(recipes));

    alert("레시피가 저장되었습니다.");
    router.push("/"); // 저장 후 메인 페이지로 이동
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
        <Header />
        <div className="flex-grow mt-8">
          <h2 className="text-xl mb-4 font-bold">Add Recipe</h2>

          {/* Title */}
          <div className="mb-4">
            <label className="block mb-">Title</label>
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
                className="ml-2 px-4 py-2 rounded-lg bg-my-color2 text-white hover:text-black"
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

          {/* Process */}
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

          {/* Save */}
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
