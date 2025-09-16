import { NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, planId } = body;

    console.log(
      "🧪 Testing subscription update for user:",
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

    console.log("📦 Plan found:", {
      id: plan.id,
      name: plan.name,
      priceId: plan.priceId,
    });

    // Update user subscription (this is what the webhook should do)
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        planId: parseInt(planId),
        planName: plan.name,
        subscriptionId: "test-sub-" + Date.now(),
        subscriptionStatus: "active",
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
        stripeSubId: "test-sub-" + Date.now(),
        userId,
        planId: parseInt(planId),
        status: "active",
        interval: "monthly",
        startDate: new Date(),
        endDate: null,
      },
    });

    // Get updated user data
    const finalUser = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        planId: true,
        planName: true,
        subscriptionId: true,
        subscriptionStatus: true,
      },
    });

    return NextResponse.json({
      message: "Subscription update test completed",
      user: finalUser,
      plan: {
        id: plan.id,
        name: plan.name,
        priceId: plan.priceId,
        price: plan.price,
      },
    });
  } catch (error) {
    console.error("❌ Subscription update test error:", error);
    return NextResponse.json(
      { error: "Failed to update subscription" },
      { status: 500 },
    );
  }
}

export async function GET() {
  try {
    // Get all users to see current state
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        planId: true,
        planName: true,
        subscriptionId: true,
        subscriptionStatus: true,
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

    return NextResponse.json({
      message: "Current database state",
      users,
      plans,
      stats: {
        totalUsers: users.length,
        usersWithSubscriptions: users.filter((u) => u.subscriptionId).length,
        usersWithPlans: users.filter((u) => u.planId).length,
        totalPlans: plans.length,
      },
    });
  } catch (error) {
    console.error("❌ Failed to fetch data:", error);
    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: 500 },
    );
  }
}
