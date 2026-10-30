import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { isAdminEmail } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email || !isAdminEmail(session.user.email)) {
      return NextResponse.json(
        { error: "Access Denied: Restricted to authorized administrator." },
        { status: 403 }
      );
    }

    const [
      totalUsers,
      proUsers,
      freeUsers,
      totalGenerations,
      totalSubscriptions,
      activeSubscriptions,
      recentUsers,
      recentGenerations,
      recentSubscriptions,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { plan: "PRO" } }),
      prisma.user.count({ where: { plan: "FREE" } }),
      prisma.generation.count(),
      prisma.subscription.count(),
      prisma.subscription.count({ where: { status: "active" } }),
      prisma.user.findMany({
        orderBy: { createdAt: "desc" },
        take: 100,
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          plan: true,
          usageCount: true,
          usageLimit: true,
          stripeCustomerId: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
      prisma.generation.findMany({
        orderBy: { createdAt: "desc" },
        take: 100,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
              plan: true,
            },
          },
        },
      }),
      prisma.subscription.findMany({
        orderBy: { createdAt: "desc" },
        take: 100,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
        },
      }),
    ]);

    return NextResponse.json({
      stats: {
        totalUsers,
        proUsers,
        freeUsers,
        totalGenerations,
        totalSubscriptions,
        activeSubscriptions,
        estimatedMrr: activeSubscriptions * 19,
      },
      users: recentUsers,
      generations: recentGenerations,
      subscriptions: recentSubscriptions,
    });
  } catch (error: any) {
    console.error("Admin overview fetch error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to load admin overview metrics" },
      { status: 500 }
    );
  }
}
