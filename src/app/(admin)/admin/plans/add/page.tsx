"use client";

import { useState, useCallback } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useAdminAuth } from "@/app/context/AdminAuthContext";
import {
  Loader2,
  ArrowLeft,
  DollarSign,
  Calendar,
  Zap,
  Star,
  FileText,
  Tag,
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Checkbox } from "@/components/ui/checkbox";

type IntervalType = "monthly" | "yearly";
type PlanStatus = "ACTIVE" | "HIDDEN" | "DISABLED";

interface PlanFormData {
  name: string;
  description: string;
  features: string;
  price: number;
  interval: IntervalType;
  wordLimitPerRequest: number;
  wordsPerMonth: number;
  status: PlanStatus;
  isPopular: boolean;
  models: string[];
}

export default function AddPlanPage() {
  const { addPlan } = useAdminAuth();
  const router = useRouter();

  const [form, setForm] = useState<PlanFormData>({
    name: "",
    description: "",
    features: "",
    price: 0,
    interval: "monthly",
    wordLimitPerRequest: 0,
    wordsPerMonth: 0,
    status: "ACTIVE",
    isPopular: false,
    models: [],
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: ["price", "wordLimitPerRequest", "wordsPerMonth"].includes(name)
        ? +value
        : value,
    }));
  };

  const handleSubmit = useCallback(async () => {
    if (!addPlan) return;
    setLoading(true);
    try {
      await addPlan({ ...form, priceId: "" });
      toast.success("Plan Created Successfully");
      setForm({
        name: "",
        description: "",
        features: "",
        price: 0,
        interval: "monthly",
        wordLimitPerRequest: 0,
        wordsPerMonth: 0,
        status: "ACTIVE",
        isPopular: false,
        models: [],
      });
      router.push("/admin/plans/list");
    } catch (err) {
      toast.error("Failed to create plan");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [addPlan, form, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link href={"/admin/plans/list"}>
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4" /> Back to Plans
            </Button>
          </Link>
          <div className="text-right">
            <h1 className="text-3xl font-bold text-slate-800">
              Create New Plan
            </h1>
            <p className="text-slate-600 mt-1">
              Design your perfect subscription offering
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-8">
                <CardTitle className="text-2xl flex items-center gap-3 text-slate-800">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <FileText className="h-6 w-6 text-blue-600" />
                  </div>
                  Plan Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Plan Name */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2 text-slate-700 font-semibold">
                    <Tag className="h-4 w-4" /> Plan Name
                  </Label>
                  <Input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="e.g., Professional Plan"
                    className="h-12 text-lg border-2"
                  />
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2 text-slate-700 font-semibold">
                    <FileText className="h-4 w-4" /> Description
                  </Label>
                  <Textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Describe what makes this plan special..."
                    className="min-h-[100px] text-base border-2 resize-none"
                  />
                </div>

                {/* Features */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2 text-slate-700 font-semibold">
                    <Zap className="h-4 w-4" /> Features
                  </Label>
                  <Textarea
                    name="features"
                    value={form.features}
                    onChange={handleChange}
                    placeholder="Enter features separated by commas or new lines"
                    className="min-h-[150px] text-base border-2 resize-y"
                  />
                  <p className="text-xs text-slate-500">
                    Use commas or new lines to separate each feature
                  </p>
                </div>

                {/* Price, Interval, Word Limits */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label className="flex items-center gap-2 text-slate-700 font-semibold">
                      <DollarSign className="h-4 w-4" /> Price ($)
                    </Label>
                    <Input
                      type="number"
                      name="price"
                      value={form.price}
                      onChange={handleChange}
                      className="h-12 text-lg border-2"
                    />
                  </div>

                  <div>
                    <Label className="flex items-center gap-2 text-slate-700 font-semibold">
                      <Calendar className="h-4 w-4" /> Billing Interval
                    </Label>
                    <select
                      name="interval"
                      value={form.interval}
                      onChange={handleChange}
                      className="h-12 w-full text-lg border-2 rounded-md px-3 bg-white"
                    >
                      <option value="monthly">Monthly</option>
                      <option value="yearly">Yearly</option>
                    </select>
                  </div>

                  <div>
                    <Label className="flex items-center gap-2 text-slate-700 font-semibold">
                      <Zap className="h-4 w-4" /> Word Limit per Request
                    </Label>
                    <Input
                      type="number"
                      name="wordLimitPerRequest"
                      value={form.wordLimitPerRequest}
                      onChange={handleChange}
                      className="h-12 text-lg border-2"
                    />
                  </div>
                </div>

                {/* Words per Month */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2 text-slate-700 font-semibold">
                    <Zap className="h-4 w-4" /> Words per Month (0 = unlimited)
                  </Label>
                  <Input
                    type="number"
                    name="wordsPerMonth"
                    value={form.wordsPerMonth}
                    onChange={handleChange}
                    className="h-12 text-lg border-2"
                  />
                </div>

                {/* Status */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2 text-slate-700 font-semibold">
                    <Zap className="h-4 w-4" /> Plan Status
                  </Label>
                  <select
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                    className="h-12 w-full text-lg border-2 rounded-md px-3 bg-white"
                  >
                    <option value="ACTIVE">Active</option>
                    <option value="HIDDEN">Hidden</option>
                    <option value="DISABLED">Disabled</option>
                  </select>
                </div>

                {/* Models */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2 text-slate-700 font-semibold">
                    <Zap className="h-4 w-4" /> Supported Models
                  </Label>
                  <div className="flex flex-wrap gap-4">
                    {["ChatGPT", "Claude", "StealthGPT"].map((model) => (
                      <div key={model} className="flex items-center gap-2">
                        <Checkbox
                          checked={form.models.includes(model)}
                          onCheckedChange={(checked: unknown) =>
                            setForm((prev) => {
                              const newModels = checked
                                ? [...prev.models, model]
                                : prev.models.filter((m) => m !== model);
                              return { ...prev, models: newModels };
                            })
                          }
                        />
                        <Label>{model}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Popular */}
                <div className="flex items-center space-x-4 p-4 bg-yellow-50 border border-yellow-300 rounded-lg">
                  <Checkbox
                    checked={form.isPopular}
                    onCheckedChange={(checked: unknown) =>
                      setForm((prev) => ({ ...prev, isPopular: !!checked }))
                    }
                  />
                  <div className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-yellow-600" />
                    <Label className="text-base font-semibold text-yellow-800">
                      Mark as Popular Plan
                    </Label>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Preview Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-6 space-y-6">
              <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-xl text-slate-800">
                    Live Preview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="relative">
                    {form.isPopular && (
                      <div className="absolute -top-3 -right-3 bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full rotate-12">
                        POPULAR
                      </div>
                    )}
                    <div className="border-2 border-dashed rounded-lg p-6 space-y-4">
                      <h3 className="text-xl font-bold text-slate-800">
                        {form.name || "Plan Name"}
                      </h3>
                      <p className="text-slate-600 text-sm">
                        {form.description || "Plan description"}
                      </p>
                      <div className="text-3xl font-bold text-blue-600">
                        ${form.price}
                        <span className="text-sm text-slate-500">
                          {" "}
                          /{form.interval}
                        </span>
                      </div>
                      <div className="text-sm text-slate-600">
                        Word limit per request: {form.wordLimitPerRequest}
                      </div>
                      <div className="text-sm text-slate-600">
                        Words per month:{" "}
                        {form.wordsPerMonth === 0
                          ? "Unlimited"
                          : form.wordsPerMonth}
                      </div>
                      {form.features && (
                        <div className="text-sm text-slate-600">
                          <div className="font-semibold mb-2">Features:</div>
                          <div className="whitespace-pre-wrap bg-slate-50 p-2 rounded text-xs">
                            {form.features}
                          </div>
                        </div>
                      )}
                      {form.models.length > 0 && (
                        <div className="text-sm text-slate-600">
                          <div className="font-semibold mb-1">Models:</div>
                          <div className="flex flex-wrap gap-2 text-xs">
                            {form.models.map((m) => (
                              <span
                                key={m}
                                className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full"
                              >
                                {m}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      <div className="text-sm text-slate-600">
                        Status:{" "}
                        <span className="font-semibold">{form.status}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-xl border-0 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                <CardContent className="p-6">
                  <Button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="w-full h-14 text-lg font-semibold bg-white text-blue-600 hover:bg-slate-50 transition"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="animate-spin h-5 w-5 mr-2" />
                        Creating Plan...
                      </>
                    ) : (
                      <>
                        <Zap className="h-5 w-5 mr-2" /> Create Plan
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
