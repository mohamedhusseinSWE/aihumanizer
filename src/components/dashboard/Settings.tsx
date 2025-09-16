"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  User,
  Mail,
  Crown,
  Calendar,
  Gift,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";

interface Plan {
  id: number;
  name: string;
  description?: string;
  price: number;
  interval: string;
  features?: string;
  isPopular: boolean;
}

interface UserData {
  id: string;
  name: string;
  email: string;
  planId?: number;
  planName?: string;
  subscriptionId?: string;
  subscriptionStatus?: string;
  createdAt: string;
}

interface CouponData {
  id: number;
  code: string;
  isUsed: boolean;
  createdAt: string;
  plan: Plan;
}

export default function Settings() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [userPlan, setUserPlan] = useState<Plan | null>(null);
  const [userCoupons, setUserCoupons] = useState<CouponData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    setLoading(true);
    try {
      // Fetch user data
      const userRes = await fetch("/api/user/profile");
      const userData = await userRes.json();

      if (userData.success) {
        setUserData(userData.user);
        console.log("Settings: User data:", userData.user);

        // Fetch plans to get plan details
        const plansRes = await fetch("/api/admin/plans");
        const plansData = await plansRes.json();
        console.log("Settings: Plans data:", plansData);

        if (plansData.success) {
          // Try to find plan by planId first, then by planName
          let currentPlan = null;
          if (userData.user.planId) {
            currentPlan = plansData.plans.find(
              (plan: Plan) => plan.id === userData.user.planId,
            );
            console.log("Settings: Found plan by ID:", currentPlan);
          }
          // If no plan found by ID, try to find by name
          if (!currentPlan && userData.user.planName) {
            currentPlan = plansData.plans.find((plan: Plan) =>
              plan.name
                .toLowerCase()
                .includes(userData.user.planName.toLowerCase()),
            );
            console.log("Settings: Found plan by name:", currentPlan);
          }
          setUserPlan(currentPlan || null);
          console.log("Settings: Final user plan:", currentPlan);
        }

        // Fetch user's coupons
        const couponsRes = await fetch("/api/user/coupons");
        const couponsData = await couponsRes.json();

        if (couponsData.success) {
          setUserCoupons(couponsData.coupons || []);
        }
      }
    } catch (error) {
      console.error("Failed to fetch user data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "free":
        return "bg-gray-100 text-gray-800";
      case "canceled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="w-4 h-4" />;
      case "free":
        return <AlertCircle className="w-4 h-4" />;
      case "canceled":
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
          <span className="ml-2 text-gray-600">Loading your settings...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Account Settings
          </h1>
          <p className="text-gray-600">
            Manage your account information and subscription details
          </p>
        </div>

        <div className="grid gap-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="w-5 h-5 mr-2" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Name
                  </label>
                  <p className="text-lg font-semibold text-gray-900">
                    {userData?.name || "Not provided"}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Email
                  </label>
                  <p className="text-lg font-semibold text-gray-900 flex items-center">
                    <Mail className="w-4 h-4 mr-2" />
                    {userData?.email}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Member Since
                  </label>
                  <p className="text-lg font-semibold text-gray-900 flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    {userData?.createdAt
                      ? new Date(userData.createdAt).toLocaleDateString()
                      : "Unknown"}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Account Status
                  </label>
                  <div className="flex items-center">
                    <Badge
                      className={`${getStatusColor(userData?.subscriptionStatus || "free")} flex items-center`}
                    >
                      {getStatusIcon(userData?.subscriptionStatus || "free")}
                      <span className="ml-1 capitalize">
                        {userData?.subscriptionStatus || "free"}
                      </span>
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Subscription Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Crown className="w-5 h-5 mr-2" />
                Subscription Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Current Plan
                  </label>
                  <p className="text-lg font-semibold text-gray-900 flex items-center">
                    <Crown className="w-4 h-4 mr-2 text-yellow-500" />
                    {userData?.planName || userPlan?.name || "Free"}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Price
                  </label>
                  <p className="text-lg font-semibold text-gray-900">
                    {userPlan
                      ? `$${userPlan.price} / ${userPlan.interval}`
                      : userData?.planName === "Pro"
                        ? "Premium Plan"
                        : "Free"}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Subscription ID
                  </label>
                  <p className="text-sm font-mono text-gray-600">
                    {userData?.subscriptionId || "Not available"}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Plan Features
                  </label>
                  <div className="text-sm text-gray-600">
                    {userPlan?.description || "Premium features included"}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Coupon Information */}
          {userCoupons.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Gift className="w-5 h-5 mr-2" />
                  Coupon Usage
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {userCoupons.map((coupon) => (
                    <div
                      key={coupon.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center">
                        <Gift className="w-4 h-4 mr-3 text-purple-600" />
                        <div>
                          <p className="font-semibold text-gray-900">
                            {coupon.code}
                          </p>
                          <p className="text-sm text-gray-600">
                            {coupon.plan.name} Plan - Used on{" "}
                            {new Date(coupon.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <Badge className="bg-green-100 text-green-800">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Used
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
