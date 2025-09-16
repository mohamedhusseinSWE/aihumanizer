export type Plan = {
  id: number;
  name: string;
  description: string;
  features: string;
  price: number;
  priceId: string;
  interval: "monthly" | "yearly";
  wordLimitPerRequest: number;
  wordsPerMonth: number; // 0 = unlimited
  status: "ACTIVE" | "HIDDEN" | "DISABLED";
  isPopular: boolean;
  models: string[]; // e.g., ["ChatGPT", "Claude", "StealthGPT"]
};
