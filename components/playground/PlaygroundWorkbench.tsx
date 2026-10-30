"use client";

import React, { useState, useEffect, useRef } from "react";
import { useSession, signIn } from "next-auth/react";
import { useSearchParams, useRouter } from "next/navigation";
import { upload } from "@imagekit/next";
import { CanvasViewer } from "./CanvasViewer";
import { ToolControls } from "./ToolControls";
import { HistoryGallery, type GenerationItem } from "./HistoryGallery";
import { UpgradeModal } from "@/components/modals/UpgradeModal";
import { ApiConfigModal } from "@/components/modals/ApiConfigModal";
import {
  getCustomImageKitConfig,
  BYOK_CHANGE_EVENT,
} from "@/lib/byok-storage";
import {
  STUDIO_TOOLS,
  type StudioTool,
} from "@/lib/tools-config";
import {
  buildTransformedImageUrl,
  getToolTransformation,
  type TransformToolId,
} from "@/lib/imagekit";
import { CheckCircleIcon, SparklesIcon } from "lucide-react";
import { toast } from "sonner";

export function PlaygroundWorkbench() {
  const { data: session, status, update } = useSession();
  const searchParams = useSearchParams();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [originalFileName, setOriginalFileName] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);

  const [selectedTool, setSelectedTool] = useState<StudioTool>(STUDIO_TOOLS[0]);
  const [prompt, setPrompt] = useState("");
  const [watermarkText, setWatermarkText] = useState("Aura AI Studio");
  const [watermarkFontSize, setWatermarkFontSize] = useState(22);
  const [watermarkColor, setWatermarkColor] = useState("#FFFFFF");
  const [watermarkPosition, setWatermarkPosition] = useState<
    "bottom-right" | "bottom-left" | "top-right" | "top-left" | "center"
  >("bottom-right");
  const [watermarkBadge, setWatermarkBadge] = useState(true);

  const [isProcessing, setIsProcessing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadingFileName, setUploadingFileName] = useState<string | null>(null);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [hasCustomConfig, setHasCustomConfig] = useState(false);
  const [upgradeSuccessBanner, setUpgradeSuccessBanner] = useState(false);

  useEffect(() => {
    const checkConfig = () => {
      setHasCustomConfig(Boolean(getCustomImageKitConfig()));
    };
    checkConfig();
    window.addEventListener(BYOK_CHANGE_EVENT, checkConfig);
    return () => window.removeEventListener(BYOK_CHANGE_EVENT, checkConfig);
  }, []);

  const [usageData, setUsageData] = useState<{
    usageCount: number;
    usageLimit: number;
    plan: string;
    canUpload: boolean;
    remaining: number;
    hourlyCount?: number;
    hourlyLimit?: number;
    hourlyRemaining?: number;
    isHourlyCapped?: boolean;
    resetInMinutes?: number;
  } | null>(null);

  const [history, setHistory] = useState<GenerationItem[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);

  const isPro =
    usageData?.plan === "PRO" ||
    (session?.user as any)?.plan === "PRO";

  const fetchUsageAndHistory = async () => {
    try {
      const [usageRes, historyRes] = await Promise.all([
        fetch("/api/usage", { cache: "no-store" }),
        fetch("/api/generations", { cache: "no-store" }),
      ]);

      if (usageRes.ok) {
        const uData = await usageRes.json();
        setUsageData(uData);
      }

      if (historyRes.ok) {
        const hData = await historyRes.json();
        setHistory(hData.generations || []);
      }
    } catch (err) {
      console.error("Failed to load initial studio data:", err);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  useEffect(() => {
    const sessionId = searchParams.get("session_id");
    const isUpgraded = searchParams.get("upgraded");

    if (sessionId || isUpgraded) {
      const verifySession = async () => {
        try {
          if (sessionId) {
            await fetch(`/api/verify-checkout-session?session_id=${sessionId}`, {
              cache: "no-store",
            });
          }
          if (update) {
            await update();
          }
          await fetchUsageAndHistory();
          setUpgradeSuccessBanner(true);
          router.replace("/playground");
        } catch (err) {
          console.error("Error verifying checkout session:", err);
        }
      };

      verifySession();
    }
  }, [searchParams]);

  useEffect(() => {
    if (status === "authenticated") {
      setIsLoadingHistory(true);
      fetchUsageAndHistory();
    } else if (status === "unauthenticated") {
      setIsLoadingHistory(false);
    }
  }, [status, session?.user]);

  const handleFileUpload = async (file: File) => {
    if (!session?.user) {
      signIn("google");
      return;
    }

    if (!isPro && usageData && !usageData.canUpload) {
      setIsUpgradeModalOpen(true);
      return;
    }

    const localBlobUrl = URL.createObjectURL(file);
    setOriginalImage(localBlobUrl);
    setOriginalFileName(file.name);
    setProcessedImage(null);
    setIsUploading(true);
    setUploadingFileName(file.name);

    try {
      const customConfig = getCustomImageKitConfig();
      const authHeaders: Record<string, string> = {};
      if (customConfig?.publicKey && customConfig?.privateKey) {
        authHeaders["x-custom-public-key"] = customConfig.publicKey;
        authHeaders["x-custom-private-key"] = customConfig.privateKey;
      }

      const authRes = await fetch("/api/upload-auth", {
        cache: "no-store",
        headers: authHeaders,
      });
      if (!authRes.ok) throw new Error("Failed to get upload authorization");
      const authData = await authRes.json();

      const uploadResult = await upload({
        file,
        fileName: file.name,
        folder: "aura-studio-uploads",
        token: authData.token,
        expire: authData.expire,
        signature: authData.signature,
        publicKey: authData.publicKey,
      });

      if (uploadResult?.url) {
        setOriginalImage(uploadResult.url);
        setOriginalFileName(file.name);
        toast.success("Image uploaded successfully!");
      }
    } catch (err) {
      console.error("Image upload failed:", err);
      toast.error("Failed to upload image. Please try again.");
      setOriginalImage(null);
      setOriginalFileName(null);
    } finally {
      setIsUploading(false);
      setUploadingFileName(null);
    }
  };

  const handleApplyTransform = async () => {
    if (!originalImage || isUploading || isProcessing) return;

    if (!session?.user) {
      signIn("google");
      return;
    }

    if (!isPro && usageData && !usageData.canUpload) {
      setIsUpgradeModalOpen(true);
      return;
    }

    if (isPro && usageData?.isHourlyCapped) {
      const waitMin = usageData.resetInMinutes || 1;
      toast.warning(`Hourly limit reached (${usageData.hourlyLimit || 8} edits/hr). Resets in ${waitMin}m.`);
      return;
    }

    try {
      setIsProcessing(true);

      const transformStr = getToolTransformation(selectedTool.id as TransformToolId, {
        prompt,
        watermarkText,
        fontSize: watermarkFontSize,
        fontColor: watermarkColor,
        position: watermarkPosition,
        badgeBackground: watermarkBadge,
      });

      const transformedUrl = buildTransformedImageUrl(originalImage, [transformStr]);

      let isReady = false;
      let attempts = 0;
      const maxAttempts = 30;

      while (!isReady && attempts < maxAttempts) {
        attempts++;
        try {
          const checkRes = await fetch(transformedUrl, {
            method: "HEAD",
            cache: "no-cache",
          });
          if (checkRes.ok) {
            isReady = true;
            break;
          }
          if (checkRes.status === 403 || checkRes.status === 400) {
            let errorDetail = "Image processing service rejected this transformation.";
            try {
              const errBodyRes = await fetch(transformedUrl);
              const errBody = await errBodyRes.text();
              if (errBody) errorDetail = errBody;
            } catch {}
            toast.error(`Transformation rejected (${checkRes.status}): ${errorDetail}`);
            return;
          }
        } catch {
        }
        await new Promise((resolve) => setTimeout(resolve, 2000));
      }

      if (!isReady) {
        toast.error("Transformation timed out. Please try a different tool or prompt.");
        return;
      }

      setProcessedImage(transformedUrl);

      const usageRes = await fetch("/api/usage", { method: "POST" });
      if (usageRes.status === 429) {
        const errJson = await usageRes.json();
        toast.warning(errJson.error || "Hourly limit reached. Please wait before generating again.");
        await fetchUsageAndHistory();
        return;
      }

      await fetch("/api/generations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          originalImageUrl: originalImage,
          originalFileName,
          resultImageUrl: transformedUrl,
          toolType: selectedTool.name,
          prompt: prompt || null,
        }),
      });

      await fetchUsageAndHistory();
      toast.success(`${selectedTool.name} applied successfully!`);
    } catch (err) {
      console.error("AI Transformation error:", err);
      toast.error("Transformation error. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSelectHistory = (origUrl: string, resUrl: string, toolType: string) => {
    setOriginalImage(origUrl);
    setProcessedImage(resUrl);
    const matched = STUDIO_TOOLS.find((t) => t.name === toolType);
    if (matched) setSelectedTool(matched);
  };

  return (
    <div className="w-full">
      {upgradeSuccessBanner && (
        <div className="mb-6 flex items-center justify-between rounded-2xl border border-primary/40 bg-primary/10 p-4 text-foreground shadow-[0_0_30px_rgba(255,180,0,0.15)] backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-xl bg-primary text-black">
              <CheckCircleIcon className="size-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-foreground">
                Welcome to Aura Pro
              </p>
              <p className="text-xs text-muted-foreground">
                Your subscription is active. You have 15 high-speed generations per hour.
              </p>
            </div>
          </div>
          <button
            onClick={() => setUpgradeSuccessBanner(false)}
            className="text-xs font-semibold text-primary hover:underline"
          >
            Dismiss
          </button>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="sr-only"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) handleFileUpload(f);
        }}
      />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] xl:gap-8">
        <CanvasViewer
          originalImage={originalImage}
          processedImage={processedImage}
          isProcessing={isProcessing}
          isUploading={isUploading}
          uploadingFileName={uploadingFileName}
          activeToolName={selectedTool.name}
          onUploadClick={() => fileInputRef.current?.click()}
          onDropFile={handleFileUpload}
          onSampleSelect={(url) => {
            setOriginalImage(url);
            setProcessedImage(null);
          }}
        />

        <ToolControls
          selectedToolId={selectedTool.id}
          onSelectTool={setSelectedTool}
          prompt={prompt}
          onPromptChange={setPrompt}
          watermarkText={watermarkText}
          onWatermarkTextChange={setWatermarkText}
          watermarkFontSize={watermarkFontSize}
          onWatermarkFontSizeChange={setWatermarkFontSize}
          watermarkColor={watermarkColor}
          onWatermarkColorChange={setWatermarkColor}
          watermarkPosition={watermarkPosition}
          onWatermarkPositionChange={setWatermarkPosition}
          watermarkBadge={watermarkBadge}
          onWatermarkBadgeChange={setWatermarkBadge}
          onApplyTransform={handleApplyTransform}
          isProcessing={isProcessing || isUploading}
          canApply={Boolean(originalImage && !isUploading && !isProcessing)}
          isPro={isPro}
          usageData={usageData}
          onOpenUpgradeModal={() => setIsUpgradeModalOpen(true)}
          onOpenConfigModal={() => setIsConfigModalOpen(true)}
          hasCustomConfig={hasCustomConfig}
        />
      </div>

      <HistoryGallery
        history={history}
        isLoading={isLoadingHistory}
        onSelectResult={handleSelectHistory}
      />

      <UpgradeModal
        isOpen={isUpgradeModalOpen}
        onClose={() => setIsUpgradeModalOpen(false)}
      />

      <ApiConfigModal
        isOpen={isConfigModalOpen}
        onClose={() => setIsConfigModalOpen(false)}
      />
    </div>
  );
}
