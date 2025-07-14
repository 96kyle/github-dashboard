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
      className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
    >
      로그아웃
    </button>
  );
}
