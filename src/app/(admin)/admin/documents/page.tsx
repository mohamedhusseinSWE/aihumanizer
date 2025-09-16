"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Search,
  Download,
  Clock,
  CheckCircle,
  XCircle,
  RefreshCw,
  Calendar,
  FileText,
  BarChart3,
} from "lucide-react";
import { toast } from "sonner";

interface HumanizationJob {
  id: number;
  userId: string;
  inputText: string;
  outputText: string | null;
  wordCount: number;
  status: "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED";
  createdAt: string;
  completedAt: string | null;
  user: {
    id: string;
    name: string;
    email: string;
    planName: string;
  };
}

interface JobStats {
  totalJobs: number;
  completedJobs: number;
  pendingJobs: number;
  processingJobs: number;
  failedJobs: number;
  totalWordsProcessed: number;
  averageWordsPerJob: number;
}

export default function HumanizeJobsPage() {
  const [jobs, setJobs] = useState<HumanizationJob[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<HumanizationJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [stats, setStats] = useState<JobStats | null>(null);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/humanization-jobs");
      if (!response.ok) throw new Error("Failed to fetch jobs");

      const data = await response.json();
      setJobs(data.jobs || []);
      setFilteredJobs(data.jobs || []);
      setStats(data.stats || null);
    } catch (error) {
      console.error("Error fetching jobs:", error);
      toast.error("Failed to fetch humanization jobs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  useEffect(() => {
    let filtered = jobs;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (job) =>
          job.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.inputText.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (job.outputText &&
            job.outputText.toLowerCase().includes(searchTerm.toLowerCase())),
      );
    }

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter((job) => job.status === statusFilter);
    }

    setFilteredJobs(filtered);
  }, [jobs, searchTerm, statusFilter]);

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      PENDING: { variant: "secondary" as const, icon: Clock, text: "Pending" },
      PROCESSING: {
        variant: "default" as const,
        icon: RefreshCw,
        text: "Processing",
      },
      COMPLETED: {
        variant: "default" as const,
        icon: CheckCircle,
        text: "Completed",
      },
      FAILED: {
        variant: "destructive" as const,
        icon: XCircle,
        text: "Failed",
      },
    };

    const config = statusConfig[status as keyof typeof statusConfig];
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {config.text}
      </Badge>
    );
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

  const truncateText = (text: string, maxLength: number = 100) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  const exportJobs = () => {
    const csvContent = [
      [
        "ID",
        "User",
        "Email",
        "Plan",
        "Status",
        "Word Count",
        "Created At",
        "Completed At",
        "Input Preview",
        "Output Preview",
      ],
      ...filteredJobs.map((job) => [
        job.id.toString(),
        job.user.name,
        job.user.email,
        job.user.planName,
        job.status,
        job.wordCount.toString(),
        formatDate(job.createdAt),
        job.completedAt ? formatDate(job.completedAt) : "N/A",
        truncateText(job.inputText, 50),
        job.outputText ? truncateText(job.outputText, 50) : "N/A",
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `humanize-jobs-${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    toast.success("Jobs exported successfully");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex items-center gap-2">
          <RefreshCw className="h-4 w-4 animate-spin" />
          <span>Loading humanization jobs...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Humanize Jobs</h1>
          <p className="text-muted-foreground">
            Manage and monitor all AI text humanization jobs
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={fetchJobs} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={exportJobs} size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Jobs</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalJobs}</div>
              <p className="text-xs text-muted-foreground">
                All time humanization jobs
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {stats.completedJobs}
              </div>
              <p className="text-xs text-muted-foreground">
                {stats.totalJobs > 0
                  ? Math.round((stats.completedJobs / stats.totalJobs) * 100)
                  : 0}
                % success rate
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Words Processed
              </CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.totalWordsProcessed.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                {stats.averageWordsPerJob.toFixed(0)} avg per job
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
              <Clock className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {stats.pendingJobs + stats.processingJobs}
              </div>
              <p className="text-xs text-muted-foreground">
                {stats.pendingJobs} pending, {stats.processingJobs} processing
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search by user, email, or text content..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="PROCESSING">Processing</SelectItem>
                <SelectItem value="COMPLETED">Completed</SelectItem>
                <SelectItem value="FAILED">Failed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Jobs Table */}
      <Card>
        <CardHeader>
          <CardTitle>Humanization Jobs ({filteredJobs.length})</CardTitle>
          <CardDescription>
            Detailed view of all humanization jobs in the system
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredJobs.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No jobs found</h3>
              <p className="text-muted-foreground">
                {searchTerm || statusFilter !== "all"
                  ? "Try adjusting your filters to see more results."
                  : "No humanization jobs have been created yet."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Plan</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Word Count</TableHead>
                    <TableHead>Input Preview</TableHead>
                    <TableHead>Output Preview</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Completed</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredJobs.map((job) => (
                    <TableRow key={job.id}>
                      <TableCell className="font-medium">#{job.id}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{job?.user?.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {job?.user?.email}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{job?.user?.planName}</Badge>
                      </TableCell>
                      <TableCell>{getStatusBadge(job.status)}</TableCell>
                      <TableCell className="font-medium">
                        {job.wordCount.toLocaleString()}
                      </TableCell>
                      <TableCell className="max-w-[200px]">
                        <div className="truncate" title={job.inputText}>
                          {truncateText(job.inputText, 50)}
                        </div>
                      </TableCell>
                      <TableCell className="max-w-[200px]">
                        {job.outputText ? (
                          <div
                            className="truncate text-green-600"
                            title={job.outputText}
                          >
                            {truncateText(job.outputText, 50)}
                          </div>
                        ) : (
                          <span className="text-muted-foreground">
                            Not available
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm">
                          <Calendar className="h-3 w-3" />
                          {formatDate(job.createdAt)}
                        </div>
                      </TableCell>
                      <TableCell>
                        {job.completedAt ? (
                          <div className="flex items-center gap-1 text-sm">
                            <Calendar className="h-3 w-3" />
                            {formatDate(job.completedAt)}
                          </div>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
