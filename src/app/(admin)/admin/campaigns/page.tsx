"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface Campaign {
  id: number;
  name: string;
  createdAt: string;
  couponCount: number;
  plan: {
    id: number;
    name: string;
    price: number;
    interval: string;
  } | null;
  usedCoupons: number;
  availableCoupons: number;
}

export default function CampaignsPage() {
  const router = useRouter();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      const res = await fetch("/api/admin/campaigns");
      const data = await res.json();

      if (data.success) {
        setCampaigns(data.campaigns);
      } else {
        toast.error("Failed to load campaigns");
      }
    } catch (error) {
      console.error("Failed to fetch campaigns:", error);
      toast.error("Failed to load campaigns");
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async (campaignId: number, campaignName: string) => {
    try {
      console.log("🔄 Exporting coupons for campaign:", campaignId);

      const res = await fetch(`/api/admin/campaigns/export?id=${campaignId}`);

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to export coupons");
      }

      // Check if response is CSV
      const contentType = res.headers.get("content-type");
      if (contentType && contentType.includes("text/csv")) {
        // Create blob and download
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${campaignName.replace(/\s+/g, "_")}_coupons.csv`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);

        toast.success("Coupons exported successfully!");
      } else {
        // Handle JSON error response
        const errorData = await res.json();
        throw new Error(errorData.message || "Unexpected response format");
      }
    } catch (error: unknown) {
      console.error("Export error:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      toast.error(`Failed to export coupons: ${errorMessage}`);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-center">Loading campaigns...</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Campaigns</h1>
        <Button
          onClick={() => router.push("/admin/campaigns/create")}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Create New Campaign
        </Button>
      </div>

      {campaigns.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg mb-4">No campaigns found</div>
          <Button
            onClick={() => router.push("/admin/campaigns/create")}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Create Your First Campaign
          </Button>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Campaign Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Plan
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Coupons
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Usage
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {campaigns.map((campaign) => (
                  <tr key={campaign.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {campaign.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {campaign.plan ? (
                        <div className="text-sm text-gray-900">
                          <div className="font-medium">
                            {campaign.plan.name}
                          </div>
                          <div className="text-gray-500">
                            ${campaign.plan.price} ({campaign.plan.interval})
                          </div>
                        </div>
                      ) : (
                        <span className="text-gray-400">No plan</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        <div className="font-medium">
                          {campaign.couponCount} total
                        </div>
                        <div className="text-gray-500">
                          {campaign.availableCoupons} available
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{
                              width: `${campaign.couponCount > 0 ? (campaign.usedCoupons / campaign.couponCount) * 100 : 0}%`,
                            }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600">
                          {campaign.usedCoupons}/{campaign.couponCount}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(campaign.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <Button
                          onClick={() =>
                            handleExport(campaign.id, campaign.name)
                          }
                          size="sm"
                          variant="outline"
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Export CSV
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Stats Summary */}
      {campaigns.length > 0 && (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">
              {campaigns.length}
            </div>
            <div className="text-sm text-blue-800">Total Campaigns</div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {campaigns.reduce((sum, c) => sum + c.couponCount, 0)}
            </div>
            <div className="text-sm text-green-800">Total Coupons</div>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600">
              {campaigns.reduce((sum, c) => sum + c.usedCoupons, 0)}
            </div>
            <div className="text-sm text-yellow-800">Used Coupons</div>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">
              {campaigns.reduce((sum, c) => sum + c.availableCoupons, 0)}
            </div>
            <div className="text-sm text-purple-800">Available Coupons</div>
          </div>
        </div>
      )}
    </div>
  );
}
