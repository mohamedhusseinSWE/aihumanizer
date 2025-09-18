"use server";

import { redirect } from "next/navigation";
import { auth } from "../auth";
import { headers } from "next/headers";
import { PrismaClient } from "@/generated/prisma";
import { sendWelcomeEmail } from "../email";

const prisma = new PrismaClient();

async function verifyCaptcha(captchaToken: string) {
  const secretKey = process.env.TURNSTILE_SECRET_KEY as string;

  const response = await fetch(
    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `secret=${encodeURIComponent(
        secretKey
      )}&response=${encodeURIComponent(captchaToken)}`,
    }
  );

  const data = await response.json();
  return data.success as boolean;
}

export const signIn = async (
  email: string,
  password: string,
  captchaToken: string
) => {
  try {
    const isValid = await verifyCaptcha(captchaToken);
    if (!isValid) {
      return { user: null, error: "Captcha verification failed" };
    }

    const hdrs = headers();
    const ip =
      (await hdrs).get("x-forwarded-for")?.split(",")[0] ||
      (await hdrs).get("x-real-ip") ||
      "Unknown";
    const userAgent = (await hdrs).get("user-agent") || null;

    const result = await auth.api.signInEmail({
      body: { email, password, callbackURL: "/dashboard" },
    });

    if (!result.user) {
      return { user: null, error: "Invalid email or password" };
    }

    const latestSession = await prisma.session.findFirst({
      where: { userId: result.user.id },
      orderBy: { createdAt: "desc" },
    });

    if (latestSession) {
      await prisma.session.update({
        where: { id: latestSession.id },
        data: { ipAddress: ip, userAgent },
      });
    }

    return { user: result.user, error: null };
  } catch (err) {
    console.error("SignIn failed:", err);
    return { user: null, error: "Something went wrong while signing in" };
  }
};

export const signUp = async (
  email: string,
  password: string,
  name: string,
  captchaToken: string
) => {
  try {
    const isValid = await verifyCaptcha(captchaToken);
    if (!isValid) {
      return { user: null, error: "Captcha verification failed" };
    }

    const hdrs = headers();
    const ip =
      (await hdrs).get("x-forwarded-for")?.split(",")[0] ||
      (await hdrs).get("x-real-ip") ||
      "Unknown";
    const userAgent = (await hdrs).get("user-agent") || null;

    const result = await auth.api.signUpEmail({
      body: { email, password, name, callbackURL: "/dashboard" },
    });

    if (!result.user) {
      return { user: null, error: "Failed to create account" };
    }

    const latestSession = await prisma.session.findFirst({
      where: { userId: result.user.id },
      orderBy: { createdAt: "desc" },
    });

    if (latestSession) {
      await prisma.session.update({
        where: { id: latestSession.id },
        data: { ipAddress: ip, userAgent },
      });
    }

    try {
      await sendWelcomeEmail(result.user.name || "User", result.user.email);
    } catch (error) {
      console.error("Failed to send welcome email:", error);
    }

    return { user: result.user, error: null };
  } catch (err) {
    console.error("SignUp failed:", err);
    return { user: null, error: "Something went wrong while signing up" };
  }
};

export const signInSocial = async (provider: "google") => {
  const { url } = await auth.api.signInSocial({
    body: {
      provider,
      callbackURL: "/dashboard",
    },
  });

  if (url) {
    redirect(url);
  }
};

export const signOut = async () => {
  const result = await auth.api.signOut({ headers: await headers() });
  return result;
};
