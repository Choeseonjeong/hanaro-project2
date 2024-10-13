"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginButton() {
  const { data: session } = useSession();
  const router = useRouter();

  const handleLoginPage = () => {
    router.push("/login");
  };

  if (session) {
    return (
      <>
        <p>Welcome, {session.user?.name}</p>
        <button onClick={() => signOut()}>Sign out</button>
      </>
    );
  }

  return (
    <>
      <button onClick={handleLoginPage}>로그인</button>
    </>
  );
}
