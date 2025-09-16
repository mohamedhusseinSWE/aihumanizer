import { NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";
import { getSession } from "@/lib/getSession";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    // Get the logged-in user
    const user = await getSession();

    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const body = await req.json();
    const { planId } = body;

    console.log(`🔄 User ${user.user.email} upgrading to plan ID: ${planId}`);

    // Get plan details
    const plan = await prisma.plan.findUnique({
      where: { id: parseInt(planId) },
    });

    if (!plan) {
      return NextResponse.json({ error: "Plan not found" }, { status: 404 });
    }

    console.log(`📦 Plan found: ${plan.name} (${plan.priceId})`);

    // Update user subscription data
    const updatedUser = await prisma.user.update({
      where: { id: user.user.id },
      data: {
        planId: parseInt(planId),
        planName: plan.name,
        subscriptionId: "sub_" + Date.now() + "_" + user.user.id,
        subscriptionStatus: "active",
      },
    });

    console.log("✅ User subscription updated:", {
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
        stripeSubId: "sub_" + Date.now() + "_" + user.user.id,
        userId: user.user.id,
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
        user_email: user.user.email,
        userId: user.user.id,
      },
    });

    console.log("✅ Payment record created:", payment.id);

    return NextResponse.json({
      success: true,
      message: "Plan upgraded successfully!",
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        planId: updatedUser.planId,
        planName: updatedUser.planName,
        subscriptionId: updatedUser.subscriptionId,
        subscriptionStatus: updatedUser.subscriptionStatus,
      },
      plan: {
        id: plan.id,
        name: plan.name,
        price: plan.price,
        interval: plan.interval,
      },
    });
  } catch (error) {
    console.error("❌ Plan upgrade error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to upgrade plan",
      },
      { status: 500 },
    );
  }
}

export async function GET() {
  try {
    // Get the logged-in user
    const user = await getSession();

    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Get user's current subscription data
    const userData = await prisma.user.findUnique({
      where: { id: user.user.id },
      select: {
        id: true,
        email: true,
        planId: true,
        planName: true,
        subscriptionId: true,
        subscriptionStatus: true,
      },
    });

    // Get all available plans
    const plans = await prisma.plan.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        interval: true,
        features: true,
        isPopular: true,
      },
      orderBy: { price: "asc" },
    });

    return NextResponse.json({
      success: true,
      user: userData,
      plans: plans,
    });
  } catch (error) {
    console.error("❌ Failed to fetch user data:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch data",
      },
      { status: 500 },
    );
  }
}
