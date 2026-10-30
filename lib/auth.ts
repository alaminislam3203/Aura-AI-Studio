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
  callbacks: {
    async signIn({ user }) {
      if (!user.email) return false;

      try {
        await prisma.user.upsert({
          where: { email: user.email },
          update: {
            name: user.name ?? undefined,
            image: user.image ?? undefined,
          },
          create: {
            email: user.email,
            name: user.name,
            image: user.image,
            plan: "FREE",
            usageCount: 0,
            usageLimit: 3,
          },
        });
        return true;
      } catch (error) {
        console.error("Error saving user on signIn:", error);
        return true;
      }
    },
    async jwt({ token, user }) {
      if (user?.email) {
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.email) {
        try {
          const dbUser = await prisma.user.findUnique({
            where: { email: token.email as string },
            select: {
              id: true,
              plan: true,
              usageCount: true,
              usageLimit: true,
              stripeCustomerId: true,
            },
          });

          if (dbUser) {
            (session.user as any).id = dbUser.id;
            (session.user as any).plan = dbUser.plan;
            (session.user as any).usageCount = dbUser.usageCount;
            (session.user as any).usageLimit = dbUser.usageLimit;
          }
        } catch (error) {
          console.error("Error fetching user for session:", error);
        }
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
