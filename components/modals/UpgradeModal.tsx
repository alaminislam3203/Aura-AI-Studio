"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckIcon, CrownIcon, Loader2Icon, SparklesIcon, ZapIcon } from "lucide-react";

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function UpgradeModal({ isOpen, onClose }: UpgradeModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpgrade = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const res = await fetch("/api/create-checkout-session", {
        method: "POST",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to initiate Stripe checkout");
      }

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err: any) {
      setError(err?.message || "Something went wrong.");
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="studio-panel-inset max-w-md border-border/70 bg-card/95 p-6 backdrop-blur-xl sm:rounded-[2rem]">
        <DialogHeader className="text-center">
          <div className="mx-auto mb-3 flex size-14 items-center justify-center rounded-2xl border border-primary/30 bg-primary/10 text-primary shadow-[0_0_30px_rgba(255,180,0,0.2)]">
            <CrownIcon className="size-7" />
          </div>
          <DialogTitle className="text-2xl font-bold tracking-tight text-foreground">
            Upgrade to Aura Pro
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            You've used all 3 free image credits. Upgrade to unlock unlimited creative power.
          </DialogDescription>
        </DialogHeader>

        <div className="my-4 space-y-3 rounded-2xl border border-border/40 bg-background/30 p-4">
          <div className="flex items-center gap-3 text-sm text-foreground">
            <div className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary">
              <CheckIcon className="size-3.5" />
            </div>
            <span>Unlimited AI Background Removal & Replacement</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-foreground">
            <div className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary">
              <CheckIcon className="size-3.5" />
            </div>
            <span>Ultra HD AI Upscale & Super-Resolution</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-foreground">
            <div className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary">
              <CheckIcon className="size-3.5" />
            </div>
            <span>Custom Watermark & Dynamic Text Overlays</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-foreground">
            <div className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary">
              <CheckIcon className="size-3.5" />
            </div>
            <span>Priority processing & instant downloads</span>
          </div>
        </div>

        <div className="flex items-baseline justify-center gap-1.5 py-1">
          <span className="text-3xl font-bold text-foreground">$19</span>
          <span className="text-sm text-muted-foreground">/ month</span>
        </div>

        {error && (
          <p className="rounded-lg border border-red-500/30 bg-red-500/10 p-2 text-center text-xs text-red-400">
            {error}
          </p>
        )}

        <div className="mt-2 flex flex-col gap-2">
          <Button
            onClick={handleUpgrade}
            disabled={isLoading}
            className="studio-primary-action h-12 w-full rounded-full text-base font-semibold"
          >
            {isLoading ? (
              <>
                <Loader2Icon className="mr-2 size-4 animate-spin" /> Redirecting to Stripe...
              </>
            ) : (
              <>
                <ZapIcon className="mr-2 size-4" /> Start Pro Plan
              </>
            )}
          </Button>

          <Button
            variant="ghost"
            onClick={onClose}
            className="h-10 rounded-full text-sm text-muted-foreground hover:text-foreground"
          >
            Maybe Later
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
