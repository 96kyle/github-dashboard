"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { LoginButton } from "./LoginButton";

export default function HomeView() {
  const [username, setUsername] = useState("");
  const router = useRouter();

  const { data: session } = useSession();
  useEffect(() => {
    if (session) router.push(`/${session!.username}/dashboard`);
  }, [router, session]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;
    router.push(`/${username}/dashboard`);
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen gap-4 p-4re">
      <h1 className="text-2xl font-bold">GitHub ID 검색</h1>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          placeholder="GitHub ID 입력"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="border border-gray-300 rounded px-4 py-2"
        />
        <button
          type="submit"
          className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
        >
          조회
        </button>
      </form>
      <LoginButton />
    </main>
  );
}
