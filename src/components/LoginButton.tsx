"use client";

export function LoginButton({ clientId }: { clientId: string }) {
  const loginWithGitHub = () => {
    const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&scope=read:user repo user:email`;
    window.location.href = githubAuthUrl;
  };

  return (
    <button className="cursor-pointer" onClick={loginWithGitHub}>
      GitHub 로그인
    </button>
  );
}
