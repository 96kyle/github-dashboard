"use client";

import { signIn } from "next-auth/react";
import Image from "next/image";

export function LoginButton() {
  return (
    <button
      onClick={() => signIn("github")}
      className="flex items-center gap-1 border px-4 py-2 rounded-md bg-black hover:bg-gray-800 text-white text-sm cursor-pointer"
    >
      <Image src="/icons/github.svg" alt="GitHub" width={24} height={24} />
      GitHub 로그인
    </button>
  );
}
