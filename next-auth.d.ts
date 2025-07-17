import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    username?: string;
    accessToken?: string;
  }

  interface JWT {
    username?: string;
    accessToken?: string;
  }
}
