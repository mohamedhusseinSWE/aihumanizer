import { NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, planId } = body;

    console.log("🧪 Testing Stripe webhook simulation...");
    console.log("👤 User ID:", userId);
    console.log("📦 Plan ID:", planId);

    // Get plan details
    const plan = await prisma.plan.findUnique({
      where: { id: parseInt(planId) },
    });

    if (!plan) {
      return NextResponse.json({ error: "Plan not found" }, { status: 404 });
    }

    console.log("📦 Plan found:", { id: plan.id, name: plan.name });

    // Simulate webhook update
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

    return NextResponse.json({
      message: "Webhook simulation successful",
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
    console.error("❌ Webhook simulation error:", error);
    return NextResponse.json(
      { error: "Failed to simulate webhook" },
      { status: 500 },
    );
  }
}
