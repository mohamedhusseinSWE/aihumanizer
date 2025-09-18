import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

const prisma = new PrismaClient();

// Define proper session types
interface SessionUser {
  id: string;
  name?: string | null;
  email?: string | null;
}

interface Session {
  user?: SessionUser;
  expires?: string;
}

export async function POST(request: NextRequest) {
  let session: Session | null = null;
  let text = "";

  try {
    const requestData = await request.json();
    text = requestData.text;
    const mode = requestData.mode || "balanced";

    if (!text || text.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: "Text is required" },
        { status: 400 }
      );
    }

    // Get user session
    session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Authentication required" },
        { status: 401 }
      );
    }

    const openRouterApiKey = process.env.OPENROUTER_API_KEY;
    if (!openRouterApiKey) {
      return NextResponse.json(
        { success: false, error: "OpenRouter API key not configured" },
        { status: 500 }
      );
    }

    // Word count calculation
    const wordCount = text
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0).length;

    // Create humanization job
    const job = await prisma.humanizationJob.create({
      data: {
        userId: session.user.id,
        inputText: text,
        wordCount,
        status: "PENDING",
      },
    });

    // Update job to PROCESSING
    await prisma.humanizationJob.update({
      where: { id: job.id },
      data: { status: "PROCESSING" },
    });

    const prompt = `You are an expert at converting AI-generated text into natural, human-like writing. Your task is to rewrite the following text to make it sound completely human-written while preserving the original meaning and key information.

Guidelines for humanization:
1. Use natural, conversational language
2. Add human-like variations in sentence structure
3. Include subtle imperfections and natural flow
4. Use varied vocabulary and expressions
5. Add appropriate transitions and connectors
6. Make it sound like it was written by a human, not AI
7. Maintain the original tone and intent
8. Use contractions and informal language where appropriate
9. Add natural pauses and rhythm
10. Ensure the text flows naturally from one idea to the next

Mode: ${
      mode === "ultra"
        ? "Ultra mode - Make it extremely human-like with maximum naturalness"
        : "Balanced mode - Make it human-like while maintaining clarity"
    }

Original text to humanize:
"${text}"

Please rewrite this text to sound completely human-written:`;

    // Call OpenRouter API
    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${openRouterApiKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer":
            process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
          "X-Title": "AI Humanizer",
        },
        body: JSON.stringify({
          model: "anthropic/claude-3.5-sonnet",
          messages: [{ role: "user", content: prompt }],
          max_tokens: 2000,
          temperature: 0.8,
          top_p: 0.9,
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.text();
      console.error("OpenRouter API error:", errorData);
      return NextResponse.json(
        { success: false, error: "Failed to humanize text" },
        { status: 500 }
      );
    }

    const data = await response.json();
    const humanizedText = data.choices?.[0]?.message?.content?.trim();

    if (!humanizedText) {
      await prisma.humanizationJob.update({
        where: { id: job.id },
        data: { status: "FAILED" },
      });

      return NextResponse.json(
        { success: false, error: "No humanized text generated" },
        { status: 500 }
      );
    }

    const humanizedWordCount = humanizedText
      .trim()
      .split(/\s+/)
      .filter((word: string) => word.length > 0).length;

    await prisma.humanizationJob.update({
      where: { id: job.id },
      data: {
        outputText: humanizedText,
        status: "COMPLETED",
        completedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      humanizedText,
      originalText: text,
      mode,
      jobId: job.id,
      wordCount: { original: wordCount, humanized: humanizedWordCount },
    });
  } catch (error) {
    console.error("Humanization error:", error);

    try {
      if (session?.user?.id && text) {
        const job = await prisma.humanizationJob.findFirst({
          where: { userId: session.user.id, inputText: text },
          orderBy: { createdAt: "desc" },
        });
        if (job) {
          await prisma.humanizationJob.update({
            where: { id: job.id },
            data: { status: "FAILED" },
          });
        }
      }
    } catch (dbError) {
      console.error("Failed to update job status:", dbError);
    }

    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}