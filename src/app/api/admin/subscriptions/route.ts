import { NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const subscriptions = await prisma.subscription.findMany({
      include: {
        user: {
          select: {
            email: true,
          },
        },
        plan: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        startDate: "desc",
      },
    });

    const formattedSubscriptions = subscriptions.map((sub) => ({
      id: sub.id,
      userId: sub.userId,
      userEmail: sub.user.email,
      planName: sub.plan.name,
      status: sub.status,
      startDate: sub.startDate.toISOString(),
      endDate: sub.endDate?.toISOString() || null,
    }));

    return NextResponse.json({
      success: true,
      subscriptions: formattedSubscriptions,
    });
  } catch (error) {
    console.error("Error fetching subscriptions:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch subscriptions" },
      { status: 500 },
    );
  }
}
