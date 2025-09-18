export type Plan = {
  id: number;
  name: string;
  description: string;
  features: string;
  price: number;
  priceId: string;
  interval: "monthly" | "yearly" | "lifetime"; // <-- Add "lifetime"
  wordLimitPerRequest: number;
  wordsPerMonth: number; // 0 = unlimited
  status: "ACTIVE" | "HIDDEN" | "DISABLED";
  isPopular: boolean;
  models: string[]; // e.g., ["ChatGPT", "Claude", "StealthGPT"]
};
