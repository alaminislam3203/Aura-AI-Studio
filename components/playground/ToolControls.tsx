"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { STUDIO_TOOLS, type StudioTool } from "@/lib/tools-config";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  CrownIcon,
  KeyRoundIcon,
  LayersIcon,
  Loader2Icon,
  ScissorsIcon,
  SparklesIcon,
  Wand2Icon,
  ZapIcon,
} from "lucide-react";

interface ToolControlsProps {
  selectedToolId: string;
  onSelectTool: (tool: StudioTool) => void;
  prompt: string;
  onPromptChange: (prompt: string) => void;
  watermarkText: string;
  onWatermarkTextChange: (text: string) => void;
  watermarkFontSize: number;
  onWatermarkFontSizeChange: (size: number) => void;
  watermarkColor: string;
  onWatermarkColorChange: (color: string) => void;
  watermarkPosition?:
    | "bottom-right"
    | "bottom-left"
    | "top-right"
    | "top-left"
    | "center";
  onWatermarkPositionChange?: (
    pos: "bottom-right" | "bottom-left" | "top-right" | "top-left" | "center",
  ) => void;
  watermarkBadge?: boolean;
  onWatermarkBadgeChange?: (badge: boolean) => void;
  onApplyTransform: () => void;
  isProcessing: boolean;
  canApply: boolean;
  isPro?: boolean;
  usageData: {
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
  } | null;
  onOpenUpgradeModal: () => void;
  onOpenConfigModal?: () => void;
  hasCustomConfig?: boolean;
}

const PROMPT_CHIP_LABELS: Record<string, string> = {
  "luxury minimalist photography studio with soft shadows": "Studio Minimal",
  "tropical beach with palm trees at golden hour sunset": "Sunset Beach",
  "cyberpunk neon Tokyo alley with reflective wet ground": "Cyberpunk Alley",
  "modern high-end living room with Scandinavian interior": "Modern Interior",
  "clean aesthetic pastel aesthetic backdrop": "Pastel Backdrop",
  "extend background with soft studio bokeh lighting": "Studio Bokeh",
  "fill with subtle clean architectural concrete textures": "Concrete Wall",
  "surround with atmospheric fog and warm ambient light": "Warm Ambient Fog",
};

const WATERMARK_COLORS = [
  { label: "White", value: "#FFFFFF" },
  { label: "Gold", value: "#FFB800" },
  { label: "Cyan", value: "#00F5D4" },
  { label: "Black", value: "#000000" },
  { label: "Crimson", value: "#FF0055" },
];

const WATERMARK_POSITIONS = [
  { id: "bottom-right", label: "Bottom Right" },
  { id: "bottom-left", label: "Bottom Left" },
  { id: "top-right", label: "Top Right" },
  { id: "top-left", label: "Top Left" },
  { id: "center", label: "Center" },
] as const;

