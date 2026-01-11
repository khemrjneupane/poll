import NextAuth, { DefaultSession, DefaultUser } from "next-auth";
import { JWT as DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      surname?: string | null;
      email?: string | null;
      avatar?: string | null; // normalized string URL
      image: string | null;
      role?: string;
      provider?: "credentials" | "google";
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    id: string;
    name?: string | null;
    surname?: string | null;
    email?: string | null;
    avatar?: string | null;

    role?: string;
    provider?: "credentials" | "google";
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id?: string;
    role?: string;
    surname?: string;
    picture?: string | null;
    image: string | null;
    provider?: "credentials" | "google";
  }
}
