import { NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, planId } = body;

    console.log(`🔧 Fixing subscription for user: ${userId}, plan: ${planId}`);

    // Get plan details
    const plan = await prisma.plan.findUnique({
      where: { id: parseInt(planId) },
    });

    if (!plan) {
      return NextResponse.json({ error: "Plan not found" }, { status: 404 });
    }

    console.log(`📦 Plan found: ${plan.name} ($${plan.price})`);

    // Update user subscription data
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        planId: parseInt(planId),
        planName: plan.name,
        subscriptionId: "sub_" + Date.now() + "_" + userId,
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
    const subscription = await prisma.subscription.create({
      data: {
        stripeSubId: "sub_" + Date.now() + "_" + userId,
        userId: userId,
        planId: parseInt(planId),
        status: "active",
        interval: plan.interval,
        startDate: new Date(),
        endDate: null,
      },
    });

    console.log("✅ Subscription record created:", subscription.id);

    // Create payment record
    const payment = await prisma.payment.create({
      data: {
        amount: plan.price,
        status: "paid",
        stripe_payment_id: "pi_" + Date.now(),
        price_id: plan.priceId || "manual_upgrade",
        user_email: updatedUser.email,
        userId: userId,
      },
    });

    console.log("✅ Payment record created:", payment.id);

    // Get all users to show the updated state
    const allUsers = await prisma.user.findMany({
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

    return NextResponse.json({
      success: true,
      message: "User subscription fixed successfully!",
      updatedUser: {
        id: updatedUser.id,
        email: updatedUser.email,
        planId: updatedUser.planId,
        planName: updatedUser.planName,
        subscriptionId: updatedUser.subscriptionId,
        subscriptionStatus: updatedUser.subscriptionStatus,
      },
      allUsers: allUsers,
      stats: {
        totalUsers: allUsers.length,
        usersWithSubscriptions: allUsers.filter((u) => u.subscriptionId).length,
        usersWithPlans: allUsers.filter((u) => u.planId).length,
      },
    });
  } catch (error) {
    console.error("❌ Fix user subscription error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fix user subscription",
        details: error,
      },
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
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      message: "Current database state",
      users,
      stats: {
        totalUsers: users.length,
        usersWithSubscriptions: users.filter((u) => u.subscriptionId).length,
        usersWithPlans: users.filter((u) => u.planId).length,
      },
    });
  } catch (error) {
    console.error("❌ Failed to fetch data:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch data",
      },
      { status: 500 },
    );
  }
}
