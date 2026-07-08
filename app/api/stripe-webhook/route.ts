import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error: any) {
    console.error("Webhook signature verification failed:", error.message);
    return NextResponse.json(
      { error: "Webhook signature verification failed." },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;

        const userId = session.metadata?.clerkUserId;
        const planType = session.metadata?.planType;

        if (!userId || !planType) {
          console.error("Missing metadata on checkout session:", session.id);
          break;
        }

        const subscriptionId = session.subscription as string;

        await prisma.profile.update({
          where: { userId },
          data: {
            stripeSubscriptionId: subscriptionId,
            subscriptionActive: true,
            subscriptionTier: planType,
          },
        });

        console.log(`Subscription activated for user: ${userId}`);
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;

        const profile = await prisma.profile.findUnique({
          where: { stripeSubscriptionId: subscription.id },
        });

        if (!profile) {
          console.error(
            "Profile not found for updated subscription:",
            subscription.id
          );
          break;
        }

        await prisma.profile.update({
          where: { userId: profile.userId },
          data: {
            subscriptionActive: subscription.status === "active",
          },
        });

        console.log(`Subscription updated for user: ${profile.userId}`);
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;

        const profile = await prisma.profile.findUnique({
          where: { stripeSubscriptionId: subscription.id },
        });

        if (!profile) {
          console.error(
            "Profile not found for deleted subscription:",
            subscription.id
          );
          break;
        }

        await prisma.profile.update({
          where: { userId: profile.userId },
          data: {
            subscriptionActive: false,
            subscriptionTier: null,
            stripeSubscriptionId: null,
          },
        });

        console.log(`Subscription canceled for user: ${profile.userId}`);
        break;
      }

      default:
        console.log(`Unhandled Stripe event type: ${event.type}`);
    }
  } catch (error: any) {
    console.error("Error handling Stripe webhook event:", error.message);
    return NextResponse.json(
      { error: "Webhook handler failed." },
      { status: 500 }
    );
  }

  return NextResponse.json({ received: true });
}