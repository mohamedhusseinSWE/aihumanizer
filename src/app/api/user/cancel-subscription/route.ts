import { NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import Stripe from "stripe";

const prisma = new PrismaClient();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-08-27.basil",
});

export async function POST() {
  try {
    // Get user session using better-auth
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Authentication required" },
        { status: 401 },
      );
    }

    // Get user data from database
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        email: true,
        subscriptionId: true,
        subscriptionStatus: true,
        planId: true,
        planName: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 },
      );
    }

    // Check if user has an active subscription
    if (!user.subscriptionId || user.subscriptionStatus !== "active") {
      return NextResponse.json(
        { success: false, error: "No active subscription found" },
        { status: 400 },
      );
    }

    // Cancel subscription in Stripe
    let stripeCancellationResult = null;
    try {
      const stripeSubscription = await stripe.subscriptions.cancel(
        user.subscriptionId,
      );
      stripeCancellationResult = {
        id: stripeSubscription.id,
        status: stripeSubscription.status,
        canceled_at: stripeSubscription.canceled_at,
      };
    } catch (stripeError) {
      console.error("Stripe cancellation error:", stripeError);
      // Continue with database update even if Stripe fails
    }

    // Update user subscription in database
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        subscriptionId: null,
        subscriptionStatus: "canceled",
        planId: null,
        planName: "free",
      },
    });

    // Update or create subscription record
    await prisma.subscription.upsert({
      where: { stripeSubId: user.subscriptionId },
      update: {
        status: "canceled",
        endDate: new Date(),
      },
      create: {
        stripeSubId: user.subscriptionId,
        userId: user.id,
        planId: user.planId || 1, // Default to plan 1 if no planId
        status: "canceled",
        interval: "monthly", // Default interval
        startDate: new Date(),
        endDate: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      message: "Subscription cancelled successfully",
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        subscriptionId: updatedUser.subscriptionId,
        subscriptionStatus: updatedUser.subscriptionStatus,
        planName: updatedUser.planName,
      },
      stripeResult: stripeCancellationResult,
    });
  } catch (error) {
    console.error("Failed to cancel subscription:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 },
    );
  }
}
