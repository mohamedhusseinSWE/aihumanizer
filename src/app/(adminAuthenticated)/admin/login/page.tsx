"use client";

import Link from "next/link";
import { AdminLoginForm } from "@/components/auth/AdminLoginForm";

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center h-screen bg-[#fefcf3] p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg relative">
        {/* Logo for top */}
        <div className="absolute top-4 left-4">
          <Link
            href="/"
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
          >
            <span className="text-lg font-semibold text-gray-800">
              AI Humanizer
            </span>
          </Link>
        </div>

        {/* Welcome text */}
        <div className="text-center mb-6 mt-10">
          <h1 className="text-2xl font-semibold tracking-tight">
            Welcome back
          </h1>
          <p className="text-sm text-muted-foreground">
            Enter your email and password to sign in
          </p>
        </div>

        {/* Login form */}
        <AdminLoginForm />
      </div>
    </div>
  );
}
