import { NextRequest, NextResponse } from "next/server";
import { PrismaClient, Prisma } from "@/generated/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    // Get user session using better-auth
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Authentication required" },
        { status: 401 },
      );
    }

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "10");
    const offset = parseInt(searchParams.get("offset") || "0");
    const status = searchParams.get("status");

    // Build where clause with proper typing
    const whereClause: Prisma.HumanizationJobWhereInput = {
      userId: session.user.id,
    };

    if (
      status &&
      ["PENDING", "PROCESSING", "COMPLETED", "FAILED"].includes(status)
    ) {
      whereClause.status = status as Prisma.HumanizationJobWhereInput["status"];
    }

    // Fetch humanization jobs
    const jobs = await prisma.humanizationJob.findMany({
      where: whereClause,
      orderBy: { createdAt: "desc" },
      take: limit,
      skip: offset,
      select: {
        id: true,
        inputText: true,
        outputText: true,
        wordCount: true,
        status: true,
        createdAt: true,
        completedAt: true,
      },
    });

    // Get total count
    const totalCount = await prisma.humanizationJob.count({
      where: whereClause,
    });

    return NextResponse.json({
      success: true,
      jobs,
      pagination: {
        total: totalCount,
        limit,
        offset,
        hasMore: offset + limit < totalCount,
      },
    });
  } catch (error) {
    console.error("Failed to fetch humanization jobs:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 },
    );
  }
}
