import Stripe from "stripe";

let stripeClient: Stripe | null = null;

export function getStripe(): Stripe {
  if (!stripeClient) {
    const key = process.env.STRIPE_SECRET_KEY || "sk_test_build_placeholder_key_only";
    stripeClient = new Stripe(key, {
      apiVersion: "2025-02-24.acacia" as any,
    });
  }
  return stripeClient;
}
