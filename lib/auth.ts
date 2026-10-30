import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "@/lib/prisma";

// Auto-resolve production NEXTAUTH_URL on Vercel / Cloud platforms if left as localhost
if (
  process.env.NODE_ENV === "production" &&
  (!process.env.NEXTAUTH_URL || process.env.NEXTAUTH_URL.includes("localhost"))
) {
  const prodUrl =
    process.env.NEXT_PUBLIC_APP_URL && !process.env.NEXT_PUBLIC_APP_URL.includes("localhost")
      ? process.env.NEXT_PUBLIC_APP_URL
      : process.env.VERCEL_PROJECT_PRODUCTION_URL
        ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
        : process.env.VERCEL_URL
          ? `https://${process.env.VERCEL_URL}`
          : undefined;

  if (prodUrl) {
    process.env.NEXTAUTH_URL = prodUrl;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: [
    // NextAuth callbacks configured below
  ] as any,
  secret: process.env.NEXTAUTH_SECRET,
};
