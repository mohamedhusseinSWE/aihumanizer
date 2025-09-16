"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Gift, AlertCircle, CheckCircle } from "lucide-react";

interface Plan {
  id: number;
  name: string;
  price: number;
  interval: string;
}

export default function RedeemCode() {
  const [code, setCode] = useState("");
  const [selectedPlan, setSelectedPlan] = useState<number | "">("");
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingPlans, setLoadingPlans] = useState(true);

  // Fetch available plans
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await fetch("/api/admin/plans");
        const data = await res.json();
        if (data.success) {
          setPlans(data.plans);
        }
      } catch (error) {
        console.error("Failed to fetch plans:", error);
        toast.error("Failed to load plans");
      } finally {
        setLoadingPlans(false);
      }
    };

    fetchPlans();
  }, []);

  const handleRedeem = async () => {
    if (!code.trim()) {
      toast.error("Please enter a coupon code");
      return;
    }

    if (!selectedPlan) {
      toast.error("Please select a plan");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/user/redeem-coupon", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code: code.trim(),
          planId: selectedPlan,
        }),
      });

      const data = await res.json();

      if (data.success) {
        toast.success(
          "Coupon redeemed successfully! Your account has been upgraded.",
        );
        setCode("");
        setSelectedPlan("");
        // Optionally refresh user data or redirect
      } else {
        toast.error(data.message || "Failed to redeem coupon");
      }
    } catch (error) {
      console.error("Redeem error:", error);
      toast.error("Failed to redeem coupon. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loadingPlans) {
    return (
      <div className="p-6">
        <div className="text-center">Loading plans...</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Gift className="w-8 h-8 text-purple-600 mr-3" />
            <h1 className="text-3xl font-bold text-gray-900">Redeem Code</h1>
          </div>
          <p className="text-gray-600">
            Enter your coupon code to upgrade your account
          </p>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl text-center">
              Redeem Your Coupon
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Plan Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Plan
              </label>
              <select
                value={selectedPlan}
                onChange={(e) =>
                  setSelectedPlan(
                    e.target.value ? parseInt(e.target.value) : "",
                  )
                }
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="">Choose a plan...</option>
                {plans.map((plan) => (
                  <option key={plan.id} value={plan.id}>
                    {plan.name} - ${plan.price} ({plan.interval})
                  </option>
                ))}
              </select>
            </div>

            {/* Code Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Code
              </label>
              <Input
                type="text"
                placeholder="Enter your coupon code"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                className="w-full p-3 text-lg font-mono tracking-wider"
              />
            </div>

            {/* Warning Banner */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start">
                <AlertCircle className="w-5 h-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-blue-800">
                  <strong>Important:</strong> Your current plan will be
                  overwritten if you redeem a code that is different than your
                  already existing plan.
                </p>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              onClick={handleRedeem}
              disabled={loading || !code.trim() || !selectedPlan}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 text-lg font-medium"
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Processing...
                </div>
              ) : (
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Submit
                </div>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Information Section */}
        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-yellow-800 mb-3">
            How it works:
          </h3>
          <div className="space-y-2 text-sm text-yellow-700">
            <p>
              1. <strong>Reseller sends a unique coupon</strong> with 100% off
              on Lifetime account
            </p>
            <p>
              2. <strong>You create a free account</strong> and go to Account
              settings
            </p>
            <p>
              3. <strong>Enter the coupon code</strong> and select the plan
            </p>
            <p>
              4. <strong>Your account is upgraded</strong> from current plan to
              new plan (based on what plan the coupon is attached to)
            </p>
            <p>
              5. <strong>No Stripe checkout required</strong> - most Lifetime
              coupons are 100% off, so it&apos;s internally managed within the
              system
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
