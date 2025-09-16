import { NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";
import { getSession } from "@/lib/getSession";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const user = await getSession();

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Not authenticated" },
        { status: 401 },
      );
    }

    // Fetch user's used coupons
    const coupons = await prisma.coupon.findMany({
      where: {
        userId: user.user.id,
        isUsed: true,
      },
      include: {
        plan: {
          select: {
            id: true,
            name: true,
            price: true,
            interval: true,
            description: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      success: true,
      coupons: coupons.map((coupon) => ({
        id: coupon.id,
        code: coupon.code,
        isUsed: coupon.isUsed,
        createdAt: coupon.createdAt,
        plan: coupon.plan,
      })),
    });
  } catch (error) {
    console.error("❌ Coupons fetch error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch coupons",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
