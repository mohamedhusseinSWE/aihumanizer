"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircle, ArrowLeft, RefreshCw } from "lucide-react";

export default function SubscriptionCancelledPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <Card className="text-center">
          <CardHeader>
            <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8 text-red-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              Subscription Cancelled
            </CardTitle>
            <CardDescription className="text-gray-600">
              Your subscription has been successfully cancelled. You can
              continue using the free plan.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">
                What happens next?
              </h3>
              <ul className="text-sm text-gray-600 space-y-1 text-left list-disc pl-5">
                <li>
                  Your Pro plan access will end at the current billing period
                </li>
                <li>You&apos;ll be moved to the free plan</li>
                <li>You can resubscribe anytime</li>
                <li>No further charges will be made</li>
              </ul>
            </div>

            <div className="flex flex-col space-y-2">
              <Button asChild className="w-full">
                <Link href="/dashboard">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Dashboard
                </Link>
              </Button>

              <Button variant="outline" asChild className="w-full">
                <Link href="/pricing">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  View Plans
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
