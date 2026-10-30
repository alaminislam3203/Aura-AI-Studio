"use client";

import React, { useState, useEffect, useRef } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import {
  ArrowUpRightIcon,
  ChevronDownIcon,
  CrownIcon,
  LogInIcon,
  LogOutIcon,
  MenuIcon,
  SparklesIcon,
  Wand2Icon,
  XIcon,
  ZapIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";

import { Button } from "@/components/ui/button";
import { CENTER_NAV_LINKS, HERO_VIDEO_SRC } from "@/lib/constants";

function SeamlessHeroBackground() {
  const videoRef1 = useRef<HTMLVideoElement>(null);
  const videoRef2 = useRef<HTMLVideoElement>(null);
  const [activeVideo, setActiveVideo] = useState<1 | 2>(1);
  const isTransitioningRef = useRef(false);

  const checkTransition = (
    currentVideo: HTMLVideoElement,
    otherVideo: HTMLVideoElement,
    nextActive: 1 | 2,
  ) => {
    if (!currentVideo || !otherVideo) return;
    const timeLeft = currentVideo.duration - currentVideo.currentTime;
    if (
      timeLeft <= 1.2 &&
      !isTransitioningRef.current &&
      currentVideo.duration > 2
    ) {
      isTransitioningRef.current = true;
      otherVideo.currentTime = 0;
      otherVideo.play().catch(() => {});
      setActiveVideo(nextActive);

      setTimeout(() => {
        isTransitioningRef.current = false;
      }, 1300);
    }
  };

  return (
    <div className="absolute inset-0 z-0 overflow-hidden bg-black">
      <video
        ref={videoRef1}
        className={`hero-video absolute inset-0 h-full w-full object-cover object-center transition-opacity duration-1000 ease-in-out ${
          activeVideo === 1 ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        autoPlay
        muted
        playsInline
        preload="auto"
        onTimeUpdate={() => {
          if (activeVideo === 1 && videoRef1.current && videoRef2.current) {
            checkTransition(videoRef1.current, videoRef2.current, 2);
          }
        }}
        onEnded={() => {
          if (videoRef1.current) videoRef1.current.currentTime = 0;
        }}
      >
        <source src={HERO_VIDEO_SRC} type="video/mp4" />
      </video>

      <video
        ref={videoRef2}
        className={`hero-video absolute inset-0 h-full w-full object-cover object-center transition-opacity duration-1000 ease-in-out ${
          activeVideo === 2 ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        muted
        playsInline
        preload="auto"
        onTimeUpdate={() => {
          if (activeVideo === 2 && videoRef2.current && videoRef1.current) {
            checkTransition(videoRef2.current, videoRef1.current, 1);
          }
        }}
        onEnded={() => {
          if (videoRef2.current) videoRef2.current.currentTime = 0;
        }}
      >
        <source src={HERO_VIDEO_SRC} type="video/mp4" />
      </video>
    </div>
  );
}

export function HomeHeroSection() {
  const { data: session, status } = useSession();
  const user = session?.user as any;
  const [isPro, setIsPro] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (session?.user) {
      if ((session.user as any)?.plan === "PRO") {
        setIsPro(true);
      }
      fetch("/api/usage", { cache: "no-store" })
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data?.plan === "PRO") {
            setIsPro(true);
          }
        })
        .catch(() => {});
    }
  }, [session]);

  return (
    <section className="home-hero">
      <div className="hero-surface absolute inset-0 z-10" />
      <SeamlessHeroBackground />
      <div className="hero-fade pointer-events-none absolute inset-0 z-20" />

      <div className="home-hero-stack pb-12 sm:pb-16 lg:pb-20">
        <div className="home-nav-border-wrapper">
          <div className="home-nav-beam" />
          <nav className="home-nav">
            <Link href="/" className="home-brand">
              <span className="relative mr-1.5 flex h-9 w-9 shrink-0 items-center justify-center overflow-visible sm:mr-2 sm:h-10 sm:w-10">
                <Image
                  src="/logo.png"
                  alt="Aura Studio"
                  width={72}
                  height={72}
                  className="h-9 w-9 max-h-none max-w-none origin-left scale-[1.5] object-cover sm:h-10 sm:w-10 sm:scale-[1.55]"
                  priority
                />
              </span>
              <div className="min-w-0">
                <span className="caps-2xs block text-xs font-semibold text-foreground sm:text-sm whitespace-nowrap">
                  Aura Studio
                </span>
                <span className="caps-xs hidden sm:block truncate text-[10px] uppercase text-primary sm:text-xs">
                  AI Image Studio
                </span>
              </div>
            </Link>

            <div className="hidden md:flex items-center justify-center gap-1.5 lg:gap-2.5">
              {CENTER_NAV_LINKS.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="group relative inline-flex items-center gap-1 rounded-full px-4 py-1.5 text-[15px] font-medium text-zinc-300/90 transition-all duration-300 hover:bg-white/[0.08] hover:text-white hover:scale-[1.03] hover:shadow-[0_0_16px_rgba(255,90,20,0.18)] active:scale-[0.98] cursor-pointer"
                >
                  <span className="relative z-10 transition-colors duration-200 group-hover:text-white">
                    {link.label}
                  </span>
                  {link.hasDropdown ? (
                    <ChevronDownIcon
                      className="home-nav-chevron transition-transform duration-200 group-hover:rotate-180"
                      aria-hidden
                    />
                  ) : null}
                  {/* Subtle amber bottom sheen line on hover */}
                  <span className="absolute inset-x-3 -bottom-0.5 h-[1.5px] rounded-full bg-gradient-to-r from-transparent via-primary/80 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 pointer-events-none" />
                </Link>
              ))}
            </div>

            <div className="home-nav-auth">
              {status === "authenticated" && user ? (
                <div className="flex items-center gap-2 sm:gap-3">
                  {isPro && (
                    <>
                      <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-primary/40 bg-primary/15 px-3 py-1 text-xs font-semibold text-primary shadow-[0_0_15px_rgba(255,180,0,0.2)]">
                        <CrownIcon className="size-3.5 text-primary" />
                        <span>Pro Member</span>
                      </span>
                      <span className="sm:!hidden flex items-center gap-1 rounded-full border border-primary/40 bg-primary/15 px-2 py-0.5 text-[10px] font-bold text-primary">
                        <CrownIcon className="size-3 text-primary" />
                        <span>PRO</span>
                      </span>
                    </>
                  )}

                  <Button
                    variant="outline"
                    asChild
                    className="home-btn-studio-outline hidden sm:inline-flex"
                  >
                    <Link href="/playground" prefetch={false}>
                      Playground
                    </Link>
                  </Button>

                  {user.image && (
                    <img
                      src={user.image}
                      alt={user.name || "User"}
                      className="size-7 rounded-full border border-border/60 object-cover sm:size-8"
                    />
                  )}

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => signOut()}
                    className="hidden sm:flex size-8 rounded-full p-0 text-muted-foreground hover:text-foreground cursor-pointer"
                    title="Sign Out"
                  >
                    <LogOutIcon className="size-4" />
                  </Button>

                  <button
                    type="button"
                    onClick={() => setIsMobileMenuOpen((prev) => !prev)}
                    className="flex size-8 items-center justify-center rounded-full border border-white/20 bg-white/10 text-foreground transition-colors hover:bg-white/20 md:!hidden cursor-pointer"
                    aria-label="Toggle Navigation"
                  >
                    {isMobileMenuOpen ? (
                      <XIcon className="size-4" />
                    ) : (
                      <MenuIcon className="size-4" />
                    )}
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => signIn("google")}
                    className="home-btn-signin hidden sm:inline-flex"
                  >
                    <LogInIcon className="mr-1.5 size-3.5" /> Sign In
                  </Button>

                  <Button
                    asChild
                    className="home-btn-nav-primary hidden xs:inline-flex h-8 px-3 text-[11px] font-semibold sm:h-auto sm:px-6 sm:py-2.5 sm:text-xs whitespace-nowrap shrink-0"
                  >
                    <Link href="/playground">Launch Studio</Link>
                  </Button>

                  <button
                    type="button"
                    onClick={() => setIsMobileMenuOpen((prev) => !prev)}
                    className="flex size-8 items-center justify-center rounded-full border border-white/20 bg-white/10 text-foreground transition-colors hover:bg-white/20 md:!hidden cursor-pointer"
                    aria-label="Toggle Navigation"
                  >
                    {isMobileMenuOpen ? (
                      <XIcon className="size-4" />
                    ) : (
                      <MenuIcon className="size-4" />
                    )}
                  </button>
                </div>
              )}
            </div>
          </nav>

          {/* Mobile Drawer */}
          {isMobileMenuOpen && (
            <div className="relative z-10 border-t border-white/10 bg-background/95 px-5 py-4 backdrop-blur-3xl md:hidden animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="flex flex-col gap-3">
                {CENTER_NAV_LINKS.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-between rounded-xl px-3 py-2 text-sm font-medium text-foreground/80 transition-colors hover:bg-white/5 hover:text-white"
                  >
                    <span>{link.label}</span>
                    {link.hasDropdown && (
                      <ChevronDownIcon className="size-4 opacity-50" />
                    )}
                  </Link>
                ))}

                <div className="my-1 border-t border-white/10" />

                {status === "authenticated" && user ? (
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between px-2 py-1">
                      <div className="flex items-center gap-2.5">
                        {user.image && (
                          <img
                            src={user.image}
                            alt={user.name || "User"}
                            className="size-8 rounded-full border border-border/60 object-cover"
                          />
                        )}
                        <div className="min-w-0">
                          <p className="truncate text-xs font-semibold text-foreground">
                            {user.name}
                          </p>
                          <p className="truncate text-[10px] text-muted-foreground">
                            {user.email}
                          </p>
                        </div>
                      </div>
                      {isPro && (
                        <span className="flex items-center gap-1 rounded-full border border-primary/40 bg-primary/15 px-2 py-0.5 text-[10px] font-bold text-primary">
                          <CrownIcon className="size-3" /> PRO
                        </span>
                      )}
                    </div>

                    <Button asChild className="home-btn-nav-primary w-full">
                      <Link
                        href="/playground"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Open AI Playground
                      </Link>
                    </Button>

                    <button
                      type="button"
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        signOut();
                      }}
                      className="flex w-full items-center justify-center gap-2 rounded-full border border-border/60 bg-card/40 py-2 text-xs font-medium text-muted-foreground hover:bg-card hover:text-foreground cursor-pointer"
                    >
                      <LogOutIcon className="size-3.5" /> Sign Out
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        signIn("google");
                      }}
                      className="w-full rounded-full border border-white/20 bg-white/10 py-2 text-xs font-medium text-foreground cursor-pointer"
                    >
                      <LogInIcon className="mr-2 size-3.5" /> Sign In with
                      Google
                    </Button>
                    <Button asChild className="home-btn-nav-primary w-full">
                      <Link
                        href="/playground"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Launch AI Studio
                      </Link>
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="home-hero-copy order-2 md:order-1 pt-4 sm:pt-6 md:pt-14 lg:pt-20">
          <h1 className="hero-title home-hero-title">
            <span className="block">Next-Gen AI Image Studio.</span>
            <span
              style={{
                fontFamily: 'Georgia, "Merriweather", "Times New Roman", serif',
              }}
              className="mt-3 block font-serif text-2xl font-normal italic tracking-tight text-white/95 sm:mt-4 sm:text-3xl md:text-4xl lg:text-[3.25rem] lg:leading-[1.2] [text-shadow:0_4px_30px_rgba(0,0,0,0.8),0_0_45px_rgba(255,140,0,0.25)]"
            >
              Remove Backgrounds, Replace Scenes & Upscale in Real-time.
            </span>
          </h1>

          <p className="home-hero-lede mt-7 max-w-3xl text-pretty text-base font-normal leading-relaxed text-foreground/85 sm:text-lg md:text-[1.25rem] md:leading-relaxed [text-shadow:0_2px_20px_rgba(0,0,0,0.6)]">
            Professional AI image editing powered by Aura Neural Vision Engine.
            Isolate subjects, generate custom AI environments, enhance
            micro-details 2x, and stamp dynamic watermarks.
          </p>

          <div className="mt-7 sm:mt-9 flex w-full max-w-xs sm:max-w-none flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <Link
              href="/playground"
              prefetch={false}
              className="group inline-flex h-11 sm:h-14 w-full sm:w-auto items-center justify-center gap-2 rounded-full bg-gradient-to-r from-primary via-orange-500 to-amber-500 px-5 py-2.5 sm:px-8 sm:py-3.5 text-sm sm:text-base font-semibold text-white shadow-[0_4px_24px_rgba(255,90,20,0.38)] transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_8px_36px_rgba(255,90,20,0.6)] active:scale-[0.98] cursor-pointer"
            >
              <Wand2Icon className="size-4 sm:size-5 transition-transform duration-300 group-hover:rotate-12" />
              <span>Open AI Playground</span>
            </Link>

            <a
              href="#how-it-works"
              className="inline-flex h-11 sm:h-14 w-full sm:w-auto items-center justify-center rounded-full border border-border/80 bg-card/40 px-5 py-2.5 sm:px-8 sm:py-3.5 text-sm sm:text-base font-medium text-foreground/90 backdrop-blur-md shadow-sm transition-all duration-300 hover:scale-[1.03] hover:border-primary/50 hover:bg-card/80 hover:text-foreground hover:shadow-[0_0_25px_rgba(255,180,0,0.18)] active:scale-[0.98] cursor-pointer"
            >
              See How It Works
            </a>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 35, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="home-demo-wrap relative order-1 md:order-2 mt-4 sm:mt-6 md:mt-10"
        >
          {/* Multi-layer ambient pulsating glow behind the showcase deck */}
          <motion.div
            animate={{ opacity: [0.65, 0.95, 0.65], scale: [0.98, 1.02, 0.98] }}
            transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
            className="pointer-events-none absolute -inset-4 sm:-inset-8 -z-10 rounded-[3rem] bg-gradient-to-r from-orange-500/30 via-amber-500/20 to-primary/30 blur-3xl opacity-80"
          />
          <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4/5 h-4/5 -z-10 rounded-full bg-orange-600/20 blur-[110px]" />

          {/* Perspective Container */}
          <div className="home-demo-shift group/demo relative !translate-y-0">
            <div className="relative rounded-[1.65rem] sm:rounded-[2rem] lg:rounded-[2.25rem] p-[2px] sm:p-[2.5px] overflow-hidden bg-gradient-to-b from-white/30 via-white/10 to-white/5 shadow-[0_30px_100px_rgba(0,0,0,0.9),0_0_60px_rgba(255,90,20,0.25)]">
              {/* Rotating conic light beam (Tailwind + Motion native) */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 7, ease: "linear" }}
                className="pointer-events-none absolute -inset-[180%]"
                style={{
                  background:
                    "conic-gradient(from 0deg, transparent 0deg, transparent 60deg, rgba(255, 90, 20, 0.4) 100deg, rgba(255, 120, 30, 0.95) 130deg, rgba(255, 215, 60, 1) 150deg, rgba(255, 120, 30, 0.95) 170deg, rgba(255, 90, 20, 0.4) 200deg, transparent 240deg, transparent 360deg)",
                }}
              />

              {/* Glass Frame Shell */}
              <div className="relative rounded-[calc(1.65rem-2px)] sm:rounded-[calc(2rem-2.5px)] lg:rounded-[calc(2.25rem-2.5px)] bg-[#0c0a09]/85 backdrop-blur-3xl overflow-hidden border border-white/[0.08]">
                {/* Specular Top Border Highlight */}
                <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/45 to-transparent pointer-events-none z-20" />

                {/* macOS Frosted Glass Window Header Bar */}
                <div className="relative z-20 flex items-center justify-between border-b border-white/[0.08] bg-black/40 px-3.5 py-2.5 sm:px-5 sm:py-3 backdrop-blur-xl">
                  {/* Window Traffic Lights */}
                  <div className="flex items-center gap-2">
                    <span className="size-2.5 sm:size-3 rounded-full bg-[#ff5f56]/90 border border-[#e0443e]/50 shadow-[0_0_6px_rgba(255,95,86,0.5)]" />
                    <span className="size-2.5 sm:size-3 rounded-full bg-[#ffbd2e]/90 border border-[#dea123]/50 shadow-[0_0_6px_rgba(255,189,46,0.5)]" />
                    <span className="size-2.5 sm:size-3 rounded-full bg-[#27c93f]/90 border border-[#1aab29]/50 shadow-[0_0_6px_rgba(39,201,63,0.5)]" />
                  </div>

                  {/* Browser URL / Live Engine Status Pill */}
                  {/* <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-white/75 shadow-inner">
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                    </span>
                    <span className="font-mono text-[10px] sm:text-[11px] tracking-wide text-zinc-300">
                      aura.studio/playground
                    </span>
                   
                  </div> */}

                  {/* Quick Action to Playground - Hidden on mobile to avoid overflow/wrapping */}
                  <Link
                    href="/playground"
                    className="group/cta hidden sm:inline-flex items-center gap-1.5 rounded-full border border-primary/40 bg-primary/15 px-2.5 py-1 text-[11px] sm:text-xs font-medium text-primary hover:bg-primary/25 hover:border-primary/60 transition-all duration-200 shrink-0 whitespace-nowrap"
                  >
                    <span>Launch Studio</span>
                    <ArrowUpRightIcon className="size-3 sm:size-3.5 transition-transform duration-200 group-hover/cta:translate-x-0.5 group-hover/cta:-translate-y-0.5" />
                  </Link>
                </div>

                {/* Main Workspace Preview Content */}
                <Link
                  href="/playground"
                  className="relative block overflow-hidden bg-black/50 group/preview cursor-pointer"
                >
                  {/* Subtle diagonal glass sheen overlay */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.03] to-white/[0.08] pointer-events-none z-10" />

                  {/* The Workspace Screenshot Image */}
                  <Image
                    src="/aura-demo.png"
                    alt="Aura Studio workspace showing upload, AI tools, and interactive canvas comparison"
                    width={3290}
                    height={1872}
                    className="h-auto w-full transition-transform duration-700 ease-out group-hover/preview:scale-[1.015]"
                    priority
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1100px"
                  />

                  {/* Mobile-Only Interactive Tap Strip */}
                  <div className="flex sm:hidden items-center justify-between border-t border-white/10 bg-black/65 px-3.5 py-2 backdrop-blur-md">
                    <span className="text-[11px] font-medium text-zinc-300">
                      Interactive AI Split Canvas
                    </span>
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary">
                      <span>Launch Studio</span>
                      <ArrowUpRightIcon className="size-3 text-primary" />
                    </span>
                  </div>

                  {/* Hover Center Interactive Call-to-Action Pill */}
                  <div className="absolute inset-0 z-20 hidden sm:flex items-center justify-center bg-black/25 opacity-0 backdrop-blur-[2px] transition-all duration-300 group-hover/preview:opacity-100">
                    <div className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-black/85 px-5 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-[0_10px_30px_rgba(0,0,0,0.8),0_0_24px_rgba(255,90,20,0.45)] backdrop-blur-xl transition-all duration-300 group-hover/preview:scale-105">
                      <span>Open Interactive AI Playground</span>
                      <ArrowUpRightIcon className="size-4 text-primary" />
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
