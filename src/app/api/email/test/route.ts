import { NextRequest, NextResponse } from "next/server";
import {
  sendTestEmail,
  sendWelcomeEmail,
  sendPaymentSuccessEmail,
} from "@/lib/email";

export async function POST(request: NextRequest) {
  try {
    const { type, email, userName, planName, amount } = await request.json();

    let result;

    switch (type) {
      case "test":
        result = await sendTestEmail(email);
        break;
      case "welcome":
        result = await sendWelcomeEmail(userName, email);
        break;
      case "payment":
        result = await sendPaymentSuccessEmail(
          userName,
          email,
          planName,
          amount,
        );
        break;
      default:
        return NextResponse.json(
          { error: "Invalid email type" },
          { status: 400 },
        );
    }

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: `${type} email sent successfully`,
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          error: "Failed to send email",
        },
        { status: 500 },
      );
    }
  } catch (error) {
    console.error("Email test error:", error);
    return NextResponse.json(
      {
        error: "Failed to send test email",
      },
      { status: 500 },
    );
  }
}
