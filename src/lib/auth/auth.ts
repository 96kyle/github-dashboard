// lib/auth.ts
import GitHubProvider, { GithubProfile } from "next-auth/providers/github";
import type { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: "read:user repo user:email",
        },
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account, profile }) {
      // 로그인 시점에만 account에 access_token이 있음
      if (account) {
        token.accessToken = account.access_token;
        token.username = (profile as GithubProfile)?.login;
      }
      return token;
    },
    async session({ session, token }) {
      // 클라이언트 세션에서 accessToken 사용 가능
      session.accessToken = token.accessToken as string;
      session.username = token.username as string;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
