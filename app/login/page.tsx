"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const router = useRouter();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const storedEmail = localStorage.getItem("email");
    const storedPassword = localStorage.getItem("password");

    if (email === storedEmail && password === storedPassword) {
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("loggedInUser", email);

      alert("로그인 성공!");
      router.push("/");
    } else {
      alert("이메일 또는 비밀번호가 일치하지 않습니다.");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h1 className="text-4xl font-bold mb-6 grid place-items-center">
          Login
        </h1>
        <form onSubmit={handleSubmit}>
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
          {errorMessage && (
            <p className="text-red-500 font-bold mb-4">{errorMessage}</p>
          )}
          <button
            type="submit"
            className="w-full bg-my-color text-white py-2 rounded-md font-bold hover:bg-my-color2"
          >
            로그인
          </button>
        </form>
        <div className="mt-4">
          <button
            className="w-full bg-white border border-gray-300 text-gray-700 py-2 rounded-md flex justify-center items-center hover:bg-gray-100"
            onClick={() => signIn("google", { callbackUrl: "/" })}
          >
            <FcGoogle />
            &nbsp; Sign in with Google
          </button>
          <button
            className="w-full bg-white border border-gray-300 text-gray-700 py-2 rounded-md flex justify-center items-center mt-2 hover:bg-gray-100"
            onClick={() => signIn("github", { callbackUrl: "/" })}
          >
            <FaGithub />
            &nbsp; Sign in with GitHub
          </button>
        </div>
      </div>
    </div>
  );
}
