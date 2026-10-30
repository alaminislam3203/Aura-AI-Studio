"use client";

import React, { useState } from "react";
import { ChevronDownIcon, ChevronUpIcon, DownloadIcon, HistoryIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { saveAs } from "file-saver";

export interface GenerationItem {
  id: string;
  originalImageUrl: string;
  originalFileName?: string | null;
  resultImageUrl: string;
  toolType: string;
  prompt?: string | null;
  createdAt: string | Date;
}

interface HistoryGalleryProps {
  history: GenerationItem[];
  isLoading?: boolean;
  onSelectResult: (originalUrl: string, resultUrl: string, toolType: string) => void;
}

const DEFAULT_LIMIT = 8;

export function HistoryGallery({ history, isLoading = false, onSelectResult }: HistoryGalleryProps) {
  const [showAll, setShowAll] = useState(false);

  if (isLoading) {
    return (
      <div className="mt-8 rounded-[2rem] border border-primary/30 bg-card/40 p-5 shadow-[0_4px_30px_rgba(0,0,0,0.3)] backdrop-blur-xl sm:p-7">
        {/* Header Skeleton */}
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-xl border border-primary/40 bg-primary/15 text-primary shadow-[0_0_15px_rgba(255,140,0,0.25)]">
              <HistoryIcon className="size-4 animate-pulse text-primary" />
            </div>
            <div className="h-6 w-44 rounded-lg bg-white/15 animate-glass-shimmer" />
            <div className="h-5 w-12 rounded-full border border-primary/30 bg-primary/15 animate-pulse" />
          </div>
          <div className="hidden h-4 w-28 rounded-md bg-white/10 animate-glass-shimmer sm:block" />
        </div>

        {/* Glassy Skeleton Grid */}
        <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-8">
          {Array.from({ length: 8 }).map((_, idx) => (
            <div
              key={idx}
              className="relative overflow-hidden rounded-2xl border border-white/15 bg-white/[0.04] p-2 shadow-lg backdrop-blur-md"
            >
              <div className="aspect-square w-full rounded-xl bg-white/[0.08] border border-white/10 animate-glass-shimmer" />
              <div className="mt-2.5 flex items-center justify-between px-1">
                <div className="h-3.5 w-14 rounded-md bg-primary/20 animate-glass-shimmer" />
                <div className="size-4.5 rounded-full bg-white/15 animate-glass-shimmer" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (history.length === 0) {
    return null;
  }

  const displayedItems = showAll ? history : history.slice(0, DEFAULT_LIMIT);
  const hasMore = history.length > DEFAULT_LIMIT;

  const handleDownload = (e: React.MouseEvent, item: GenerationItem) => {
    e.stopPropagation();
    saveAs(item.resultImageUrl, `aura-${item.toolType}-${item.id.slice(0, 6)}.png`);
  };

  return (
    <div className="mt-8 animate-in fade-in duration-300 rounded-[2rem] border border-border/60 bg-card/40 p-5 backdrop-blur-xl sm:p-7 shadow-[0_4px_30px_rgba(0,0,0,0.2)]">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="flex size-9 items-center justify-center rounded-xl border border-primary/40 bg-primary/15 text-primary shadow-[0_0_15px_rgba(255,140,0,0.2)]">
            <HistoryIcon className="size-4" />
          </div>
          <h3 className="text-lg font-bold tracking-tight text-foreground">Recent Generations</h3>
          <span className="rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
            {hasMore && !showAll ? `${DEFAULT_LIMIT} of ${history.length}` : `${history.length}`}
          </span>
        </div>

        {hasMore && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setShowAll((prev) => !prev)}
            className="rounded-full border-white/20 bg-white/10 px-3.5 text-xs font-medium text-foreground hover:bg-white/20 hover:border-primary/40 cursor-pointer transition-all"
          >
            {showAll ? (
              <>
                Show Latest {DEFAULT_LIMIT}
                <ChevronUpIcon className="ml-1 size-3.5" />
              </>
            ) : (
              <>
                View All ({history.length})
                <ChevronDownIcon className="ml-1 size-3.5" />
              </>
            )}
          </Button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-8">
        {displayedItems.map((item) => (
          <div
            key={item.id}
            onClick={() => onSelectResult(item.originalImageUrl, item.resultImageUrl, item.toolType)}
            className="group relative cursor-pointer overflow-hidden rounded-2xl border border-border/60 bg-background/50 transition-all duration-200 hover:border-primary/80 hover:shadow-[0_0_24px_rgba(255,140,0,0.25)] hover:scale-[1.02]"
          >
            <div className="relative aspect-square w-full overflow-hidden bg-black/40">
              <img
                src={item.resultImageUrl}
                alt={item.toolType}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
            </div>

            <div className="p-2.5">
              <div className="flex items-center justify-between">
                <span className="truncate rounded-md bg-primary/15 border border-primary/30 px-1.5 py-0.5 text-[10px] font-semibold text-primary">
                  {item.toolType}
                </span>
                <button
                  type="button"
                  onClick={(e) => handleDownload(e, item)}
                  className="rounded-full p-1 text-muted-foreground hover:bg-white/10 hover:text-foreground cursor-pointer transition-colors"
                  title="Download Image"
                >
                  <DownloadIcon className="size-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
