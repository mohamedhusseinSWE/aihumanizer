import { NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Get all users with their subscription data
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        planId: true,
        planName: true,
        subscriptionId: true,
        subscriptionStatus: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: "desc" },
    });

    // Get all plans
    const plans = await prisma.plan.findMany({
      select: {
        id: true,
        name: true,
        priceId: true,
        price: true,
        status: true,
      },
    });

    // Get all subscriptions
    const subscriptions = await prisma.subscription.findMany({
      select: {
        id: true,
        stripeSubId: true,
        userId: true,
        planId: true,
        status: true,
        startDate: true,
        endDate: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      message: "Debug webhook data",
      environment: {
        hasStripeSecret: !!process.env.STRIPE_SECRET_KEY,
        hasWebhookSecret: !!process.env.STRIPE_WEBHOOK_SECRET,
        appUrl: process.env.NEXT_PUBLIC_APP_URL,
      },
      users,
      plans,
      subscriptions,
      stats: {
        totalUsers: users.length,
        usersWithSubscriptions: users.filter((u) => u.subscriptionId).length,
        usersWithPlans: users.filter((u) => u.planId).length,
        totalPlans: plans.length,
        totalSubscriptions: subscriptions.length,
      },
    });
  } catch (error) {
    console.error("Debug webhook error:", error);
    return NextResponse.json(
      { error: "Failed to fetch debug data" },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, planId } = body;

    console.log(
      "🧪 Testing webhook simulation for user:",
      userId,
      "plan:",
      planId,
    );

    // Get plan details
    const plan = await prisma.plan.findUnique({
      where: { id: parseInt(planId) },
    });

    if (!plan) {
      return NextResponse.json({ error: "Plan not found" }, { status: 404 });
    }

    // Simulate the exact webhook logic
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        planId: parseInt(planId),
        planName: plan.name,
        subscriptionId: "test-sub-" + Date.now(),
        subscriptionStatus: "active",
      },
    });

    // Also create a subscription record
    await prisma.subscription.create({
      data: {
        stripeSubId: "test-sub-" + Date.now(),
        userId,
        planId: parseInt(planId),
        status: "active",
        interval: "monthly",
        startDate: new Date(),
        endDate: null,
      },
    });

    return NextResponse.json({
      message: "Webhook simulation completed",
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        planId: updatedUser.planId,
        planName: updatedUser.planName,
        subscriptionId: updatedUser.subscriptionId,
        subscriptionStatus: updatedUser.subscriptionStatus,
      },
    });
  } catch (error) {
    console.error("Webhook simulation error:", error);
    return NextResponse.json(
      { error: "Failed to simulate webhook" },
      { status: 500 },
    );
  }
}
