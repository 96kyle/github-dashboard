"use client";

export function LoginButton({ clientId }: { clientId: string }) {
  const loginWithGitHub = () => {
    const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&scope=read:user repo user:email`;
    window.location.href = githubAuthUrl;
  };

  return (
    <button
      onClick={loginWithGitHub}
      className="flex items-center gap-1 border px-4 py-2 rounded-md bg-black hover:bg-gray-800 text-white text-sm cursor-pointer"
    >
      <img src="/icons/github.svg" alt="GitHub" width={24} height={24} />
      GitHub 로그인
    </button>
  );
}
