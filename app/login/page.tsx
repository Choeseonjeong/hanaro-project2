"use client";

import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h1 className="text-4xl font-bold mb-6 grid place-items-center">
          Login
        </h1>
        <form>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">이메일</label>
            <input
              type="email"
              placeholder="your-email@example.com"
              className="w-full px-4 py-2 border rounded-md"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">비밀번호</label>
            <input
              type="password"
              placeholder="비밀번호를 입력하세요"
              className="w-full px-4 py-2 border rounded-md"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-my-color text-white py-2 rounded-md hover:bg-my-color2"
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
