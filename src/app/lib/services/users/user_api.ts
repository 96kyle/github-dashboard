import { cookies } from "next/headers";

export async function getLoginInfo(): Promise<{
  username: string;
  token: string;
} | null> {
  const cookie = await cookies();
  const token = cookie.get("github_token")?.value;

  if (!token) return null;

  const res = await fetch("https://api.github.com/user", {
    headers: {
      Authorization: `token ${token}`,
      Accept: "application/vnd.github+json",
    },
    cache: "no-store",
  });

  if (!res.ok) return null;

  const data = await res.json();
  return { username: data.login, token: token };
}
