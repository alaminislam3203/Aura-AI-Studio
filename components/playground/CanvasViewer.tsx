"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "motion/react";
import {
  CheckCircle2Icon,
  DownloadIcon,
  ImageIcon,
  Loader2Icon,
  RefreshCwIcon,
  Share2Icon,
  SparklesIcon,
  SplitIcon,
  UploadCloudIcon,
  Wand2Icon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { saveAs } from "file-saver";

interface CanvasViewerProps {
  originalImage: string | null;
  processedImage: string | null;
  isProcessing: boolean;
  isUploading?: boolean;
  uploadingFileName?: string | null;
  activeToolName?: string;
  onUploadClick: () => void;
  onDropFile?: (file: File) => void;
  onSampleSelect?: (sampleUrl: string) => void;
}

const SAMPLE_IMAGES = [
  {
    name: "Business Portrait",
    url: "https://ik.imagekit.io/oi8yikpgd/luma-studio-uploads/enhance-two_DtWhr0ifhK.png",
  },
];

export function CanvasViewer({
  originalImage,
  processedImage,
  isProcessing,
  isUploading = false,
  uploadingFileName,
  activeToolName,
  onUploadClick,
  onDropFile,
  onSampleSelect,
}: CanvasViewerProps) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isSplitView, setIsSplitView] = useState(true);
  const [copied, setCopied] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [processingStep, setProcessingStep] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  // Dynamic progressive stages during AI image generation
  useEffect(() => {
    if (!isProcessing) {
      setProcessingStep(0);
      return;
    }
    const interval = setInterval(() => {
      setProcessingStep((prev) => (prev < 3 ? prev + 1 : prev));
    }, 2800);
    return () => clearInterval(interval);
  }, [isProcessing]);

  const toolTitle = activeToolName || "AI Transformation";
  const processingStages = [
    { step: "01", title: "Scanning Pixel Grid", desc: "Analyzing subject contours, alpha mask boundaries, and lighting...", progress: 28 },
    { step: "02", title: `Executing ${toolTitle}`, desc: "Running hardware-accelerated neural weights on cloud GPU pipeline...", progress: 58 },
    { step: "03", title: "Synthesizing Micro-Textures", desc: "Reconstructing high-frequency edge details and specular highlights...", progress: 84 },
    { step: "04", title: "Finalizing Lossless 4K Pass", desc: "Color grading and rendering lossless transparent canvas...", progress: 96 },
  ];

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  }, []);

  const handleMouseDown = () => {
    isDragging.current = true;
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging.current) {
      handleMove(e.clientX);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches[0]) {
      handleMove(e.touches[0].clientX);
    }
  };

  const handleDownload = () => {
    const targetUrl = processedImage || originalImage;
    if (!targetUrl) return;
    const filename = `aura-ai-${activeToolName ? activeToolName.toLowerCase().replace(/\s+/g, "-") : "edit"}-${Date.now()}.png`;
    saveAs(targetUrl, filename);
  };

  const handleCopyLink = () => {
    const targetUrl = processedImage || originalImage;
    if (!targetUrl) return;
    navigator.clipboard.writeText(targetUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file && onDropFile) {
      onDropFile(file);
    } else if (file) {
      onUploadClick();
    }
  };

  // =========================================================================
  // 1. EMPTY / UPLOADING STATE
  // =========================================================================
  if (!originalImage) {
    if (isUploading) {
      return (
        <div className="studio-panel relative flex min-h-[520px] sm:min-h-[580px] flex-col items-center justify-center overflow-hidden rounded-[2rem] border border-white/15 bg-white/[0.03] p-6 sm:p-10 text-center backdrop-blur-2xl shadow-[0_24px_64px_rgba(0,0,0,0.35),inset_0_1px_1px_rgba(255,255,255,0.12)]">
          {/* Ambient Glowing Orbs */}
          <div className="pointer-events-none absolute -top-24 -left-24 size-80 rounded-full bg-primary/20 blur-[100px] animate-pulse" />
          <div className="pointer-events-none absolute -bottom-24 -right-24 size-80 rounded-full bg-orange-500/15 blur-[100px]" />

          <div className="relative mx-auto mb-6 flex size-24 items-center justify-center rounded-3xl border border-primary/50 bg-gradient-to-br from-primary/30 via-primary/15 to-transparent text-primary shadow-[0_0_50px_rgba(255,140,0,0.35)]">
            <Loader2Icon className="size-12 animate-spin text-primary" />
            <UploadCloudIcon className="absolute size-6 text-primary animate-pulse" />
          </div>

          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/15 px-4 py-1 text-xs font-semibold text-primary shadow-[0_0_15px_rgba(255,140,0,0.2)]">
            <span className="size-2 rounded-full bg-primary animate-ping" />
            Uploading to Aura Secure Cloud
          </div>

          <h3 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Uploading Your Image...
          </h3>

          {uploadingFileName && (
            <p className="mt-3 inline-flex items-center gap-1.5 max-w-sm truncate rounded-xl border border-white/15 bg-black/40 px-4 py-1.5 text-xs font-medium text-foreground shadow-inner">
              <ImageIcon className="size-3.5 text-primary shrink-0" />
              <span className="truncate">{uploadingFileName}</span>
            </p>
          )}

          <p className="mx-auto mt-2.5 max-w-md text-xs sm:text-sm text-muted-foreground leading-relaxed">
            Synchronizing and preparing high-resolution image for AI tools. Please wait a moment...
          </p>

          <div className="mt-8 w-full max-w-xs overflow-hidden rounded-full bg-white/10 p-0.5 border border-white/10 shadow-inner">
            <div className="h-1.5 w-full rounded-full bg-gradient-to-r from-primary via-orange-400 to-amber-300 animate-pulse" />
          </div>
        </div>
      );
    }

    return (
      <div className="studio-panel relative flex min-h-[520px] sm:min-h-[580px] flex-col justify-between overflow-hidden rounded-[2rem] border border-white/15 bg-white/[0.03] p-4 sm:p-6 backdrop-blur-2xl shadow-[0_24px_64px_rgba(0,0,0,0.35),inset_0_1px_1px_rgba(255,255,255,0.12)]">
        {/* Ambient Glowing Orbs */}
        <div className="pointer-events-none absolute -top-24 -left-24 size-80 rounded-full bg-primary/15 blur-[100px] animate-pulse" />
        <div className="pointer-events-none absolute -bottom-24 -right-24 size-80 rounded-full bg-orange-500/10 blur-[100px]" />

        {/* Top Status Header - Matching the right side Pro bar */}
        <div className="flex items-center justify-between rounded-2xl border border-white/12 bg-black/35 p-3 sm:p-3.5 backdrop-blur-xl shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]">
          <div className="flex items-center gap-2.5">
            <div className="flex size-8 items-center justify-center rounded-xl border border-primary/40 bg-primary/15 text-primary shadow-[0_0_12px_rgba(255,140,0,0.2)]">
              <SparklesIcon className="size-4" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-foreground">
                Neural Canvas Workspace
              </p>
              <p className="text-[11px] text-muted-foreground">High-precision AI image pipeline</p>
            </div>
          </div>

          <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 text-[10px] font-bold text-primary shadow-sm">
            <span className="size-1.5 rounded-full bg-primary animate-pulse" /> Ready
          </span>
        </div>

        {/* Interactive Glassy Dropzone */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={onUploadClick}
          className={cn(
            "group relative my-3 sm:my-4 flex flex-1 flex-col items-center justify-center rounded-2xl border-2 border-dashed p-6 sm:p-8 text-center transition-all duration-300 cursor-pointer overflow-hidden",
            isDragOver
              ? "border-primary bg-primary/15 shadow-[0_0_40px_rgba(255,140,0,0.3),inset_0_1px_1px_rgba(255,255,255,0.25)] scale-[1.01]"
              : "border-white/15 bg-gradient-to-b from-white/[0.04] via-white/[0.015] to-transparent hover:border-primary/60 hover:bg-white/[0.07] hover:shadow-[0_0_35px_rgba(255,140,0,0.18),inset_0_1px_1px_rgba(255,255,255,0.18)]"
          )}
        >
          {/* Glass Icon Orb */}
          <div className="relative mx-auto mb-4 sm:mb-5 flex size-18 sm:size-20 items-center justify-center rounded-3xl border border-primary/40 bg-gradient-to-br from-primary/25 via-primary/15 to-transparent text-primary shadow-[0_0_35px_rgba(255,140,0,0.25)] group-hover:scale-110 group-hover:shadow-[0_0_50px_rgba(255,140,0,0.45)] transition-all duration-300">
            <UploadCloudIcon className="size-8 sm:size-9 animate-pulse" />
          </div>

          <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white group-hover:text-primary transition-colors">
            {isDragOver ? "Drop Image to Upload" : "Upload Your Image"}
          </h3>
          <p className="mx-auto mt-2 max-w-sm text-xs sm:text-sm text-muted-foreground leading-relaxed">
            Drag & drop here or click to browse. Supports JPG, PNG, WEBP up to 25MB with lossless AI processing.
          </p>

          <Button
            type="button"
            className="studio-primary-action mt-5 sm:mt-6 rounded-full px-6 py-2.5 sm:px-7 text-xs sm:text-sm font-semibold shadow-lg shadow-primary/25 group-hover:scale-105 transition-all cursor-pointer"
          >
            <ImageIcon className="mr-2 size-4" /> Select from Device
          </Button>
        </div>

        {/* Bottom Sample Presets Row */}
        {onSampleSelect && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5 rounded-2xl border border-white/10 bg-black/25 px-3.5 py-2.5 backdrop-blur-md">
            <div className="flex items-center gap-1.5">
              <SparklesIcon className="size-3 text-primary" />
              <span className="text-[11px] font-medium text-muted-foreground">
                Want a quick demo? Test with sample image:
              </span>
            </div>
            <div className="flex items-center gap-2">
              {SAMPLE_IMAGES.map((sample) => (
                <button
                  key={sample.name}
                  type="button"
                  onClick={() => onSampleSelect(sample.url)}
                  className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-semibold text-foreground/90 transition-all hover:border-primary/70 hover:bg-primary/15 hover:text-white cursor-pointer shadow-sm"
                >
                  {sample.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // =========================================================================
  // 2. ACTIVE / LOADED IMAGE WORKSPACE
  // =========================================================================
  const activeImage = processedImage || originalImage;

  return (
    <div className="studio-panel relative flex flex-col gap-3 sm:gap-4 rounded-[2rem] border border-white/15 bg-white/[0.03] p-4 sm:p-5 backdrop-blur-2xl shadow-[0_24px_64px_rgba(0,0,0,0.35),inset_0_1px_1px_rgba(255,255,255,0.12)] overflow-hidden">
      {/* Top Toolbar - Glassy Responsive Single Row */}
      <div className="flex items-center justify-between gap-2 rounded-2xl border border-white/12 bg-black/40 px-3 py-2 sm:px-4 sm:py-2.5 backdrop-blur-xl shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]">
        <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
          {processedImage && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsSplitView(!isSplitView)}
              className="rounded-full border-white/15 bg-white/5 h-8 px-2.5 sm:px-3.5 text-xs font-medium text-foreground hover:bg-white/10 hover:border-primary/40 cursor-pointer transition-all shrink-0"
              title="Toggle Split Comparison"
            >
              <SplitIcon className="size-3.5 text-primary sm:mr-1.5" />
              <span className="hidden xs:inline">{isSplitView ? "Split On" : "Result Only"}</span>
            </Button>
          )}

          {activeToolName && (
            <span className="truncate rounded-full border border-primary/40 bg-primary/15 px-3 py-1 text-xs font-semibold text-primary shadow-[0_0_12px_rgba(255,140,0,0.2)]">
              {activeToolName}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopyLink}
            className="rounded-full border-white/15 bg-white/5 h-8 px-2.5 sm:px-3 text-xs text-muted-foreground hover:bg-white/10 hover:text-foreground cursor-pointer transition-all"
            title="Copy Image Link"
          >
            <Share2Icon className="size-3.5 sm:mr-1.5" />
            <span className="hidden sm:inline">{copied ? "Copied!" : "Copy Link"}</span>
          </Button>

          <Button
            size="sm"
            onClick={handleDownload}
            disabled={isProcessing}
            className="studio-primary-action h-8 rounded-full px-3.5 sm:px-4 text-xs font-semibold shadow-md cursor-pointer disabled:cursor-not-allowed"
          >
            <DownloadIcon className="size-3.5 sm:mr-1.5" />
            <span>Download</span>
            <span className="hidden sm:inline ml-0.5">HD</span>
          </Button>
        </div>
      </div>

      {/* Main Canvas Viewport Area */}
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchMove={handleTouchMove}
        className="transparency-checkered relative aspect-[4/3] w-full select-none overflow-hidden rounded-2xl border border-white/15 bg-black/80 shadow-[0_16px_48px_rgba(0,0,0,0.6),inset_0_1px_0_0_rgba(255,255,255,0.08)]"
      >
        {isUploading && (
          <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/80 p-6 backdrop-blur-md">
            <div className="relative flex size-20 items-center justify-center rounded-3xl border border-primary/40 bg-primary/15 text-primary shadow-[0_0_50px_rgba(255,180,0,0.35)]">
              <Loader2Icon className="size-10 animate-spin text-primary" />
              <UploadCloudIcon className="absolute size-5 text-primary/80 animate-pulse" />
            </div>
            <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary">
              <span className="size-2 rounded-full bg-primary animate-ping" />
              Uploading to Cloud CDN
            </div>
            <p className="mt-2 max-w-xs truncate text-base font-bold text-foreground">
              {uploadingFileName || "Uploading Image..."}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Optimizing high-res pixels for AI pipeline...
            </p>
          </div>
        )}

        {isProcessing && (
          <div className="absolute inset-0 z-30 flex flex-col items-center justify-center p-4 backdrop-blur-md overflow-hidden bg-black/75">
            {/* Background Laser Scanning Beam traversing across the image */}
            <motion.div
              initial={{ top: "0%" }}
              animate={{ top: ["0%", "100%", "0%"] }}
              transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
              className="pointer-events-none absolute inset-x-0 z-10 flex flex-col"
            >
              <div className="h-16 w-full bg-gradient-to-b from-transparent via-amber-500/15 to-transparent blur-sm" />
              <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-amber-300 to-transparent shadow-[0_0_15px_#ff9500,0_0_30px_#ff5a14]" />
            </motion.div>

            {/* Neural Holographic HUD Card */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 12 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              className="relative z-20 flex flex-col items-center max-w-sm w-full rounded-3xl border border-primary/40 bg-card/90 p-6 sm:p-7 backdrop-blur-2xl shadow-[0_25px_70px_rgba(0,0,0,0.95),0_0_50px_rgba(255,90,20,0.28)] text-center overflow-hidden"
            >
              {/* Top specular golden line */}
              <div className="absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-amber-400 to-transparent pointer-events-none" />

              {/* Ambient warm corner glow */}
              <div className="pointer-events-none absolute -right-12 -top-12 size-36 rounded-full bg-primary/25 blur-3xl" />

              {/* Multi-Ring Glowing Neural Core */}
              <div className="relative flex size-20 items-center justify-center mb-4">
                {/* Ping wave */}
                <div className="absolute size-20 rounded-full bg-primary/20 animate-ping" />
                {/* Rotating dashed ring */}
                <div className="absolute size-20 rounded-full border border-dashed border-primary/50 animate-[spin_8s_linear_infinite]" />
                {/* Counter-rotating segmented ring */}
                <div className="absolute size-14 rounded-full border-t-2 border-b-2 border-amber-400 animate-[spin_3s_linear_infinite_reverse]" />
                {/* Glowing center orb */}
                <div className="relative flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary via-orange-500 to-amber-500 text-white shadow-[0_0_25px_rgba(255,90,20,0.6)]">
                  <Wand2Icon className="size-6 animate-pulse" />
                </div>
              </div>

              {/* Status Pill Badge */}
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1 text-[11px] font-semibold text-primary backdrop-blur-md">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-500" />
                </span>
                <span className="uppercase tracking-wider">Aura Neural Vision Engine</span>
              </div>

              {/* Dynamic Phase Title & Description */}
              <h4 className="mt-3.5 text-base sm:text-lg font-bold text-white tracking-tight">
                {processingStages[processingStep].title}
              </h4>
              <p className="mt-1 text-xs text-muted-foreground leading-relaxed min-h-[32px] flex items-center justify-center">
                {processingStages[processingStep].desc}
              </p>

              {/* Live Animated Progress Bar */}
              <div className="mt-4 w-full">
                <div className="flex items-center justify-between text-[10px] font-mono text-zinc-400 mb-1.5">
                  <span>STAGE {processingStages[processingStep].step} OF 04</span>
                  <span className="text-amber-300 font-bold">{processingStages[processingStep].progress}%</span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10 p-[1px]">
                  <motion.div
                    animate={{ width: `${processingStages[processingStep].progress}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="h-full rounded-full bg-gradient-to-r from-primary via-orange-500 to-amber-400 shadow-[0_0_12px_#ff5a14]"
                  />
                </div>
              </div>

              {/* Security & Quality Tag */}
              <p className="mt-3 text-[10px] text-zinc-500 font-medium">
                Hardware-accelerated cloud GPU pipeline • 100% Lossless
              </p>
            </motion.div>
          </div>
        )}

        {isSplitView && processedImage ? (
          <div className="relative h-full w-full">
            <div
              className="absolute inset-0 flex items-center justify-center overflow-hidden p-2"
              style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
            >
              <img
                src={originalImage}
                alt="Original source"
                className="max-h-full max-w-full rounded-xl object-contain"
              />
              <span className="absolute bottom-4 left-4 z-10 rounded-md bg-black/70 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm border border-white/10">
                Original
              </span>
            </div>

            <div
              className="absolute inset-0 flex items-center justify-center overflow-hidden p-2"
              style={{ clipPath: `inset(0 0 0 ${sliderPosition}%)` }}
            >
              <img
                src={processedImage}
                alt="AI Processed Result"
                className="max-h-full max-w-full rounded-xl object-contain"
              />
              <span className="absolute bottom-4 right-4 z-10 rounded-md bg-gradient-to-r from-primary to-orange-500 px-2.5 py-1 text-xs font-semibold text-white shadow-md">
                AI Enhanced
              </span>
            </div>

            <div
              onMouseDown={handleMouseDown}
              onTouchStart={handleMouseDown}
              className="absolute bottom-0 top-0 z-20 w-1 cursor-ew-resize bg-gradient-to-b from-primary via-orange-400 to-amber-500 shadow-[0_0_20px_rgba(255,140,0,0.9)]"
              style={{ left: `${sliderPosition}%`, transform: "translateX(-50%)" }}
            >
              <div className="absolute top-1/2 flex size-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-white/60 bg-gradient-to-r from-primary to-orange-500 text-white shadow-xl backdrop-blur-md">
                <SplitIcon className="size-4" />
              </div>
            </div>
          </div>
        ) : (
          <div className="relative flex h-full w-full items-center justify-center p-2">
            <img
              src={activeImage}
              alt="Active preview"
              className="max-h-full max-w-full rounded-xl object-contain"
            />
          </div>
        )}
      </div>

      {/* Canvas Footnote Status Bar */}
      <div className="flex items-center justify-between rounded-xl border border-white/10 bg-black/30 px-3.5 py-2 text-xs text-muted-foreground backdrop-blur-md shadow-inner">
        <span className="flex items-center gap-1.5">
          <CheckCircle2Icon className="size-3.5 text-primary" />
          {processedImage
            ? "Drag center slider horizontally to compare before/after details"
            : "Image loaded and calibrated for neural transformations"}
        </span>
        <button
          type="button"
          onClick={onUploadClick}
          className="flex items-center gap-1.5 font-semibold text-primary hover:text-white transition-colors cursor-pointer"
        >
          <RefreshCwIcon className="size-3" /> Change image
        </button>
      </div>
    </div>
  );
}
