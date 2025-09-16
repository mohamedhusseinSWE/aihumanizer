// src/providers/AuthProvider.tsx
"use client";

import { ReactNode, useEffect } from "react";
import { AuthProvider as CoreAuthProvider } from "../context/AuthContext";
import { useRouter } from "next/navigation";

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  useEffect(() => {
    // do something after router is mounted
  }, [router]);

  return <CoreAuthProvider>{children}</CoreAuthProvider>;
}
