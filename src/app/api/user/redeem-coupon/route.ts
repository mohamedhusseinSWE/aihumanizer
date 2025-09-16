import { NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";
import { getSession } from "@/lib/getSession";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { code, planId } = body;

    console.log("🎫 Redeeming coupon:", { code, planId });

    // Get the logged-in user
    const user = await getSession();

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Not authenticated" },
        { status: 401 },
      );
    }

    // Validate input
    if (!code || !planId) {
      return NextResponse.json(
        { success: false, message: "Code and plan ID are required" },
        { status: 400 },
      );
    }

    // Find the coupon
    const coupon = await prisma.coupon.findUnique({
      where: { code: code.toUpperCase() },
      include: {
        plan: {
          select: {
            id: true,
            name: true,
            price: true,
            interval: true,
          },
        },
      },
    });

    if (!coupon) {
      return NextResponse.json(
        { success: false, message: "Invalid coupon code" },
        { status: 404 },
      );
    }

    // Check if coupon is already used
    if (coupon.isUsed) {
      return NextResponse.json(
        { success: false, message: "This coupon has already been used" },
        { status: 400 },
      );
    }

    // Check if the plan matches
    if (coupon.planId !== parseInt(planId)) {
      return NextResponse.json(
        {
          success: false,
          message: `This coupon is for ${coupon.plan.name} plan, not the selected plan`,
        },
        { status: 400 },
      );
    }

    // Check if user already has a subscription for this plan
    const existingSubscription = await prisma.subscription.findFirst({
      where: {
        userId: user.user.id,
        planId: coupon.planId,
        status: "active",
      },
    });

    if (existingSubscription) {
      return NextResponse.json(
        {
          success: false,
          message: "You already have an active subscription for this plan",
        },
        { status: 400 },
      );
    }

    // Update user subscription
    const updatedUser = await prisma.user.update({
      where: { id: user.user.id },
      data: {
        planId: coupon.planId,
        planName: coupon.plan.name,
        subscriptionId: `coupon-${coupon.id}-${Date.now()}`,
        subscriptionStatus: "active",
      },
    });

    console.log("✅ User updated:", {
      id: updatedUser.id,
      email: updatedUser.email,
      planId: updatedUser.planId,
      planName: updatedUser.planName,
      subscriptionStatus: updatedUser.subscriptionStatus,
    });

    // Mark coupon as used and assign to user
    await prisma.coupon.update({
      where: { id: coupon.id },
      data: {
        isUsed: true,
        userId: user.user.id,
      },
    });

    // Create subscription record
    await prisma.subscription.create({
      data: {
        stripeSubId: `coupon-${coupon.id}-${Date.now()}`,
        userId: user.user.id,
        planId: coupon.planId,
        status: "active",
        interval: coupon.plan.interval,
        startDate: new Date(),
        endDate: null, // Lifetime subscription
      },
    });

    // Create payment record (0 amount for coupon)
    await prisma.payment.create({
      data: {
        amount: 0, // Free coupon
        status: "paid",
        stripe_payment_id: `coupon-${coupon.id}`,
        price_id: `coupon-${coupon.id}`,
        user_email: user.user.email,
        userId: user.user.id,
      },
    });

    console.log("✅ Coupon redeemed successfully for user:", user.user.id);

    return NextResponse.json({
      success: true,
      message: "Coupon redeemed successfully!",
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        planId: updatedUser.planId,
        planName: updatedUser.planName,
        subscriptionId: updatedUser.subscriptionId,
        subscriptionStatus: updatedUser.subscriptionStatus,
      },
      plan: coupon.plan,
    });
  } catch (error) {
    console.error("❌ Coupon redemption error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to redeem coupon",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
