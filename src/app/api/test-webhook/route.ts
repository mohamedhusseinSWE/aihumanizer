import { NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Get a user to test with
    const users = await prisma.user.findMany({
      take: 5,
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
      message: "Test webhook endpoint",
      users: users,
      totalUsers: users.length,
    });
  } catch (error) {
    console.error("Test webhook error:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, planId, planName, subscriptionId } = body;

    console.log("🧪 Test webhook called with:", {
      userId,
      planId,
      planName,
      subscriptionId,
    });

    // Update user subscription for testing
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        planId: parseInt(planId),
        planName: planName || "test-plan",
        subscriptionId: subscriptionId || "test-sub-" + Date.now(),
        subscriptionStatus: "active",
      },
    });

    return NextResponse.json({
      message: "User updated successfully",
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
    console.error("Test webhook error:", error);
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 },
    );
  }
}
