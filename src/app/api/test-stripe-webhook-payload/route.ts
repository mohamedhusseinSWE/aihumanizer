import { NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, planId } = body;

    console.log("🧪 Testing Stripe webhook payload simulation...");

    // Simulate the exact webhook payload that Stripe would send
    const mockWebhookPayload = {
      id: "evt_test_webhook",
      object: "event",
      type: "checkout.session.completed",
      data: {
        object: {
          id: "cs_test_" + Date.now(),
          object: "checkout.session",
          amount_total: 2900, // $29.00 in cents
          currency: "usd",
          customer_email: "test@example.com",
          payment_status: "paid",
          subscription: "sub_test_" + Date.now(),
          metadata: {
            userId: userId,
            planId: planId.toString(),
            planName: "Pro",
          },
        },
      },
    };

    console.log(
      "📋 Mock webhook payload:",
      JSON.stringify(mockWebhookPayload, null, 2),
    );

    // Get plan details
    const plan = await prisma.plan.findUnique({
      where: { id: parseInt(planId) },
    });

    if (!plan) {
      return NextResponse.json({ error: "Plan not found" }, { status: 404 });
    }

    // Simulate the webhook processing logic
    const subscriptionId = mockWebhookPayload.data.object.subscription;
    const sessionMetadata = mockWebhookPayload.data.object.metadata;

    console.log("🔍 Processing webhook data:", {
      subscriptionId,
      userId: sessionMetadata.userId,
      planId: sessionMetadata.planId,
    });

    // Update user subscription (exact same logic as real webhook)
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        subscriptionId,
        planName: plan.name,
        subscriptionStatus: "active",
        planId: parseInt(planId),
      },
    });

    console.log("✅ User updated successfully:", {
      id: updatedUser.id,
      email: updatedUser.email,
      planId: updatedUser.planId,
      planName: updatedUser.planName,
      subscriptionId: updatedUser.subscriptionId,
      subscriptionStatus: updatedUser.subscriptionStatus,
    });

    // Create subscription record
    await prisma.subscription.create({
      data: {
        stripeSubId: subscriptionId,
        userId,
        planId: parseInt(planId),
        status: "active",
        interval: "monthly",
        startDate: new Date(),
        endDate: null,
      },
    });

    // Create payment record
    await prisma.payment.create({
      data: {
        amount: 29.0, // $29.00
        status: "paid",
        stripe_payment_id: "pi_test_" + Date.now(),
        price_id: plan.priceId || "price_test",
        user_email: updatedUser.email,
        userId,
      },
    });

    console.log("✅ All records created successfully");

    return NextResponse.json({
      message: "Stripe webhook simulation completed successfully",
      webhookPayload: mockWebhookPayload,
      updatedUser: {
        id: updatedUser.id,
        email: updatedUser.email,
        planId: updatedUser.planId,
        planName: updatedUser.planName,
        subscriptionId: updatedUser.subscriptionId,
        subscriptionStatus: updatedUser.subscriptionStatus,
      },
    });
  } catch (error) {
    console.error("❌ Webhook simulation error:", error);
    return NextResponse.json(
      { error: "Failed to simulate webhook" },
      { status: 500 },
    );
  }
}
