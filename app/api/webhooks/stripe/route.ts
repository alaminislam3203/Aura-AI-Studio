import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import { getStripe } from "@/lib/stripe";

export const dynamic = "force-dynamic";

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || "";

export async function POST(request: NextRequest) {
  try {
    const stripe = getStripe();
    const body = await request.text();
    const signature = request.headers.get("stripe-signature");

    if (!webhookSecret) {
      console.warn("STRIPE_WEBHOOK_SECRET is not configured. Webhook skipped.");
      return NextResponse.json(
        { message: "Webhook secret not configured, skipping verification" },
        { status: 200 }
      );
    }

    if (!signature) {
      return NextResponse.json({ error: "Missing stripe-signature header" }, { status: 400 });
    }

    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err: any) {
      console.error("Webhook signature verification failed:", err?.message);
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.userId;
        const customerEmail =
          session.metadata?.email ||
          session.customer_email ||
          session.customer_details?.email;
        const customerId = session.customer as string;

        let user = null;
        if (userId) {
          user = await prisma.user.findUnique({ where: { id: userId } });
        }
        if (!user && customerEmail) {
          user = await prisma.user.findUnique({ where: { email: customerEmail } });
        }

        if (user) {
          await prisma.user.update({
            where: { id: user.id },
            data: {
              plan: "PRO",
              usageLimit: 999999,
              stripeCustomerId: customerId || user.stripeCustomerId || undefined,
            },
          });
        }
        break;
      }

      case "customer.subscription.created": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;
        const userId = subscription.metadata?.userId;

        let user = null;
        if (userId) {
          user = await prisma.user.findUnique({ where: { id: userId } });
        }
        if (!user && customerId) {
          user = await prisma.user.findFirst({ where: { stripeCustomerId: customerId } });
        }

        if (user) {
          await prisma.subscription.upsert({
            where: { stripeSubscriptionId: subscription.id },
            update: {
              status: subscription.status,
              stripeCustomerId: customerId,
            },
            create: {
              userId: user.id,
              stripeSubscriptionId: subscription.id,
              stripeCustomerId: customerId,
              status: subscription.status,
            },
          });
        }
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;
        const userId = subscription.metadata?.userId;

        let user = null;
        if (userId) {
          user = await prisma.user.findUnique({ where: { id: userId } });
        }
        if (!user && customerId) {
          user = await prisma.user.findFirst({ where: { stripeCustomerId: customerId } });
        }

        if (user) {
          if (subscription.status === "active") {
            await prisma.user.update({
              where: { id: user.id },
              data: { plan: "PRO", usageLimit: 999999 },
            });
          } else if (
            subscription.status === "canceled" ||
            subscription.status === "unpaid" ||
            subscription.status === "past_due"
          ) {
            await prisma.user.update({
              where: { id: user.id },
              data: { plan: "FREE", usageLimit: 3 },
            });
          }
        }
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;
        const userId = subscription.metadata?.userId;

        let user = null;
        if (userId) {
          user = await prisma.user.findUnique({ where: { id: userId } });
        }
        if (!user && customerId) {
          user = await prisma.user.findFirst({ where: { stripeCustomerId: customerId } });
        }

        if (user) {
          await prisma.user.update({
            where: { id: user.id },
            data: { plan: "FREE", usageLimit: 3 },
          });
          await prisma.subscription.deleteMany({
            where: { stripeSubscriptionId: subscription.id },
          });
        }
        break;
      }

      default:
        console.log(`Unhandled Stripe event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error("Webhook handling error:", error);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }
}
