import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const PRO_HOURLY_LIMIT = 8;
const WINDOW_DURATION_MS = 60 * 60 * 1000; // 1 hour rolling window

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
        plan: true,
        usageCount: true,
        usageLimit: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const isPro = user.plan === "PRO";
    const oneHourAgo = new Date(Date.now() - WINDOW_DURATION_MS);

    // Count generations in the last 60 minutes
    const hourlyCount = await prisma.generation.count({
      where: {
        userId: user.id,
        createdAt: { gte: oneHourAgo },
      },
    });

    let resetInMinutes = 0;
    if (hourlyCount > 0) {
      const oldestInWindow = await prisma.generation.findFirst({
        where: {
          userId: user.id,
          createdAt: { gte: oneHourAgo },
        },
        orderBy: { createdAt: "asc" },
        select: { createdAt: true },
      });

      if (oldestInWindow) {
        const nextUnlockTime = oldestInWindow.createdAt.getTime() + WINDOW_DURATION_MS;
        resetInMinutes = Math.max(1, Math.ceil((nextUnlockTime - Date.now()) / (60 * 1000)));
      }
    }

    const isHourlyCapped = isPro && hourlyCount >= PRO_HOURLY_LIMIT;
    const isLifetimeCapped = !isPro && user.usageCount >= user.usageLimit;
    const canUpload = !isHourlyCapped && !isLifetimeCapped;

    return NextResponse.json(
      {
        usageCount: user.usageCount,
        usageLimit: isPro ? 999999 : user.usageLimit,
        plan: user.plan,
        canUpload,
        remaining: isPro ? 999999 : Math.max(0, user.usageLimit - user.usageCount),
        hourlyCount,
        hourlyLimit: isPro ? PRO_HOURLY_LIMIT : user.usageLimit,
        hourlyRemaining: isPro ? Math.max(0, PRO_HOURLY_LIMIT - hourlyCount) : Math.max(0, user.usageLimit - user.usageCount),
        isHourlyCapped,
        resetInMinutes,
      },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
        },
      }
    );
  } catch (error) {
    console.error("Usage check error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
        plan: true,
        usageCount: true,
        usageLimit: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const isPro = user.plan === "PRO";
    const oneHourAgo = new Date(Date.now() - WINDOW_DURATION_MS);

    // Count user's generations in the last 60 minutes
    const hourlyCount = await prisma.generation.count({
      where: {
        userId: user.id,
        createdAt: { gte: oneHourAgo },
      },
    });

    // Calculate reset time if rate limited
    let resetInMinutes = 0;
    if (hourlyCount > 0) {
      const oldestInWindow = await prisma.generation.findFirst({
        where: {
          userId: user.id,
          createdAt: { gte: oneHourAgo },
        },
        orderBy: { createdAt: "asc" },
        select: { createdAt: true },
      });

      if (oldestInWindow) {
        const nextUnlockTime = oldestInWindow.createdAt.getTime() + WINDOW_DURATION_MS;
        resetInMinutes = Math.max(1, Math.ceil((nextUnlockTime - Date.now()) / (60 * 1000)));
      }
    }

    // 1. Check PRO hourly rate limit (15 generations / hour)
    if (isPro && hourlyCount >= PRO_HOURLY_LIMIT) {
      return NextResponse.json(
        {
          error: `Hourly rate limit reached (15 generations/hour). Next edit unlocks in ${resetInMinutes} minute${resetInMinutes === 1 ? "" : "s"}.`,
          rateLimited: true,
          hourlyCount,
          hourlyLimit: PRO_HOURLY_LIMIT,
          resetInMinutes,
          canUpload: false,
        },
        { status: 429 }
      );
    }

    // 2. Check FREE tier lifetime limit (3 credits)
    if (!isPro && user.usageCount >= user.usageLimit) {
      return NextResponse.json(
        {
          error: "Usage limit reached. Upgrade to Pro for unlimited edits.",
          usageCount: user.usageCount,
          usageLimit: user.usageLimit,
          plan: user.plan,
          canUpload: false,
        },
        { status: 403 }
      );
    }

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        usageCount: {
          increment: 1,
        },
      },
      select: {
        id: true,
        usageCount: true,
        usageLimit: true,
        plan: true,
      },
    });

    const newHourlyCount = hourlyCount + 1;

    return NextResponse.json({
      usageCount: updatedUser.usageCount,
      usageLimit: isPro ? 999999 : updatedUser.usageLimit,
      plan: updatedUser.plan,
      canUpload: isPro ? newHourlyCount < PRO_HOURLY_LIMIT : updatedUser.usageCount < updatedUser.usageLimit,
      remaining: isPro ? 999999 : Math.max(0, updatedUser.usageLimit - updatedUser.usageCount),
      hourlyCount: newHourlyCount,
      hourlyLimit: isPro ? PRO_HOURLY_LIMIT : updatedUser.usageLimit,
      hourlyRemaining: isPro ? Math.max(0, PRO_HOURLY_LIMIT - newHourlyCount) : Math.max(0, updatedUser.usageLimit - updatedUser.usageCount),
      resetInMinutes,
    });
  } catch (error) {
    console.error("Usage increment error:", error);
    return NextResponse.json({ error: "Failed to update usage" }, { status: 500 });
  }
}
