// pages/index.tsx
"use client";
import { useState } from "react";

const Home = () => {
  const [todos, setTodos] = useState<string[]>([]); // 투두 아이템 목록 상태
  const [input, setInput] = useState<string>(""); // 입력 필드 상태

  // 투두 아이템 추가 함수
  const addTodo = () => {
    if (input.trim() === "") return; // 입력 값이 없으면 리턴
    setTodos([...todos, input.trim()]); // 새로운 투두 아이템 추가
    setInput(""); // 입력 필드 초기화
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold text-center mb-4">
        실시간 협업 투두 리스트
      </h1>
      <div className="flex justify-center mb-4">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="할 일을 입력하세요"
          className="border rounded-l px-4 py-2 w-1/2"
        />
        <button
          onClick={addTodo}
          className="bg-blue-500 text-white rounded-r px-4 py-2"
        >
          추가
        </button>
      </div>
      <ul className="list-disc mx-auto w-1/2">
        {todos.map((todo, index) => (
          <li key={index} className="border-b py-2">
            {todo}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Home;
