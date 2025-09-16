"use client";

import { useState, useCallback, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface Plan {
  id: number;
  name: string;
  price: number;
  interval: string;
}

export default function CreateCampaignForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [planId, setPlanId] = useState<number | "">("");
  const [count, setCount] = useState(50);
  const [loading, setLoading] = useState(false);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loadingPlans, setLoadingPlans] = useState(true);

  // Fetch plans on component mount
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

  const handleSubmit = useCallback(async () => {
    if (!name || !planId)
      return toast.error("Please enter campaign name and select a plan");

    setLoading(true);
    try {
      const res = await fetch("/api/admin/campaigns/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, couponCount: count, planId }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to create campaign");
      }

      if (data.success) {
        toast.success(
          `Campaign "${name}" created successfully with ${count} coupons!`,
        );

        // Navigate to campaigns page
        router.push("/admin/campaigns");
      }
    } catch (err) {
      toast.error("error createing campaign");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [name, planId, count, router]);

  if (loadingPlans) {
    return (
      <div className="p-6 max-w-2xl mx-auto">
        <div className="text-center">Loading plans...</div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          Create New Campaign
        </h2>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Campaign Name
            </label>
            <Input
              placeholder="e.g., Summer Sale 2024"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Plan
            </label>
            <select
              value={planId}
              onChange={(e) =>
                setPlanId(e.target.value ? parseInt(e.target.value) : "")
              }
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Choose a plan...</option>
              {plans.map((plan) => (
                <option key={plan.id} value={plan.id}>
                  {plan.name} - ${plan.price} ({plan.interval})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Number of Coupons
            </label>
            <Input
              type="number"
              placeholder="50"
              value={count}
              onChange={(e) => setCount(parseInt(e.target.value) || 0)}
              min="1"
              max="10000"
              className="w-full"
            />
            <p className="text-sm text-gray-500 mt-1">
              Enter the number of coupons you want to generate for this campaign
            </p>
          </div>

          <div className="bg-blue-50 p-4 rounded-md">
            <h3 className="font-medium text-blue-900 mb-2">Campaign Preview</h3>
            <div className="text-sm text-blue-800">
              <p>
                <strong>Name:</strong> {name || "Not specified"}
              </p>
              <p>
                <strong>Plan:</strong>{" "}
                {plans.find((p) => p.id === planId)?.name || "Not selected"}
              </p>
              <p>
                <strong>Coupons:</strong> {count} codes will be generated
              </p>
              <p>
                <strong>Format:</strong>{" "}
                {name
                  ? `${name.toUpperCase().replace(/\s+/g, "")}-XXXXXX`
                  : "CAMPAIGN-XXXXXX"}
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <Button
              onClick={handleSubmit}
              disabled={loading || !name || !planId}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              {loading ? "Creating Campaign..." : "Create Campaign"}
            </Button>

            <Button
              onClick={() => router.push("/admin/campaigns")}
              variant="outline"
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
