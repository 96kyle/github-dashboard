import { getServerSession } from "next-auth";
import { authOptions } from "./auth";

export async function getGitHubContext() {
  const session = await getServerSession(authOptions);

  const username = session?.username || process.env.GITHUB_USERNAME!;
  const token = session?.accessToken || process.env.GITHUB_TOKEN!;

  return { username, token };
}
