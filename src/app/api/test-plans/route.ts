import { NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const plans = await prisma.plan.findMany({
      orderBy: { createdAt: "desc" },
    });

    console.log("Raw plans from database:", plans);

    return NextResponse.json({
      success: true,
      count: plans.length,
      plans: plans,
    });
  } catch (error) {
    console.error("Error fetching plans:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch plans" },
      { status: 500 },
    );
  }
}
