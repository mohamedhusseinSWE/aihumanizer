import { NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const jobs = await prisma.humanizationJob.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            planName: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 50, // Limit to recent 50 jobs for performance
    });

    const formattedJobs = jobs.map((job) => ({
      id: job.id,
      userId: job.userId,
      inputText: job.inputText,
      outputText: job.outputText,
      wordCount: job.wordCount ?? 0, // ✅ fallback
      status: job.status,
      createdAt: job.createdAt.toISOString(),
      completedAt: job.completedAt ? job.completedAt.toISOString() : null,
      user: {
        id: job.user?.id ?? "N/A",
        name: job.user?.name ?? "Unknown",
        email: job.user?.email ?? "No email",
        planName: job.user?.planName ?? "N/A",
      },
    }));

    return NextResponse.json({
      success: true,
      jobs: formattedJobs,
    });
  } catch (error) {
    console.error("Error fetching humanization jobs:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch humanization jobs" },
      { status: 500 },
    );
  }
}
