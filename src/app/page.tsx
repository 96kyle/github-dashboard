"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useUserStore } from "../stores/userStore";

export default function Home() {
  const [input, setInput] = useState("");
  const router = useRouter();
  const setUsername = useUserStore((state) => state.setUsername);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input) {
      setUsername(input);
      router.push("/dashboard");
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <h1 className="text-2xl font-bold">GitHub ID 입력</h1>
      <form className="mt-4" onSubmit={handleSubmit}>
        <input
          className="border p-2 rounded mr-2"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="github username"
        />
        <button className="bg-blue-600 text-white px-4 py-2 rounded">
          확인
        </button>
      </form>
    </main>
  );
}
