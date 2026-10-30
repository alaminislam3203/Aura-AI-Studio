"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  getCustomImageKitConfig,
  saveCustomImageKitConfig,
  clearCustomImageKitConfig,
} from "@/lib/byok-storage";
import {
  KeyRoundIcon,
  BookOpenIcon,
  ExternalLinkIcon,
  EyeIcon,
  EyeOffIcon,
  RotateCcwIcon,
  SaveIcon,
  ShieldCheckIcon,
} from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "motion/react";

interface ApiConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ApiConfigModal({ isOpen, onClose }: ApiConfigModalProps) {
  const [activeTab, setActiveTab] = useState<"keys" | "guide">("keys");
  const [publicKey, setPublicKey] = useState("");
  const [privateKey, setPrivateKey] = useState("");
  const [showPrivateKey, setShowPrivateKey] = useState(false);
  const [hasCustomConfig, setHasCustomConfig] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const config = getCustomImageKitConfig();
      if (config) {
        setPublicKey(config.publicKey);
        setPrivateKey(config.privateKey);
        setHasCustomConfig(true);
      } else {
        setPublicKey("");
        setPrivateKey("");
        setHasCustomConfig(false);
      }
    }
  }, [isOpen]);

  const handleSave = () => {
    const trimmedPub = publicKey.trim();
    const trimmedPriv = privateKey.trim();

    if (!trimmedPub || !trimmedPriv) {
      toast.error("Please fill in both Public Key and Private Key.");
      return;
    }

    if (!trimmedPub.startsWith("public_")) {
      toast.warning("ImageKit Public Keys usually start with 'public_'");
    }

    if (!trimmedPriv.startsWith("private_")) {
      toast.warning("ImageKit Private Keys usually start with 'private_'");
    }

    saveCustomImageKitConfig({
      publicKey: trimmedPub,
      privateKey: trimmedPriv,
    });

    setHasCustomConfig(true);
    toast.success("Custom ImageKit keys saved and activated!");
    onClose();
  };

  const handleReset = () => {
    clearCustomImageKitConfig();
    setPublicKey("");
    setPrivateKey("");
    setHasCustomConfig(false);
    toast.info("Switched back to Aura default cloud credentials.");
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-xl border-white/12 bg-card/95 p-6 backdrop-blur-2xl sm:rounded-3xl shadow-[0_25px_70px_rgba(0,0,0,0.85)] font-sans">
        <DialogHeader className="text-left space-y-1">
          <div className="flex items-center justify-between">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              <KeyRoundIcon className="size-3.5" />
              <span>Bring Your Own Key (BYOK)</span>
            </div>
            {hasCustomConfig ? (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-400">
                <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Custom Keys Active
              </span>
            ) : (
              <span className="inline-flex mr-7 items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-amber-300">
                <span className="size-1.5 rounded-full bg-amber-400" />
                Default
              </span>
            )}
          </div>
          <DialogTitle className="text-xl font-bold tracking-tight text-foreground pt-2">
            ImageKit API Configuration
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground leading-relaxed">
            Connect your personal ImageKit account for unlimited personal usage,
            or stick with Aura demo cloud credentials.
          </DialogDescription>
        </DialogHeader>

        {/* Tab Selector */}
        <div className="mt-3 grid grid-cols-2 gap-1 rounded-2xl border border-white/10 bg-black/40 p-1 backdrop-blur-xl">
          <button
            type="button"
            onClick={() => setActiveTab("keys")}
            className={`flex items-center justify-center gap-2 rounded-xl py-2 text-xs font-semibold transition-all cursor-pointer ${
              activeTab === "keys"
                ? "bg-primary text-black shadow-[0_2px_12px_rgba(255,140,0,0.3)] font-bold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <KeyRoundIcon className="size-3.5" />
            <span>API Credentials</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("guide")}
            className={`flex items-center justify-center gap-2 rounded-xl py-2 text-xs font-semibold transition-all cursor-pointer ${
              activeTab === "guide"
                ? "bg-primary text-black shadow-[0_2px_12px_rgba(255,140,0,0.3)] font-bold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <BookOpenIcon className="size-3.5" />
            <span>Setup Guide</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="mt-4 min-h-[240px]">
          <AnimatePresence mode="wait">
            {activeTab === "keys" ? (
              <motion.div
                key="tab-keys"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.18 }}
                className="space-y-4"
              >
                {/* Public Key */}
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1.5">
                    ImageKit Public Key
                  </label>
                  <input
                    type="text"
                    value={publicKey}
                    onChange={(e) => setPublicKey(e.target.value)}
                    placeholder="public_xxxxxxxxxxxxxxxxxx"
                    className="w-full rounded-xl border border-white/10 bg-background/60 px-3.5 py-2.5 text-xs text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary font-mono"
                  />
                </div>

                {/* Private Key */}
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1.5">
                    ImageKit Private Key (Secret Key)
                  </label>
                  <div className="relative">
                    <input
                      type={showPrivateKey ? "text" : "password"}
                      value={privateKey}
                      onChange={(e) => setPrivateKey(e.target.value)}
                      placeholder="private_xxxxxxxxxxxxxxxxxx"
                      className="w-full rounded-xl border border-white/10 bg-background/60 px-3.5 py-2.5 pr-10 text-xs text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPrivateKey(!showPrivateKey)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                    >
                      {showPrivateKey ? (
                        <EyeOffIcon className="size-3.5" />
                      ) : (
                        <EyeIcon className="size-3.5" />
                      )}
                    </button>
                  </div>
                  <p className="mt-2 text-[10px] text-muted-foreground flex items-center gap-1.5">
                    <ShieldCheckIcon className="size-3.5 text-emerald-400 shrink-0" />
                    <span>Stored securely in your local browser session. Never saved to our database.</span>
                  </p>
                </div>

                {/* Actions Row */}
                <div className="pt-3 flex items-center justify-between gap-2 border-t border-white/8">
                  <div>
                    {hasCustomConfig && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={handleReset}
                        className="rounded-xl text-xs text-muted-foreground hover:text-foreground cursor-pointer h-9 px-3"
                      >
                        <RotateCcwIcon className="mr-1.5 size-3.5" />
                        Reset Default
                      </Button>
                    )}
                  </div>

                  <Button
                    type="button"
                    onClick={handleSave}
                    className="studio-primary-action rounded-xl text-xs font-semibold h-9 px-5 cursor-pointer"
                  >
                    <SaveIcon className="mr-1.5 size-3.5" />
                    Save & Activate
                  </Button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="tab-guide"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.18 }}
                className="space-y-3 text-xs"
              >
                <div className="rounded-2xl border border-primary/20 bg-primary/5 p-3.5">
                  <div className="flex items-start gap-2.5">
                    <div className="flex size-6 items-center justify-center rounded-lg bg-primary text-black font-bold shrink-0 text-xs">
                      1
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">
                        Sign Up for Free at ImageKit
                      </h4>
                      <p className="text-muted-foreground mt-0.5 leading-relaxed">
                        Create a free account at imagekit.io. The free tier
                        gives 20 GB bandwidth and thousands of transformations
                        per month with zero fees.
                      </p>
                      <a
                        href="https://imagekit.io/registration"
                        target="_blank"
                        rel="noreferrer"
                        className="mt-1.5 inline-flex items-center gap-1 font-semibold text-primary hover:underline text-[11px]"
                      >
                        Open ImageKit Registration{" "}
                        <ExternalLinkIcon className="size-3" />
                      </a>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-3.5">
                  <div className="flex items-start gap-2.5">
                    <div className="flex size-6 items-center justify-center rounded-lg bg-white/10 text-foreground font-bold shrink-0 text-xs">
                      2
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">
                        Navigate to Developer Options
                      </h4>
                      <p className="text-muted-foreground mt-0.5 leading-relaxed">
                        In your ImageKit dashboard, open the left navigation
                        panel, click on <strong>Developer Options</strong>, and
                        select <strong>API Keys</strong>.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-3.5">
                  <div className="flex items-start gap-2.5">
                    <div className="flex size-6 items-center justify-center rounded-lg bg-white/10 text-foreground font-bold shrink-0 text-xs">
                      3
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">
                        Copy Public & Private Keys
                      </h4>
                      <p className="text-muted-foreground mt-0.5 leading-relaxed">
                        Copy your <strong>Public Key</strong> (starts with <code>public_</code>) and{" "}
                        <strong>Private Key</strong> (starts with <code>private_</code>).
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-3.5">
                  <div className="flex items-start gap-2.5">
                    <div className="flex size-6 items-center justify-center rounded-lg bg-white/10 text-foreground font-bold shrink-0 text-xs">
                      4
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">
                        Paste & Activate
                      </h4>
                      <p className="text-muted-foreground mt-0.5 leading-relaxed">
                        Switch to the <strong>API Credentials</strong> tab
                        above, paste both keys, and click{" "}
                        <strong>Save & Activate</strong>. All image uploads and transformations will
                        now run directly through your own ImageKit quota.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
}
