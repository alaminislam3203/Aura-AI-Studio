"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckCircle2Icon,
  EyeIcon,
  EyeOffIcon,
  LayersIcon,
  Loader2Icon,
  LockIcon,
  MailIcon,
  ShieldCheckIcon,
  SparklesIcon,
  StarIcon,
  UserIcon,
  Wand2Icon,
  ZapIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface AuthPortalProps {
  initialMode?: "login" | "signup";
}

const STUDIO_FEATURES = [
  {
    icon: Wand2Icon,
    title: "16 Neural AI Tools",
    desc: "Background removal, scene replacement, generative fill & smart face crop.",
  },
  {
    icon: ZapIcon,
    title: "4K Super-Resolution",
    desc: "Hardware-accelerated 2x & 4x upscaling with micro-texture synthesis.",
  },
  {
    icon: LayersIcon,
    title: "Multi-Step Chain Edit",
    desc: "Stack multiple AI passes sequentially and export in PNG, WEBP, or JPG.",
  },
];

export function AuthPortal({ initialMode = "login" }: AuthPortalProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { status } = useSession();

  const callbackUrl = searchParams.get("callbackUrl") || "/playground";
  const modeParam = searchParams.get("mode");

  const [mode, setMode] = useState<"login" | "signup">(
    modeParam === "signup" ? "signup" : modeParam === "login" ? "login" : initialMode
  );
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [activePreviewMode, setActivePreviewMode] = useState<"after" | "before">("after");

  useEffect(() => {
    if (status === "authenticated") {
      router.replace(callbackUrl);
    }
  }, [status, router, callbackUrl]);

  // Calculate password strength (0 to 4)
  const getPasswordStrength = (pwd: string) => {
    if (!pwd) return 0;
    let score = 0;
    if (pwd.length >= 6) score++;
    if (pwd.length >= 10) score++;
    if (/[A-Z]/.test(pwd) && /[a-z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd) || /[^A-Za-z0-9]/.test(pwd)) score++;
    return Math.max(1, score);
  };

  const strength = getPasswordStrength(password);
  const strengthLabels = ["", "Weak", "Fair", "Good", "Strong"];
  const strengthColors = [
    "bg-white/10",
    "bg-red-500",
    "bg-amber-500",
    "bg-emerald-400",
    "bg-emerald-500",
  ];

  const handleGoogleSignIn = async () => {
    try {
      setIsGoogleLoading(true);
      await signIn("google", { callbackUrl });
    } catch {
      toast.error("Failed to connect with Google. Please try again.");
      setIsGoogleLoading(false);
    }
  };

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim() || !password) {
      toast.error("Please enter your email address and password.");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long.");
      return;
    }

    if (mode === "signup" && !name.trim()) {
      toast.error("Please enter your full name to create an account.");
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await signIn("credentials", {
        redirect: false,
        email: email.trim().toLowerCase(),
        password,
        name: name.trim(),
        mode,
        callbackUrl,
      });

      if (res?.error) {
        toast.error(res.error);
        setIsSubmitting(false);
        return;
      }

      toast.success(
        mode === "signup"
          ? "Account created! Welcome to Aura AI Studio."
          : "Welcome back to Aura AI Studio!"
      );
      router.push(callbackUrl);
      router.refresh();
    } catch {
      toast.error("Authentication failed. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <main className="studio-shell relative min-h-screen w-full overflow-hidden flex items-center justify-center px-4 py-6 sm:px-6 lg:px-10 lg:py-8">
      {/* Ambient Background Glows */}
      <div className="pointer-events-none fixed -top-40 -left-40 size-[520px] rounded-full bg-primary/18 blur-[150px]" />
      <div className="pointer-events-none fixed -bottom-40 -right-40 size-[520px] rounded-full bg-amber-500/12 blur-[150px]" />

      {/* Main 2-Column Container */}
      <div className="relative z-10 mx-auto grid w-full max-w-[1320px] grid-cols-1 overflow-hidden rounded-[2.25rem] border border-white/12 bg-black/55 shadow-[0_30px_100px_rgba(0,0,0,0.9)] backdrop-blur-2xl lg:min-h-[760px] lg:grid-cols-12">
        {/* Top Specular Highlight Line */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-primary/60 to-transparent" />

        {/* ================================================================
            LEFT COLUMN: BRAND SHOWCASE & VISUAL STUDIO PREVIEW
        ================================================================ */}
        <div className="relative flex flex-col justify-between overflow-hidden border-b border-white/10 bg-gradient-to-br from-white/[0.04] via-black/40 to-primary/[0.07] p-6 sm:p-10 lg:col-span-7 lg:border-b-0 lg:border-r">
          {/* Decorative Grid Pattern */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage:
                "linear-gradient(to right, rgba(255,255,255,0.2) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.2) 1px, transparent 1px)",
              backgroundSize: "36px 36px",
            }}
          />

          {/* Top Bar: Unoptimized Full Logo + Back to Home */}
          <div className="relative z-10 flex items-center justify-between gap-4">
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
              <div className="min-w-0">
                <span className="caps-2xs block text-xs font-semibold text-foreground sm:text-sm whitespace-nowrap">
                  Aura Studio
                </span>
                <span className="caps-xs hidden sm:block truncate text-[10px] uppercase text-primary sm:text-xs">
                  AI Image Studio
                </span>
              </div>
            </Link>

            <Link
              href="/"
              className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.04] px-3.5 py-1.5 text-xs font-medium text-muted-foreground transition-all hover:border-white/30 hover:bg-white/10 hover:text-white"
            >
              <ArrowLeftIcon className="size-3.5" />
              <span>Back to Home</span>
            </Link>
          </div>

          {/* Center Content: Hero Headline + Interactive Studio Preview + Feature List */}
          <div className="relative z-10 my-8 space-y-6 lg:my-6">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/35 bg-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-primary shadow-[0_0_20px_rgba(255,120,0,0.18)]">
                <SparklesIcon className="size-3.5" />
                <span>Neural Vision Engine v4.2</span>
              </div>

              <h1 className="mt-4 text-2xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-[2.5rem] lg:leading-[1.15]">
                Transform visuals with{" "}
                <span className="bg-gradient-to-r from-primary via-orange-400 to-amber-300 bg-clip-text text-transparent">
                  studio-grade AI precision.
                </span>
              </h1>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                Isolate subjects, generate photorealistic scenes, upscale to 4K resolution, and chain multiple neural passes in seconds.
              </p>
            </div>

            {/* Interactive Live Studio Showcase Card */}
            <div className="relative overflow-hidden rounded-2xl border border-white/15 bg-black/60 p-3 shadow-2xl">
              <div className="relative h-48 sm:h-56 w-full overflow-hidden rounded-xl border border-white/10">
                <img
                  src={
                    activePreviewMode === "after"
                      ? "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=1000&auto=format&fit=crop&q=85"
                      : "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=60&sat=-100"
                  }
                  alt="AI Studio Preview"
                  className={`h-full w-full object-cover transition-all duration-500 ${
                    activePreviewMode === "after"
                      ? "scale-100 saturate-125 contrast-105"
                      : "scale-105 grayscale blur-[0.5px]"
                  }`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

                {/* Top Floating Toggle Pills */}
                <div className="absolute top-3 left-3 flex items-center gap-1.5 rounded-full border border-white/15 bg-black/70 p-1 backdrop-blur-md">
                  <button
                    type="button"
                    onClick={() => setActivePreviewMode("before")}
                    className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold transition-all cursor-pointer ${
                      activePreviewMode === "before"
                        ? "bg-white/20 text-white"
                        : "text-muted-foreground hover:text-white"
                    }`}
                  >
                    Raw Input
                  </button>
                  <button
                    type="button"
                    onClick={() => setActivePreviewMode("after")}
                    className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold transition-all cursor-pointer ${
                      activePreviewMode === "after"
                        ? "bg-primary text-black"
                        : "text-muted-foreground hover:text-white"
                    }`}
                  >
                    AI Enhanced 4K
                  </button>
                </div>

                {/* Top Right Live Metric Pill */}
                <div className="absolute top-3 right-3 inline-flex items-center gap-1.5 rounded-full border border-emerald-500/40 bg-emerald-500/15 px-2.5 py-1 text-[10px] font-bold text-emerald-300 backdrop-blur-md">
                  <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>0.4s GPU Pass</span>
                </div>

                {/* Bottom Overlay Info */}
                <div className="absolute bottom-3 inset-x-3 flex items-center justify-between gap-2">
                  <div>
                    <p className="text-xs font-bold text-white">
                      {activePreviewMode === "after"
                        ? "AI Relight + 4x Super-Resolution + Color Grade"
                        : "Original Unprocessed Portrait (Low Contrast)"}
                    </p>
                    <p className="text-[11px] text-white/70">
                      Click toggle above to inspect neural enhancement
                    </p>
                  </div>
                  <span className="rounded-lg border border-primary/40 bg-primary/20 px-2.5 py-1 text-[10px] font-bold text-primary">
                    Lossless PNG
                  </span>
                </div>
              </div>
            </div>

            {/* 3 Studio Feature Highlights */}
            <div className="grid gap-3 sm:grid-cols-3">
              {STUDIO_FEATURES.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.title}
                    className="rounded-2xl border border-white/10 bg-white/[0.03] p-3.5 transition-colors hover:border-primary/30 hover:bg-white/[0.05]"
                  >
                    <div className="mb-2 flex size-8 items-center justify-center rounded-xl border border-primary/30 bg-primary/15 text-primary">
                      <Icon className="size-4" />
                    </div>
                    <h3 className="text-xs font-bold text-white">{item.title}</h3>
                    <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
                      {item.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bottom Bar: Creator Social Proof & Rating */}
          <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-5">
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2.5">
                {[
                  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80",
                  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80",
                  "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&auto=format&fit=crop&q=80",
                  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80",
                ].map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    alt="Creator"
                    className="size-8 rounded-full border-2 border-black object-cover"
                  />
                ))}
              </div>
              <div>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, idx) => (
                    <StarIcon
                      key={idx}
                      className="size-3 fill-amber-400 text-amber-400"
                    />
                  ))}
                  <span className="ml-1 text-xs font-bold text-white">4.9/5</span>
                </div>
                <p className="text-[11px] text-muted-foreground">
                  Trusted by <span className="font-semibold text-white">12,400+</span> designers & studios
                </p>
              </div>
            </div>

            <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-[11px] font-medium text-emerald-400">
              <ShieldCheckIcon className="size-3.5" />
              <span>3 Free Credits on Sign Up</span>
            </div>
          </div>
        </div>

        {/* ================================================================
            RIGHT COLUMN: INTERACTIVE LOGIN / SIGN UP PORTAL
        ================================================================ */}
        <div className="relative flex flex-col justify-center bg-card/65 p-6 sm:p-10 lg:col-span-5 xl:p-12">
          <div className="mx-auto w-full max-w-md">
            {/* Animated Segmented Mode Switcher */}
            <div className="relative mb-7 grid grid-cols-2 rounded-2xl border border-white/12 bg-black/50 p-1.5">
              <button
                type="button"
                onClick={() => setMode("login")}
                className={`relative z-10 rounded-xl py-2.5 text-xs sm:text-sm font-bold transition-colors cursor-pointer ${
                  mode === "login"
                    ? "text-black"
                    : "text-muted-foreground hover:text-white"
                }`}
              >
                {mode === "login" && (
                  <motion.div
                    layoutId="auth-tab-pill"
                    transition={{ type: "spring", bounce: 0.18, duration: 0.45 }}
                    className="absolute inset-0 -z-10 rounded-xl bg-gradient-to-r from-primary via-orange-400 to-amber-400 shadow-[0_4px_20px_rgba(255,120,0,0.4)]"
                  />
                )}
                Sign In
              </button>

              <button
                type="button"
                onClick={() => setMode("signup")}
                className={`relative z-10 rounded-xl py-2.5 text-xs sm:text-sm font-bold transition-colors cursor-pointer ${
                  mode === "signup"
                    ? "text-black"
                    : "text-muted-foreground hover:text-white"
                }`}
              >
                {mode === "signup" && (
                  <motion.div
                    layoutId="auth-tab-pill"
                    transition={{ type: "spring", bounce: 0.18, duration: 0.45 }}
                    className="absolute inset-0 -z-10 rounded-xl bg-gradient-to-r from-primary via-orange-400 to-amber-400 shadow-[0_4px_20px_rgba(255,120,0,0.4)]"
                  />
                )}
                Create Account
              </button>
            </div>

            {/* Dynamic Heading */}
            <div className="mb-6">
              <h2 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
                {mode === "login" ? "Welcome back" : "Create your studio account"}
              </h2>
              <p className="mt-1.5 text-xs sm:text-sm text-muted-foreground">
                {mode === "login"
                  ? "Sign in to access your AI workbench, cloud history, and Pro tools."
                  : "Start free with 3 AI transformation credits — no credit card required."}
              </p>
            </div>

            {/* 1-Click Google OAuth Button */}
            <Button
              type="button"
              variant="outline"
              onClick={handleGoogleSignIn}
              disabled={isGoogleLoading || isSubmitting}
              className="relative flex h-12 w-full items-center justify-center gap-3 rounded-2xl border border-white/20 bg-white/[0.06] text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:border-white/40 hover:bg-white/[0.12] cursor-pointer"
            >
              {isGoogleLoading ? (
                <Loader2Icon className="size-4 animate-spin text-primary" />
              ) : (
                <svg className="size-5" viewBox="0 0 24 24">
                  <path
                    fill="#EA4335"
                    d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.4 1 3.5 3.6 1.6 7.4l3.7 2.8C6.2 7.2 8.9 5 12 5z"
                  />
                  <path
                    fill="#4285F4"
                    d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.6l3.7 2.9c2.2-2 3.7-5 3.7-8.7z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.3 14.8c-.2-.8-.4-1.6-.4-2.5s.2-1.7.4-2.5L1.6 7C.6 9 0 11.2 0 13.5s.6 4.5 1.6 6.5l3.7-2.9z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3.1 0-5.8-2.1-6.7-5l-3.7 2.8C3.5 21.4 7.4 24 12 24z"
                  />
                </svg>
              )}
              <span>
                {mode === "login" ? "Continue with Google" : "Sign up with Google"}
              </span>
            </Button>

            {/* Divider */}
            <div className="my-6 flex items-center gap-3">
              <div className="h-[1px] flex-1 bg-white/10" />
              <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                Or continue with email
              </span>
              <div className="h-[1px] flex-1 bg-white/10" />
            </div>

            {/* Credentials Form */}
            <form onSubmit={handleCredentialsSubmit} className="space-y-4">
              <AnimatePresence initial={false}>
                {mode === "signup" && (
                  <motion.div
                    key="name-field"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.22 }}
                    className="overflow-hidden"
                  >
                    <label className="mb-1.5 block text-xs font-semibold text-foreground/90">
                      Full Name
                    </label>
                    <div className="relative">
                      <UserIcon className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Al Amin Islam"
                        required={mode === "signup"}
                        className="h-11 w-full rounded-xl border border-white/15 bg-black/50 pl-10 pr-4 text-sm text-white placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/25 transition-all"
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-foreground/90">
                  Email Address
                </label>
                <div className="relative">
                  <MailIcon className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    className="h-11 w-full rounded-xl border border-white/15 bg-black/50 pl-10 pr-4 text-sm text-white placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/25 transition-all"
                  />
                </div>
              </div>

              <div>
                <div className="mb-1.5 flex items-center justify-between">
                  <label className="text-xs font-semibold text-foreground/90">
                    Password
                  </label>
                  {mode === "login" && (
                    <span className="text-[11px] text-primary/90">
                      Min. 6 characters
                    </span>
                  )}
                </div>
                <div className="relative">
                  <LockIcon className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    minLength={6}
                    className="h-11 w-full rounded-xl border border-white/15 bg-black/50 pl-10 pr-11 text-sm text-white placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/25 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-white cursor-pointer"
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <EyeOffIcon className="size-4" />
                    ) : (
                      <EyeIcon className="size-4" />
                    )}
                  </button>
                </div>

                {/* Password Strength Meter in Sign Up Mode */}
                {mode === "signup" && password.length > 0 && (
                  <div className="mt-2 space-y-1">
                    <div className="grid grid-cols-4 gap-1.5">
                      {[1, 2, 3, 4].map((level) => (
                        <div
                          key={level}
                          className={`h-1 rounded-full transition-all duration-300 ${
                            strength >= level
                              ? strengthColors[strength]
                              : "bg-white/10"
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-right text-[10px] font-medium text-muted-foreground">
                      Password strength:{" "}
                      <span className="text-white">{strengthLabels[strength]}</span>
                    </p>
                  </div>
                )}
              </div>

              {/* Perks Banner in Sign Up mode */}
              {mode === "signup" && (
                <div className="rounded-xl border border-primary/25 bg-primary/10 p-3 text-xs text-foreground/90">
                  <div className="flex items-center gap-2 font-semibold text-primary">
                    <CheckCircle2Icon className="size-4 shrink-0" />
                    <span>Starter Free Plan Included</span>
                  </div>
                  <p className="mt-1 text-[11px] text-muted-foreground">
                    Get 3 free AI image transformations immediately + unlimited BYOK API key support.
                  </p>
                </div>
              )}

              <Button
                type="submit"
                disabled={isSubmitting || isGoogleLoading}
                className="mt-2 h-12 w-full rounded-2xl bg-gradient-to-r from-primary via-orange-500 to-amber-500 text-sm font-bold text-black shadow-[0_8px_30px_rgba(255,110,20,0.4)] transition-all duration-300 hover:scale-[1.01] hover:shadow-[0_12px_36px_rgba(255,110,20,0.6)] cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Loader2Icon className="mr-2 size-4 animate-spin" />
                    <span>
                      {mode === "login" ? "Signing in..." : "Creating account..."}
                    </span>
                  </>
                ) : (
                  <span className="inline-flex items-center gap-2">
                    <span>
                      {mode === "login"
                        ? "Sign In to Studio"
                        : "Create Free Account"}
                    </span>
                    <ArrowRightIcon className="size-4" />
                  </span>
                )}
              </Button>
            </form>

            {/* Switch Mode Prompt */}
            <p className="mt-6 text-center text-xs text-muted-foreground">
              {mode === "login" ? (
                <>
                  Don&apos;t have an account yet?{" "}
                  <button
                    type="button"
                    onClick={() => setMode("signup")}
                    className="font-bold text-primary hover:underline cursor-pointer"
                  >
                    Create free account
                  </button>
                </>
              ) : (
                <>
                  Already have an Aura Studio account?{" "}
                  <button
                    type="button"
                    onClick={() => setMode("login")}
                    className="font-bold text-primary hover:underline cursor-pointer"
                  >
                    Sign in here
                  </button>
                </>
              )}
            </p>

            {/* Security Trust Badges */}
            <div className="mt-7 flex items-center justify-center gap-4 border-t border-white/10 pt-5 text-[11px] text-muted-foreground">
              <span className="inline-flex items-center gap-1">
                <ShieldCheckIcon className="size-3.5 text-emerald-400" />
                256-Bit SSL
              </span>
              <span>•</span>
              <span>OAuth 2.0 Verified</span>
              <span>•</span>
              <span>Privacy Protected</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
