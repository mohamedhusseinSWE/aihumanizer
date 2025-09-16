import { NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, planId } = body;

    console.log(`🧪 Testing plan upgrade for user: ${userId}, plan: ${planId}`);

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

    console.log("✅ User updated:", {
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
        stripeSubId: "sub_" + Date.now() + "_" + userId,
        userId: userId,
        planId: parseInt(planId),
        status: "active",
        interval: plan.interval,
        startDate: new Date(),
        endDate: null,
      },
    });

    // Create payment record
    await prisma.payment.create({
      data: {
        amount: plan.price,
        status: "paid",
        stripe_payment_id: "pi_" + Date.now(),
        price_id: plan.priceId || "manual_upgrade",
        user_email: updatedUser.email,
        userId: userId,
      },
    });

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
      message: "Plan upgrade test completed!",
      updatedUser: {
        id: updatedUser.id,
        email: updatedUser.email,
        planId: updatedUser.planId,
        planName: updatedUser.planName,
        subscriptionId: updatedUser.subscriptionId,
        subscriptionStatus: updatedUser.subscriptionStatus,
      },
      allUsers: allUsers,
    });
  } catch (error) {
    console.error("❌ Plan upgrade test error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to upgrade plan",
      },
      { status: 500 },
    );
  }
}
