"use client";

import Link from "next/link";
import Image from "next/image";
import { useSession, signIn, signOut } from "next-auth/react";
import { useState, useEffect, Suspense } from "react";
import { Button } from "@/components/ui/button";
import { PlaygroundWorkbench } from "@/components/playground/PlaygroundWorkbench";
import { ApiConfigModal } from "@/components/modals/ApiConfigModal";
import { getCustomImageKitConfig, BYOK_CHANGE_EVENT } from "@/lib/byok-storage";
import { ArrowLeftIcon, CrownIcon, KeyRoundIcon, LogInIcon, LogOutIcon, SparklesIcon } from "lucide-react";

export default function PlaygroundPage() {
  const { data: session, status } = useSession();
  const user = session?.user as any;
  const isPro = user?.plan === "PRO";
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [hasCustomConfig, setHasCustomConfig] = useState(false);

  useEffect(() => {
    const checkConfig = () => {
      setHasCustomConfig(Boolean(getCustomImageKitConfig()));
    };
    checkConfig();
    window.addEventListener(BYOK_CHANGE_EVENT, checkConfig);
    return () => window.removeEventListener(BYOK_CHANGE_EVENT, checkConfig);
  }, []);

  return (
    <main className="studio-shell min-h-screen px-4 py-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1440px]">
        {/* Header Bar - Responsive Single Row */}
        <header className="mb-5 flex items-center justify-between gap-2 sm:mb-8">
          {/* Left: Back Home + Logo */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            

              <Link href="/" className="home-brand">
              <span className="relative mr-1.5 flex h-9 w-9 shrink-0 items-center justify-center overflow-visible sm:mr-2 sm:h-10 sm:w-10">
                <Image
                  src="/logo.png"
                  alt="Aura Studio"
                  width={500}
                  height={500}
                  unoptimized
                  className="h-9 w-9 max-h-none max-w-none origin-left scale-[1.5] object-contain sm:h-10 sm:w-10 sm:scale-[1.55]"
                  priority
                />
              </span>
            </Link>
          </div>

          {/* Right: User status & actions */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            {/* BYOK ImageKit Configuration Button */}
            <button
              type="button"
              onClick={() => setIsConfigModalOpen(true)}
              className="flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-2.5 sm:px-3 py-1 text-xs font-semibold text-primary transition-all hover:bg-primary/20 hover:border-primary/50 shadow-[0_0_15px_rgba(255,140,0,0.12)] cursor-pointer"
              title="Configure custom ImageKit API credentials"
            >
              <KeyRoundIcon className="size-3.5" />
              <span className="hidden sm:inline">
                {hasCustomConfig ? "Custom Keys Active" : "API Config"}
              </span>
              <span className="sm:hidden">Keys</span>
            </button>

            {isPro ? (
              <>
                <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary shadow-[0_0_12px_rgba(255,140,0,0.2)]">
                  <CrownIcon className="size-3.5" /> Pro Member
                </span>
                <span className="sm:hidden inline-flex items-center gap-1 rounded-full border border-primary/40 bg-primary/15 px-2 py-0.5 text-[10px] font-bold text-primary">
                  <CrownIcon className="size-3" /> PRO
                </span>
              </>
            ) : (
              <span className="studio-pill-strong hidden sm:inline-flex rounded-full border px-3 py-1 text-xs font-medium text-muted-foreground">
                <SparklesIcon className="mr-1 inline size-3 text-primary" /> AI Studio
              </span>
            )}

            {status === "authenticated" && user ? (
              <div className="flex items-center gap-1.5 sm:gap-3">
                {user.image && (
                  <img
                    src={user.image}
                    alt={user.name || "User"}
                    className="size-7 sm:size-8 rounded-full border border-white/20 object-cover shadow-sm"
                  />
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => signOut()}
                  className="rounded-full border-white/15 bg-white/5 h-7 sm:h-8 px-2 sm:px-3 text-xs text-muted-foreground hover:bg-white/10 hover:text-foreground cursor-pointer"
                  title="Sign Out"
                >
                  <LogOutIcon className="size-3.5 sm:mr-1.5" />
                  <span className="hidden sm:inline">Sign Out</span>
                </Button>
              </div>
            ) : (
              <Button
                size="sm"
                onClick={() => signIn("google")}
                className="studio-primary-action h-7 sm:h-8 rounded-full px-3 sm:px-4 text-xs font-semibold"
              >
                <LogInIcon className="mr-1 size-3" /> Sign In
              </Button>
            )}
          </div>
        </header>

        {/* Studio Workbench */}
        <Suspense
          fallback={
            <div className="flex min-h-[500px] w-full items-center justify-center">
              <div className="size-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            </div>
          }
        >
          <PlaygroundWorkbench />
        </Suspense>

        <ApiConfigModal
          isOpen={isConfigModalOpen}
          onClose={() => setIsConfigModalOpen(false)}
        />
      </div>
    </main>
  );
}
