export type GenerationItem = {
  id: string;
  userId: string;
  originalImageUrl: string;
  originalFileName: string | null;
  resultImageUrl: string;
  toolType: string;
  prompt: string | null;
  createdAt: Date | string;
};

export type UserQuota = {
  usageCount: number;
  usageLimit: number;
  plan: "FREE" | "PRO";
  canUpload: boolean;
  remaining: number;
};
