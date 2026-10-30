import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import { getStripe } from "@/lib/stripe";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json(
        { error: "Stripe Secret Key is not configured." },
        { status: 500 }
      );
    }

    if (!process.env.STRIPE_PRICE_ID) {
      return NextResponse.json(
        { error: "Stripe Price ID is not configured yet." },
        { status: 500 }
      );
    }

    const origin =
      request.headers.get("origin") ||
      request.headers.get("referer")?.replace(/\/$/, "") ||
      process.env.NEXTAUTH_URL ||
      "http://localhost:3000";

    const sessionConfig: Stripe.Checkout.SessionCreateParams = {
      line_items: [
        {
          price: process.env.STRIPE_PRICE_ID,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${origin}/playground?upgraded=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/playground?payment_canceled=true`,
      metadata: {
        userId: user.id,
        email: user.email,
      },
      subscription_data: {
        metadata: {
          userId: user.id,
          email: user.email,
        },
      },
    };

    if (user.stripeCustomerId) {
      sessionConfig.customer = user.stripeCustomerId;
    } else {
      sessionConfig.customer_email = user.email;
    }

    const stripe = getStripe();
    const checkoutSession = await stripe.checkout.sessions.create(sessionConfig);

    return NextResponse.json({
      sessionId: checkoutSession.id,
      url: checkoutSession.url,
    });
  } catch (error: any) {
    console.error("Stripe checkout error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
