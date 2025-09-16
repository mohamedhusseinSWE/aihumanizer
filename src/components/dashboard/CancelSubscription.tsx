"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

import { AlertTriangle, CheckCircle } from "lucide-react";

interface CancelSubscriptionProps {
  userPlan: string | null;
  subscriptionStatus: string | null;
}

export default function CancelSubscription({
  userPlan,
  subscriptionStatus,
}: CancelSubscriptionProps) {
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [cancellationStep, setCancellationStep] = useState<
    "confirm" | "processing" | "success"
  >("confirm");
  const router = useRouter();

  // Only show cancel option for active paid subscriptions
  const canCancel =
    subscriptionStatus === "active" &&
    userPlan &&
    userPlan.toLowerCase() !== "free";

  const handleCancelClick = () => {
    setShowCancelModal(true);
    setCancellationStep("confirm");
  };

  const handleConfirmCancel = async () => {
    setIsCancelling(true);
    setCancellationStep("processing");

    try {
      const response = await fetch("/api/user/cancel-subscription", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (data.success) {
        setCancellationStep("success");

        // Redirect to confirmation page after 2 seconds
        setTimeout(() => {
          router.push("/subscription-cancelled");
        }, 2000);
      } else {
        console.error("Cancellation failed:", data.error);
        alert("Failed to cancel subscription. Please try again.");
        setCancellationStep("confirm");
      }
    } catch (error) {
      console.error("Cancellation error:", error);
      alert("An error occurred. Please try again.");
      setCancellationStep("confirm");
    } finally {
      setIsCancelling(false);
    }
  };

  const handleCloseModal = () => {
    if (!isCancelling) {
      setShowCancelModal(false);
      setCancellationStep("confirm");
    }
  };

  if (!canCancel) {
    return null;
  }

  return (
    <>
      <Button
        variant="destructive"
        size="sm"
        onClick={handleCancelClick}
        className="w-full"
      >
        Cancel Subscription
      </Button>

      {/* Cancel Subscription Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            {cancellationStep === "confirm" && (
              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertTriangle className="w-8 h-8 text-red-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Cancel Subscription
                </h2>
                <p className="text-gray-600 mb-6">
                  Are you sure you want to cancel your subscription? This action
                  cannot be undone.
                </p>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                  <h3 className="font-semibold text-yellow-800 mb-2">
                    What happens when you cancel:
                  </h3>
                  <ul className="text-sm text-yellow-700 space-y-1 text-left">
                    <li>
                      • You&apos;ll lose access to Pro features immediately
                    </li>
                    <li>• You&apos;ll be moved to the free plan</li>
                    <li>• No further charges will be made</li>
                    <li>• You can resubscribe anytime</li>
                  </ul>
                </div>

                <div className="flex space-x-3">
                  <Button
                    variant="outline"
                    onClick={handleCloseModal}
                    className="flex-1"
                    disabled={isCancelling}
                  >
                    Keep Subscription
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={handleConfirmCancel}
                    className="flex-1"
                    disabled={isCancelling}
                  >
                    Yes, Cancel
                  </Button>
                </div>
              </div>
            )}

            {cancellationStep === "processing" && (
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Cancelling Subscription
                </h2>
                <p className="text-gray-600">
                  Please wait while we cancel your subscription...
                </p>
              </div>
            )}

            {cancellationStep === "success" && (
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Subscription Cancelled
                </h2>
                <p className="text-gray-600">
                  Your subscription has been successfully cancelled.
                  Redirecting...
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
