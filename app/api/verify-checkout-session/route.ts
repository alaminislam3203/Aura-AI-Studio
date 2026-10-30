import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getStripe } from "@/lib/stripe";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const sessionId = searchParams.get("session_id");

    if (!sessionId) {
      return NextResponse.json({ error: "Missing session_id parameter" }, { status: 400 });
    }

    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json({ error: "Stripe Secret Key not configured" }, { status: 500 });
    }

    const stripe = getStripe();
    const checkoutSession = await stripe.checkout.sessions.retrieve(sessionId);

    if (!checkoutSession) {
      return NextResponse.json({ error: "Checkout session not found" }, { status: 404 });
    }

    const isPaid =
      checkoutSession.payment_status === "paid" || checkoutSession.status === "complete";

    if (!isPaid) {
      return NextResponse.json({ error: "Payment was not completed" }, { status: 400 });
    }

    const customerEmail =
      checkoutSession.metadata?.email ||
      session.user.email ||
      checkoutSession.customer_email ||
      checkoutSession.customer_details?.email;
    const userId = checkoutSession.metadata?.userId;
    const customerId = checkoutSession.customer as string;
    const subscriptionId = checkoutSession.subscription as string;

    let user = null;
    if (userId) {
      user = await prisma.user.findUnique({ where: { id: userId } });
    }
    if (!user && customerEmail) {
      user = await prisma.user.findUnique({ where: { email: customerEmail } });
    }

    if (!user) {
      return NextResponse.json({ error: "User not found for this checkout session" }, { status: 404 });
    }

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        plan: "PRO",
        usageLimit: 999999,
        stripeCustomerId: customerId || user.stripeCustomerId || undefined,
      },
    });

    if (subscriptionId && customerId) {
      await prisma.subscription.upsert({
        where: { stripeSubscriptionId: subscriptionId },
        update: {
          status: "active",
          stripeCustomerId: customerId,
        },
        create: {
          userId: updatedUser.id,
          stripeSubscriptionId: subscriptionId,
          stripeCustomerId: customerId,
          status: "active",
        },
      });
    }

    return NextResponse.json({
      success: true,
      plan: "PRO",
      usageLimit: 999999,
      user: updatedUser,
    });
  } catch (error: any) {
    console.error("Verify checkout session error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to verify session" },
      { status: 500 }
    );
  }
}
