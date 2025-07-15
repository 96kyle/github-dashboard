"use client";

import { useRouter } from "next/navigation";

export function LogoutButton() {
  const router = useRouter();

  const logout = async () => {
    await fetch("/api/github/logout");
    router.push("/"); // 홈 또는 로그인 페이지로 이동
  };

  return (
    <button
      onClick={logout}
      className="flex items-center gap-1 border px-4 py-2 rounded-md bg-black hover:bg-gray-800 text-white text-sm cursor-pointer"
    >
      <img src="/icons/github.svg" alt="GitHub" width={24} height={24} />
      로그아웃
    </button>
  );
}
