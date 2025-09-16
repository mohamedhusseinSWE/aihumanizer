import { NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

const prisma = new PrismaClient();

export async function GET() {
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

    // Get current user's IP address
    const hdrs = await headers();
    const currentIp =
      hdrs.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      hdrs.get("x-real-ip") ||
      "Unknown";

    // Check if this IP has been used for other accounts
    const sessionsWithSameIp = await prisma.session.findMany({
      where: {
        ipAddress: currentIp,
        userId: {
          not: session.user.id, // Exclude current user
        },
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            planName: true,
            createdAt: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Check if any of these accounts have a paid plan
    const hasPaidAccount = sessionsWithSameIp.some(
      (session) =>
        session.user.planName &&
        session.user.planName.toLowerCase() !== "free" &&
        session.user.planName.toLowerCase() !== "free ",
    );

    // Get current user's plan
    const currentUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        planName: true,
        createdAt: true,
      },
    });

    const isCurrentUserFree =
      !currentUser?.planName ||
      currentUser.planName.toLowerCase() === "free" ||
      currentUser.planName.toLowerCase() === "free ";

    // Determine if this is a duplicate registration
    const isDuplicateRegistration =
      sessionsWithSameIp.length > 0 && isCurrentUserFree;

    return NextResponse.json({
      success: true,
      isDuplicateRegistration,
      hasPaidAccount,
      currentUserPlan: currentUser?.planName || "free",
      duplicateAccounts: sessionsWithSameIp.map((s) => ({
        email: s.user.email,
        planName: s.user.planName,
        createdAt: s.createdAt,
      })),
      currentIp,
      message: isDuplicateRegistration
        ? "This IP address has been used to create multiple accounts. Please upgrade to Pro plan to continue using the service."
        : null,
    });
  } catch (error) {
    console.error("Failed to check duplicate IP:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 },
    );
  }
}
