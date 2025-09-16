"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { Plan } from "../lib/types/plan";
import { toast } from "sonner";

interface AuthContextType {
  plans: Plan[];
  fetchPlans: () => Promise<void>;
  subscribeToPlan: (planId: number) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [plans, setPlans] = useState<Plan[]>([]);

  const fetchPlans = async () => {
    try {
      const res = await fetch("/api/plans", {
        credentials: "include",
        cache: "no-store",
      });
      if (!res.ok) {
        throw new Error("Failed to fetch plans");
      }
      const data = await res.json();
      setPlans(data.plans);
    } catch (error) {
      console.error("Error fetching plans:", error);
      throw error;
    }
  };

  const subscribeToPlan = async (planId: number) => {
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ planId }),
      });

      if (!res.ok) {
        throw new Error("Failed to create checkout session");
      }

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        toast.error("Checkout session URL missing");
      }
    } catch (err) {
      console.error("Error subscribing to plan:", err);
      toast.error("Failed to redirect to checkout");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        plans,
        fetchPlans,
        subscribeToPlan,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
