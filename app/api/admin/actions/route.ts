import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { isAdminEmail } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email || !isAdminEmail(session.user.email)) {
      return NextResponse.json(
        { error: "Access Denied: Restricted to authorized administrator." },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { action, userId, generationId } = body;

    switch (action) {
      case "togglePlan": {
        if (!userId) {
          return NextResponse.json({ error: "Missing userId" }, { status: 400 });
        }
        const target = await prisma.user.findUnique({ where: { id: userId } });
        if (!target) {
          return NextResponse.json({ error: "User not found" }, { status: 404 });
        }
        const nextPlan = target.plan === "PRO" ? "FREE" : "PRO";
        const updated = await prisma.user.update({
          where: { id: userId },
          data: {
            plan: nextPlan,
            usageLimit: nextPlan === "PRO" ? 999999 : 3,
          },
        });
        return NextResponse.json({
          success: true,
          message: `User ${updated.email} switched to ${nextPlan} plan.`,
          user: updated,
        });
      }

      case "resetCredits": {
        if (!userId) {
          return NextResponse.json({ error: "Missing userId" }, { status: 400 });
        }
        const updated = await prisma.user.update({
          where: { id: userId },
          data: { usageCount: 0 },
        });
        return NextResponse.json({
          success: true,
          message: `Usage count reset to 0 for ${updated.email}.`,
          user: updated,
        });
      }

      case "addBonusCredits": {
        if (!userId) {
          return NextResponse.json({ error: "Missing userId" }, { status: 400 });
        }
        const updated = await prisma.user.update({
          where: { id: userId },
          data: {
            usageLimit: {
              increment: 5,
            },
          },
        });
        return NextResponse.json({
          success: true,
          message: `Added +5 bonus credits for ${updated.email} (New limit: ${updated.usageLimit}).`,
          user: updated,
        });
      }

      case "deleteUser": {
        if (!userId) {
          return NextResponse.json({ error: "Missing userId" }, { status: 400 });
        }
        const target = await prisma.user.findUnique({ where: { id: userId } });
        if (!target) {
          return NextResponse.json({ error: "User not found" }, { status: 404 });
        }
        if (target.email.toLowerCase() === session.user.email.toLowerCase()) {
          return NextResponse.json(
            { error: "Cannot delete your own active operator account." },
            { status: 400 }
          );
        }
        await prisma.user.delete({ where: { id: userId } });
        return NextResponse.json({
          success: true,
          message: `User ${target.email} deleted permanently.`,
        });
      }

      case "deleteGeneration": {
        if (!generationId) {
          return NextResponse.json({ error: "Missing generationId" }, { status: 400 });
        }
        await prisma.generation.delete({ where: { id: generationId } });
        return NextResponse.json({
          success: true,
          message: "Generation record deleted successfully.",
        });
      }

      default:
        return NextResponse.json({ error: "Unknown admin action" }, { status: 400 });
    }
  } catch (error: any) {
    console.error("Admin action error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to execute admin action" },
      { status: 500 }
    );
  }
}