export function ToolControls({
  selectedToolId,
  onSelectTool,
  prompt,
  onPromptChange,
  watermarkText,
  onWatermarkTextChange,
  watermarkFontSize,
  onWatermarkFontSizeChange,
  watermarkColor,
  onWatermarkColorChange,
  watermarkPosition = "bottom-right",
  onWatermarkPositionChange,
  watermarkBadge = true,
  onWatermarkBadgeChange,
  onApplyTransform,
  isProcessing,
  canApply,
  isPro: isProProp,
  usageData,
  onOpenUpgradeModal,
  onOpenConfigModal,
  hasCustomConfig,
}: ToolControlsProps) {
  const selectedTool =
    STUDIO_TOOLS.find((t) => t.id === selectedToolId) || STUDIO_TOOLS[0];
  const isPro = Boolean(isProProp || usageData?.plan === "PRO");

  // =========================================================================
  // CONCEPT 1: CATEGORY TABS SYSTEM (ACTIVE)
  // =========================================================================
  const enhanceCount = STUDIO_TOOLS.filter(
    (t) => t.category === "enhance",
  ).length;
  const overlayCount = STUDIO_TOOLS.filter(
    (t) => t.category === "overlay",
  ).length;
  const backgroundCount = STUDIO_TOOLS.filter(
    (t) => t.category === "background",
  ).length;

  const CATEGORIES = [
    {
      id: "background",
      label: "Background",
      count: backgroundCount,
      icon: ScissorsIcon,
    },
    {
      id: "enhance",
      label: "Enhance",
      count: enhanceCount,
      icon: SparklesIcon,
    },
    { id: "overlay", label: "Effects", count: overlayCount, icon: LayersIcon },
  ] as const;

  type CategoryId = "background" | "enhance" | "overlay";

  const [activeCategory, setActiveCategory] = useState<CategoryId>(
    (selectedTool.category as CategoryId) || "background",
  );

  // Sync category if tool is selected externally
  React.useEffect(() => {
    if (selectedTool?.category && selectedTool.category !== activeCategory) {
      setActiveCategory(selectedTool.category as CategoryId);
    }
  }, [selectedToolId, selectedTool?.category, activeCategory]);

  const handleCategoryClick = (catId: "background" | "enhance" | "overlay") => {
    setActiveCategory(catId);
    const toolsInCat = STUDIO_TOOLS.filter((t) => t.category === catId);
    if (
      !toolsInCat.some((t) => t.id === selectedToolId) &&
      toolsInCat.length > 0
    ) {
      onSelectTool(toolsInCat[0]);
    }
  };

  const filteredTools = STUDIO_TOOLS.filter(
    (t) => t.category === activeCategory,
  );

  /* =========================================================================
   * PREVIOUS VERSION BACKUP: 6-TOOL DEFAULT WITH "VIEW ALL" TOGGLE
   * (Preserved for comparison as requested)
   * -------------------------------------------------------------------------
   * const DEFAULT_VISIBLE_COUNT = 6;
   * const [showAllTools, setShowAllTools] = useState(false);
   * const isSelectedInHidden = STUDIO_TOOLS.slice(DEFAULT_VISIBLE_COUNT).some((t) => t.id === selectedToolId);
   * const isExpanded = showAllTools || isSelectedInHidden;
   * const displayedTools = isExpanded ? STUDIO_TOOLS : STUDIO_TOOLS.slice(0, DEFAULT_VISIBLE_COUNT);
   * =========================================================================
   */

  return (
    <div className="studio-panel flex flex-col gap-4 sm:gap-5 rounded-[2rem] border border-border/60 p-4 sm:p-5">
      <div className="flex flex-col gap-3 rounded-2xl border border-border/50 bg-background/35 p-3.5 sm:p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex size-9 sm:size-10 items-center justify-center rounded-xl border border-primary/30 bg-primary/10 text-primary">
            {isPro ? (
              <CrownIcon className="size-5" />
            ) : (
              <ZapIcon className="size-5" />
            )}
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">
              {isPro
                ? usageData?.isHourlyCapped
                  ? "Hourly Limit Reached"
                  : "Aura Pro Active"
                : `${usageData?.remaining ?? 3} Free Credits Left`}
            </p>
            <p className="text-xs text-muted-foreground">
              {isPro
                ? usageData?.isHourlyCapped
                  ? `${usageData?.hourlyLimit ?? 8}/${usageData?.hourlyLimit ?? 8} hourly edits used. Unlocks in ${usageData?.resetInMinutes || 1}m`
                  : `${usageData?.hourlyRemaining ?? 8} of ${usageData?.hourlyLimit ?? 8} hourly edits available`
                : `${usageData?.usageCount ?? 0} of ${usageData?.usageLimit ?? 3} free edits used`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onOpenConfigModal && (
            <button
              type="button"
              onClick={onOpenConfigModal}
              className="flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-2.5 py-1 text-[11px] font-semibold text-muted-foreground hover:border-primary/40 hover:text-foreground hover:bg-white/10 transition-all cursor-pointer"
              title="Configure custom ImageKit API credentials"
            >
              <KeyRoundIcon className="size-3 text-primary" />
              <span>
                {hasCustomConfig ? "Custom Keys Active" : "BYOK API Keys"}
              </span>
            </button>
          )}

          {!isPro && (
            <Button
              size="sm"
              onClick={onOpenUpgradeModal}
              className="studio-primary-action h-8 rounded-full px-4 text-xs font-semibold cursor-pointer"
            >
              Upgrade to Pro
            </Button>
          )}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            1. Choose AI Tool
          </label>
          <span className="rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 text-[10px] font-bold text-primary">
            {filteredTools.length}{" "}
            {activeCategory === "background"
              ? "Background"
              : activeCategory === "enhance"
                ? "Enhance"
                : "Effect"}{" "}
            Tools
          </span>
        </div>

        {/* Responsive Category Pills Bar with Motion Sliding Pill */}
        <div className="mt-2.5 grid grid-cols-3 gap-1 rounded-2xl border border-white/12 bg-black/40 p-1.5 backdrop-blur-xl shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]">
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.id;
            const CatIcon = cat.icon;

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => handleCategoryClick(cat.id)}
                className="group relative flex w-full items-center justify-center py-2 px-1 sm:px-2 rounded-xl text-center cursor-pointer select-none"
              >
                {isActive && (
                  <motion.div
                    layoutId="activeCategoryIndicator"
                    className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary via-orange-500 to-amber-500 shadow-[0_2px_16px_rgba(255,90,20,0.45),inset_0_1px_0_0_rgba(255,255,255,0.3)] border border-primary/50"
                    transition={{ type: "spring", stiffness: 450, damping: 32 }}
                  />
                )}
                <span
                  className={cn(
                    "relative z-10 flex items-center justify-center gap-1 sm:gap-1.5 min-w-0 transition-colors duration-200",
                    isActive
                      ? "text-white font-bold"
                      : "text-muted-foreground/80 group-hover:text-foreground",
                  )}
                >
                  <CatIcon className="size-3 sm:size-3.5 shrink-0" />
                  <span className="truncate text-[11px] sm:text-xs">
                    {cat.label}
                  </span>
                  <span
                    className={cn(
                      "rounded-full px-1.5 py-0.2 text-[9px] sm:text-[10px] font-bold shrink-0 transition-colors",
                      isActive
                        ? "bg-black/30 text-white"
                        : "bg-white/10 text-muted-foreground group-hover:text-foreground",
                    )}
                  >
                    {cat.count}
                  </span>
                </span>
              </button>
            );
          })}
        </div>

        {/* Filtered Category Tools Grid with Staggered Motion & Transitions */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="mt-3 grid grid-cols-2 gap-2.5 sm:gap-3"
          >
            {filteredTools.map((tool, idx) => {
              const Icon = tool.icon;
              const isSelected = tool.id === selectedToolId;

              return (
                <motion.button
                  key={tool.id}
                  type="button"
                  onClick={() => onSelectTool(tool)}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.18, delay: idx * 0.035 }}
                  className={cn(
                    "group relative flex flex-col items-start gap-2 sm:gap-2.5 rounded-2xl p-3 sm:p-4 text-left transition-all duration-300 cursor-pointer backdrop-blur-xl",
                    isSelected
                      ? "border-2 border-primary bg-gradient-to-b from-primary/20 via-primary/10 to-primary/5 text-foreground shadow-[0_0_24px_rgba(255,100,20,0.25),inset_0_1px_1px_rgba(255,255,255,0.25)] scale-[1.01] ring-1 ring-primary/50"
                      : "border border-white/15 bg-white/[0.04] text-muted-foreground shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08),0_4px_16px_rgba(0,0,0,0.25)] hover:border-primary/60 hover:bg-white/[0.08] hover:text-foreground hover:shadow-[0_6px_26px_rgba(255,140,0,0.2),inset_0_1px_0_0_rgba(255,255,255,0.18)] hover:-translate-y-0.5 active:translate-y-0",
                  )}
                >
                  {tool.badge && (
                    <span
                      className={cn(
                        "absolute right-2.5 top-2.5 rounded-md border px-1.5 py-0.5 text-[9px] sm:text-[10px] font-semibold transition-colors",
                        isSelected
                          ? "bg-primary/25 border-primary/50 text-primary shadow-sm"
                          : "bg-white/10 border-white/15 text-muted-foreground group-hover:border-primary/40 group-hover:text-primary group-hover:bg-primary/15",
                      )}
                    >
                      {tool.badge}
                    </span>
                  )}

                  <div
                    className={cn(
                      "flex size-8 sm:size-9 items-center justify-center rounded-xl border transition-all duration-300",
                      isSelected
                        ? "border-primary/70 bg-primary/25 text-primary shadow-[0_0_16px_rgba(255,140,0,0.35)] scale-105"
                        : "border-white/15 bg-white/5 text-foreground/75 group-hover:border-primary/50 group-hover:bg-primary/15 group-hover:text-primary group-hover:scale-105 group-hover:shadow-[0_0_14px_rgba(255,140,0,0.25)]",
                    )}
                  >
                    <Icon className="size-4 sm:size-4.5" />
                  </div>

                  <div>
                    <div className="flex items-center gap-1.5">
                      <p
                        className={cn(
                          "text-xs sm:text-sm font-semibold tracking-tight transition-colors",
                          isSelected
                            ? "text-white font-bold"
                            : "text-foreground group-hover:text-white",
                        )}
                      >
                        {tool.name}
                      </p>
                      {isSelected && (
                        <span className="size-1.5 rounded-full bg-primary animate-pulse" />
                      )}
                    </div>
                    <p className="mt-1 line-clamp-2 text-[11px] sm:text-xs text-muted-foreground/80 leading-relaxed group-hover:text-muted-foreground">
                      {tool.description}
                    </p>
                  </div>
                </motion.button>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Options Inspector */}
      <AnimatePresence>
        {selectedTool.requiresPrompt && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="rounded-2xl border border-white/15 bg-white/[0.035] p-3.5 sm:p-4 backdrop-blur-xl shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08),0_4px_24px_rgba(0,0,0,0.25)] transition-all">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex size-7 items-center justify-center rounded-lg border border-primary/40 bg-primary/15 text-primary shadow-[0_0_10px_rgba(255,140,0,0.2)]">
                    <Wand2Icon className="size-3.5" />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider text-foreground">
                    AI Scene Prompt
                  </span>
                </div>
                {prompt && (
                  <button
                    type="button"
                    onClick={() => onPromptChange("")}
                    className="rounded-full bg-white/10 px-2.5 py-0.5 text-[10px] font-medium text-muted-foreground hover:bg-white/20 hover:text-foreground transition-all cursor-pointer"
                  >
                    Clear
                  </button>
                )}
              </div>

              <div className="relative mt-2.5">
                <textarea
                  rows={2}
                  value={prompt}
                  onChange={(e) => onPromptChange(e.target.value)}
                  placeholder={
                    selectedTool.promptPlaceholder ||
                    "Describe your custom background scene..."
                  }
                  className="w-full resize-none rounded-xl border border-white/15 bg-black/40 p-2.5 sm:p-3 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-primary/80 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all backdrop-blur-md shadow-inner leading-relaxed"
                />
              </div>

              {selectedTool.quickPrompts && (
                <div className="mt-2.5">
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <SparklesIcon className="size-3 text-primary" />
                    <span className="text-[11px] font-medium text-muted-foreground">
                      Quick Inspiration Presets:
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedTool.quickPrompts.map((quick) => {
                      const label = PROMPT_CHIP_LABELS[quick] || quick;
                      const isSelected = prompt === quick;

                      return (
                        <button
                          key={quick}
                          type="button"
                          onClick={() => onPromptChange(quick)}
                          className={cn(
                            "inline-flex items-center gap-1 rounded-lg border px-2 py-1 text-[11px] font-medium transition-all duration-200 cursor-pointer",
                            isSelected
                              ? "border-primary/80 bg-primary/20 text-primary shadow-[0_0_12px_rgba(255,140,0,0.25)] scale-[1.02]"
                              : "border-white/10 bg-white/5 text-muted-foreground hover:border-primary/40 hover:bg-white/10 hover:text-foreground",
                          )}
                        >
                          {label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedTool.requiresTextWatermark && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="rounded-2xl border border-white/15 bg-white/[0.035] p-3.5 sm:p-4 backdrop-blur-xl shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08),0_4px_24px_rgba(0,0,0,0.25)] transition-all space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex size-7 items-center justify-center rounded-lg border border-primary/40 bg-primary/15 text-primary shadow-[0_0_10px_rgba(255,140,0,0.2)]">
                    <SparklesIcon className="size-3.5" />
                  </div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
                    Watermark Controls
                  </h4>
                </div>
                <span className="text-[10px] font-semibold text-primary bg-primary/10 border border-primary/30 px-2 py-0.5 rounded-full">
                  Live Preview
                </span>
              </div>

              <div>
                <input
                  type="text"
                  value={watermarkText}
                  onChange={(e) => onWatermarkTextChange(e.target.value)}
                  placeholder="e.g., Aura Studio • © 2026"
                  className="w-full rounded-xl border border-white/15 bg-black/40 px-3 py-1.5 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-primary/80 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-inner"
                />
              </div>

              {/* Compact 2-column controls: Font Size & Color Palette */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div className="rounded-xl border border-white/10 bg-black/25 p-2">
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span className="font-medium text-muted-foreground">
                      Font Size
                    </span>
                    <span className="tabular-nums font-bold text-primary">
                      {watermarkFontSize}px
                    </span>
                  </div>
                  <input
                    type="range"
                    min="16"
                    max="64"
                    value={watermarkFontSize}
                    onChange={(e) =>
                      onWatermarkFontSizeChange(Number(e.target.value))
                    }
                    className="w-full accent-primary cursor-pointer h-1.5"
                  />
                </div>

                <div className="rounded-xl border border-white/10 bg-black/25 p-2">
                  <span className="text-[11px] font-medium text-muted-foreground block mb-1">
                    Color
                  </span>
                  <div className="flex items-center gap-1.5">
                    {WATERMARK_COLORS.map((color) => (
                      <button
                        key={color.value}
                        type="button"
                        onClick={() => onWatermarkColorChange(color.value)}
                        title={color.label}
                        className={cn(
                          "size-5.5 rounded-full border flex items-center justify-center transition-all cursor-pointer",
                          watermarkColor === color.value
                            ? "border-primary ring-2 ring-primary/40 scale-110 shadow-sm"
                            : "border-white/20 hover:border-white/50",
                        )}
                      >
                        <span
                          className="size-2.5 rounded-full"
                          style={{ backgroundColor: color.value }}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Position Selector (1 clean 5-column row) */}
              <div>
                <span className="text-[11px] font-medium text-muted-foreground block mb-1">
                  Position
                </span>
                <div className="grid grid-cols-5 gap-1">
                  {WATERMARK_POSITIONS.map((pos) => (
                    <button
                      key={pos.id}
                      type="button"
                      onClick={() => onWatermarkPositionChange?.(pos.id)}
                      className={cn(
                        "rounded-lg border py-1 px-0.5 text-[10px] font-semibold transition-all text-center cursor-pointer truncate",
                        watermarkPosition === pos.id
                          ? "border-primary bg-primary/20 text-primary shadow-sm"
                          : "border-white/10 bg-white/5 text-muted-foreground hover:border-white/20 hover:text-foreground",
                      )}
                    >
                      {pos.label.replace("Bottom ", "B-").replace("Top ", "T-")}
                    </button>
                  ))}
                </div>
              </div>

              {/* Glass Badge Background Toggle */}
              <div className="flex items-center justify-between rounded-xl border border-white/10 bg-black/20 px-2.5 py-1.5">
                <div>
                  <p className="text-xs font-semibold text-foreground">
                    Glass Badge Backdrop
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    Dark pill behind text
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onWatermarkBadgeChange?.(!watermarkBadge)}
                  className={cn(
                    "relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none",
                    watermarkBadge
                      ? "bg-primary shadow-[0_0_10px_rgba(255,90,20,0.4)]"
                      : "bg-white/10",
                  )}
                >
                  <span
                    className={cn(
                      "pointer-events-none inline-block size-4 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out",
                      watermarkBadge ? "translate-x-4" : "translate-x-0",
                    )}
                  />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!selectedTool.requiresPrompt && !selectedTool.requiresTextWatermark && (
        <div className="flex items-center gap-3 rounded-2xl border border-white/12 bg-white/[0.025] p-3.5 backdrop-blur-xl shadow-sm">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-xl border border-primary/40 bg-primary/15 text-primary shadow-[0_0_10px_rgba(255,140,0,0.2)]">
            <SparklesIcon className="size-4" />
          </div>
          <div className="text-xs text-muted-foreground leading-relaxed">
            <span className="font-semibold text-foreground">
              One-Click Neural Execution
            </span>
            : High-precision cloud AI will process {selectedTool.name}{" "}
            automatically upon applying.
          </div>
        </div>
      )}

      <Button
        onClick={onApplyTransform}
        disabled={
          !canApply ||
          isProcessing ||
          Boolean(isPro && usageData?.isHourlyCapped)
        }
        className="studio-primary-action h-14 w-full rounded-full text-base font-semibold shadow-lg cursor-pointer disabled:cursor-not-allowed"
      >
        {isProcessing ? (
          <>
            <Loader2Icon className="mr-2 size-5 animate-spin" /> Processing AI
            Transformation...
          </>
        ) : isPro && usageData?.isHourlyCapped ? (
          <>
            <span>
              Hourly Limit Reached (15/15) • Resets in{" "}
              {usageData.resetInMinutes || 1}m
            </span>
          </>
        ) : (
          <>
            <Wand2Icon className="mr-2 size-5" /> Apply {selectedTool.name}
          </>
        )}
      </Button>
    </div>
  );
}
