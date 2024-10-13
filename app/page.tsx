"use client";
import { useState } from "react";
import LoginButton from "./components/LoginButton";

export default function Home() {
  const [title, setTitle] = useState("");
  const [tag, setTag] = useState("");
  const [ingredient, setIngredient] = useState("");
  const [process, setProcess] = useState("");

  return (
    <div className="p-8 max-w-xl mx-auto">
      <header className="flex justify-between items-center bg-green-500 p-4 text-white">
        <h1 className="text-lg font-bold">나만의 레시피</h1>
        <div>
          <button className="mr-4 bg-blue-500 text-white px-4 py-2 rounded">
            레시피 추가
          </button>
          <LoginButton/>
        </div>
      </header>

      <section className="mt-6">
        <h2 className="text-xl mb-4">새 레시피 추가</h2>

        <div className="mb-4">
          <label className="block mb-2">레시피 제목</label>
          <input
            type="text"
            placeholder="레시피 제목을 입력하세요"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2">태그</label>
          <div className="flex">
            <input
              type="text"
              placeholder="태그를 입력하세요"
              value={tag}
              onChange={(e) => setTag(e.target.value)}
              className="flex-grow p-2 border rounded"
            />
            <button className="ml-2 bg-purple-300 px-4 py-2 rounded">추가</button>
          </div>
        </div>

        <div className="mb-4">
          <label className="block mb-2">재료 목록</label>
          <div className="flex">
            <input
              type="text"
              placeholder="재료를 입력하세요"
              value={ingredient}
              onChange={(e) => setIngredient(e.target.value)}
              className="flex-grow p-2 border rounded"
            />
            <button className="ml-2 bg-green-500 text-white px-4 py-2 rounded">추가</button>
          </div>
        </div>

        <div className="mb-4">
          <label className="block mb-2">조리 과정</label>
          <div className="flex">
            <input
              type="text"
              placeholder="조리 과정을 입력하세요"
              value={process}
              onChange={(e) => setProcess(e.target.value)}
              className="flex-grow p-2 border rounded"
            />
            <button className="ml-2 bg-green-500 text-white px-4 py-2 rounded">추가</button>
          </div>
        </div>

        <button className="w-full bg-blue-500 text-white px-4 py-2 rounded">
          레시피 저장
        </button>
      </section>
    </div>
  );
}
