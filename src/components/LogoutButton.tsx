"use client";

import { signOut } from "next-auth/react";
import Image from "next/image";

export function LogoutButton() {
  return (
    <button
      onClick={() => signOut()}
      className="flex items-center gap-1 border px-4 py-2 rounded-md bg-black hover:bg-gray-800 text-white text-sm cursor-pointer"
    >
      <Image src="/icons/github.svg" alt="GitHub" width={24} height={24} />
      로그아웃
    </button>
  );
}
