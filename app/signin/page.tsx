"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function SignUpPage() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [name, setName] = useState<string>("");
  const router = useRouter();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    localStorage.setItem("email", email);
    localStorage.setItem("password", password);
    localStorage.setItem("name", name);

    alert("회원가입 성공! 로그인 페이지로 이동합니다.");
    router.push("/login");
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h1 className="text-4xl font-bold mb-6 grid place-items-center">
          Sign Up
        </h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2 font-bold">이름</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="이름을 입력하세요"
              className="w-full px-4 py-2 border rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2 font-bold">이메일</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your-email@example.com"
              className="w-full px-4 py-2 border rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2 font-bold">
              비밀번호
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호를 입력하세요"
              className="w-full px-4 py-2 border rounded-md font-bold"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-my-color text-white py-2 rounded-md font-bold hover:bg-my-color2"
          >
            회원가입
          </button>
        </form>
      </div>
    </div>
  );
}
