import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";

import dbConnect from "@/backend/config/dbConnect";
import User from "@/backend/models/user";
interface GoogleProfile {
  sub: string;
  name: string;
  email: string;
  picture: string;
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        await dbConnect();
        const user = await User.findOne({ email: credentials?.email }).select(
          "+password"
        );
        if (!user) throw new Error("User not found");

        const isValid = await bcrypt.compare(
          credentials.password,
          user.password
        );
        if (!isValid) throw new Error("Invalid credentials");

        return {
          id: user._id.toString(),
          name: user.name,
          surname: user.surname ?? undefined,
          email: user.email,
          avatar: user.avatar?.url ?? null,
          role: user.role,
          provider: "credentials", // ✅ mark provider
        };
      },
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  callbacks: {
    async jwt({ token, user, account, profile }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.surname = user.surname ?? undefined;
        token.picture = user.avatar ?? null;
        if (
          account?.provider === "google" ||
          account?.provider === "credentials"
        ) {
          token.provider = account.provider; // 🔒 now narrowed to union type
        }
      }

      if (account?.provider === "google" && profile) {
        await dbConnect();
        const googleProfile = profile as GoogleProfile;

        let dbUser = await User.findOne({ email: googleProfile.email });

        if (!dbUser) {
          const nameParts = (googleProfile.name || "").split(" ");
          const firstName = nameParts[0] || "";
          const surname = nameParts.slice(1).join(" ") || "";

          dbUser = await User.create({
            name: firstName,
            surname,
            email: googleProfile.email,
            password: await bcrypt.hash(
              Math.random().toString(36).slice(-8),
              10
            ),
            role: "user",
            avatar: {
              url: googleProfile.picture,
              public_id: `google_${googleProfile.sub}`,
            },
          });
        }

        token.id = dbUser._id.toString();
        token.role = dbUser.role;
        token.surname = dbUser.surname ?? undefined;
        token.picture = dbUser.avatar?.url ?? null;
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.surname = token.surname as string | undefined;
        session.user.avatar = token.picture as string | null;
        if (token.provider === "google" || token.provider === "credentials") {
          session.user.provider = token.provider; // ✅ safe assignment
        }
      }

      return session;
    },
  },

  session: {
    strategy: "jwt",
  },

  pages: {
    signIn: "/login",
  },
};
