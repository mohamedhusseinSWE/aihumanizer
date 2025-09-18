import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import OpenAI from "openai"; // npm install openai // or what u like at all in using api model 

const prisma = new PrismaClient();
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { success: false, error: "OpenAI API key not configured" },
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

Original text to humanize:
"${text}"

Please rewrite this text to sound completely human-written in a **balanced** way (human-like but clear):`;

    // Call OpenAI API
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini", // Or whichever OpenAI model you prefer
      messages: [{ role: "user", content: prompt }],
      max_tokens: 2000,
      temperature: 0.8,
      top_p: 0.9,
    });

    const humanizedText = response.choices?.[0]?.message?.content?.trim();

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



/**
 * ============================================================
 * 👉 Switching from OpenAI API to Claude API (Anthropic)
 * ============================================================
 *
 * By default, this API route uses OpenAI for text humanization.
 * If you want to use Claude (Anthropic) instead, follow the steps:
 *
 * ------------------------------------------------------------
 * 1. Install Anthropic SDK:
 *    npm install @anthropic-ai/sdk
 *
 * 2. Import Anthropic at the top of this file:
 *    import Anthropic from "@anthropic-ai/sdk";
 *
 * 3. Initialize the client instead of OpenAI:
 *    const anthropic = new Anthropic({
 *      apiKey: process.env.ANTHROPIC_API_KEY!,
 *    });
 *
 * 4. Replace the OpenAI request block with Claude:
 *
 *    // Call Claude API
 *    const response = await anthropic.messages.create({
 *      model: "claude-3-opus-20240229", // or "claude-3-sonnet-20240229"
 *      max_tokens: 2000,
 *      temperature: 0.8,
 *      messages: [
 *        {
 *          role: "user",
 *          content: prompt,
 *        },
 *      ],
 *    });
 *
 *    // Claude's response format
 *    const humanizedText = response.content[0]?.text?.trim();
 *
 * 5. Keep the rest of the logic (Prisma job creation, updates,
 *    word counts, error handling) exactly the same.
 *
 * ------------------------------------------------------------
 * ⚠️ Notes:
 * - Make sure you add `ANTHROPIC_API_KEY` to your .env file.
 * - Claude’s response structure is slightly different:
 *     OpenAI  → response.choices[0].message.content
 *     Claude  → response.content[0].text
 * - Claude models have stricter token limits; adjust `max_tokens`
 *   and `model` depending on your Anthropic plan.
 *
 * ------------------------------------------------------------
 * ✅ Quick Swap Example:
 * 
 * // OpenAI
 * const response = await openai.chat.completions.create({...});
 * const humanizedText = response.choices[0].message.content.trim();
 *
 * // Claude
 * const response = await anthropic.messages.create({...});
 * const humanizedText = response.content[0].text.trim();
 * ------------------------------------------------------------
 */
