import type { Metadata } from "next";
import { Source_Sans_3 as FontSans } from "next/font/google";

import { AuthProvider } from "./providers/AuthProvider";
import { AdminAuthProvider } from "./providers/AdminAuthProvider";
import { Toaster } from "sonner";
import "./globals.css";

const fontSans = FontSans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "AI Humanizer - Humanize Your Content with AI",
  description:
    "AI Humanizer transforms AI-generated text into natural, human-like writing. Perfect for content creators, marketers, and professionals who need authentic tone and clarity.",
  icons: {
    icon: "/favicon.ico", // replace with your favicon path
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body
        className={`${fontSans.variable} font-sans antialiased h-full bg-white text-gray-900`}
      >
        <Toaster richColors position="top-right" />
        <AuthProvider>
          <AdminAuthProvider>{children}</AdminAuthProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
