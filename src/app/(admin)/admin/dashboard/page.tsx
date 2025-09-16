"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Users, CreditCard, Target, FileText, Calendar } from "lucide-react";

interface User {
  id: string;
  email: string;
  name: string | null;
  planName: string | null;
  subscriptionStatus: string | null;
  createdAt: string;
}

interface Plan {
  id: number;
  name: string;
  price: number;
  interval: string;
  status: string;
  createdAt: string;
}

interface Subscription {
  id: number;
  userId: string;
  userEmail: string;
  planName: string;
  status: string;
  startDate: string;
  endDate: string | null;
}

interface Campaign {
  id: number;
  name: string;

  couponCount: number;
  usedCoupons: number;
  createdAt: string;
}

interface HumanizationJob {
  id: number;
  userId: string;
  userEmail: string;
  inputText: string;
  status: string;
  createdAt: string;
}

const AdminDashboard = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [humanizationJobs, setHumanizationJobs] = useState<HumanizationJob[]>(
    [],
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch all data in parallel
      const [usersRes, plansRes, subscriptionsRes, campaignsRes, jobsRes] =
        await Promise.all([
          fetch("/api/admin/users"),
          fetch("/api/admin/plans"),
          fetch("/api/admin/subscriptions"),
          fetch("/api/admin/campaigns"),
          fetch("/api/admin/humanization-jobs"),
        ]);

      if (usersRes.ok) {
        const usersData = await usersRes.json();
        setUsers(usersData.users || []);
      }

      if (plansRes.ok) {
        const plansData = await plansRes.json();
        console.log("Plans API response:", plansData);
        console.log("Plans array:", plansData.plans);
        setPlans(plansData.plans || []);
      } else {
        console.error(
          "Plans API error:",
          plansRes.status,
          await plansRes.text(),
        );
      }

      if (subscriptionsRes.ok) {
        const subscriptionsData = await subscriptionsRes.json();
        setSubscriptions(subscriptionsData.subscriptions || []);
      }

      if (campaignsRes.ok) {
        const campaignsData = await campaignsRes.json();
        setCampaigns(campaignsData.campaigns || []);
      }

      if (jobsRes.ok) {
        const jobsData = await jobsRes.json();
        setHumanizationJobs(jobsData.jobs || []);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusMap: { [key: string]: string } = {
      active: "bg-green-100 text-green-800",
      canceled: "bg-red-100 text-red-800",
      free: "bg-gray-100 text-gray-800",
      completed: "bg-green-100 text-green-800",
      pending: "bg-yellow-100 text-yellow-800",
      processing: "bg-blue-100 text-blue-800",
      failed: "bg-red-100 text-red-800",
      enabled: "bg-green-100 text-green-800",
      disabled: "bg-red-100 text-red-800",
    };

    return (
      <Badge
        className={
          statusMap[status.toLowerCase()] || "bg-gray-100 text-gray-800"
        }
      >
        {status}
      </Badge>
    );
  };

  const truncateText = (text: string, maxLength: number = 50) => {
    return text.length > maxLength
      ? text.substring(0, maxLength) + "..."
      : text;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <Button onClick={fetchDashboardData} variant="outline">
          Refresh Data
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Subscriptions
            </CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {subscriptions.filter((s) => s.status === "active").length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Campaigns
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{campaigns.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AI Jobs</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{humanizationJobs.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Users Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Recent Users
            </CardTitle>
            <CardDescription>Latest registered users</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Joined</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.slice(0, 5).map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.email}</TableCell>
                    <TableCell>{user.planName || "Free"}</TableCell>
                    <TableCell>
                      {getStatusBadge(user.subscriptionStatus || "free")}
                    </TableCell>
                    <TableCell>
                      {new Date(user.createdAt).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="mt-4">
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => (window.location.href = "/admin/users")}
              >
                View All Users
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Plans Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Plans ({plans.length})
            </CardTitle>
            <CardDescription>Available subscription plans</CardDescription>
          </CardHeader>
          <CardContent>
            {plans.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No plans available
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Interval</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {plans.map((plan) => (
                    <TableRow key={plan.id}>
                      <TableCell className="font-medium">{plan.name}</TableCell>
                      <TableCell className="font-medium text-green-600">
                        ${plan.price.toFixed(2)}
                      </TableCell>
                      <TableCell className="capitalize">
                        {plan.interval}
                      </TableCell>
                      <TableCell>{getStatusBadge(plan.status)}</TableCell>
                      <TableCell>
                        {new Date(plan.createdAt).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
            <div className="mt-4">
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => (window.location.href = "/admin/plans/list")}
              >
                View All Plans
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Subscriptions Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Recent Subscriptions
            </CardTitle>
            <CardDescription>Latest subscription activity</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Start Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {subscriptions.slice(0, 5).map((subscription) => (
                  <TableRow key={subscription.id}>
                    <TableCell className="font-medium">
                      {subscription.userEmail}
                    </TableCell>
                    <TableCell>{subscription.planName}</TableCell>
                    <TableCell>{getStatusBadge(subscription.status)}</TableCell>
                    <TableCell>
                      {new Date(subscription.startDate).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="mt-4">
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => (window.location.href = "/admin/subscriptions")}
              >
                View All Subscriptions
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Campaigns Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Campaigns
            </CardTitle>
            <CardDescription>Marketing campaigns and coupons</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>

                  <TableHead>Coupons</TableHead>
                  <TableHead>Used</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {campaigns.map((campaign) => (
                  <TableRow key={campaign.id}>
                    <TableCell className="font-medium">
                      {campaign.name}
                    </TableCell>

                    <TableCell>{campaign.couponCount}</TableCell>
                    <TableCell>{campaign.usedCoupons}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Humanization Jobs Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Recent AI Humanization Jobs
          </CardTitle>
          <CardDescription>Latest text humanization requests</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Input Text</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {humanizationJobs.slice(0, 10).map((job) => (
                <TableRow key={job.id}>
                  <TableCell className="font-medium">{job.userEmail}</TableCell>
                  <TableCell>{truncateText(job.inputText, 30)}</TableCell>
                  <TableCell>{getStatusBadge(job.status)}</TableCell>
                  <TableCell>
                    {new Date(job.createdAt).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
