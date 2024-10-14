"use client";
import React, { useState } from "react";
import Header from '../components/layout/header';
import { useRouter } from "next/navigation"; // useRouter 추가

export default function RepForm() {
  const [title, setTitle] = useState<string>(""); 
  const [tag, setTag] = useState<string>(""); 
  const [tags, setTags] = useState<string[]>([]); 
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [ingredient, setIngredient] = useState<string>(""); 
  const [process, setProcess] = useState<string>(""); 
  const [processes, setProcesses] = useState<string[]>([]); 

  const router = useRouter(); 

// add 
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
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (title.trim() === "" || tags.length === 0) {
      alert("제목과 태그를 입력해주세요.");
      return;
    }
    const newRecipe = { title, tags, ingredients, processes };
    localStorage.setItem('newRecipe', JSON.stringify(newRecipe));
    router.push('/');
  };

  return (
    <>
      <section className="p-8 max-w-xl mx-auto">
        <Header />
        <h2 className="text-xl mb-4">레시피 수정</h2>
        
        {/* Title */}
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

        {/* Tag */}
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
            <button
              onClick={addTag}
              className="ml-2 bg-purple-300 px-4 py-2 rounded"
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
                  className="text-green-500 text-lg font-bold"
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Ingredient */}
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
            <button
              onClick={addIngredient}
              className="ml-2 bg-green-500 text-white px-4 py-2 rounded"
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
              className="flex-grow p-2 border rounded"
            />
            <button
              onClick={addProcess}
              className="ml-2 bg-green-500 text-white px-4 py-2 rounded"
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
          className="w-full bg-blue-500 text-white px-4 py-2 rounded"
        >
          레시피 저장
        </button>
      </section>
    </>
  );
}
