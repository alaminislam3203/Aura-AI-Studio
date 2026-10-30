import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json({ generations: [] });
    }

    const generations = await prisma.generation.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    return NextResponse.json({ generations });
  } catch (error) {
    console.error("Fetch generations error:", error);
    return NextResponse.json({ error: "Failed to fetch generations" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, plan: true, usageCount: true, usageLimit: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const isPro = user.plan === "PRO";
    const PRO_HOURLY_LIMIT = 8;
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const hourlyCount = await prisma.generation.count({
      where: {
        userId: user.id,
        createdAt: { gte: oneHourAgo },
      },
    });

    if (isPro && hourlyCount >= PRO_HOURLY_LIMIT) {
      return NextResponse.json(
        { error: `Hourly rate limit reached (${PRO_HOURLY_LIMIT} generations/hour). Please wait for the window to reset.` },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { originalImageUrl, originalFileName, resultImageUrl, toolType, prompt } = body;

    if (!originalImageUrl || !resultImageUrl || !toolType) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const generation = await prisma.generation.create({
      data: {
        userId: user.id,
        originalImageUrl,
        originalFileName: originalFileName || null,
        resultImageUrl,
        toolType,
        prompt: prompt || null,
      },
    });

    return NextResponse.json({ generation });
  } catch (error) {
    console.error("Save generation error:", error);
    return NextResponse.json({ error: "Failed to save generation" }, { status: 500 });
  }
}
