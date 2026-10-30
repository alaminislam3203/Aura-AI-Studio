"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpIcon, CheckCircle2Icon, SparklesIcon } from "lucide-react";

export function Footer() {
  const year = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative mt-12 overflow-hidden rounded-[2.25rem] border border-white/10 bg-card/40 px-6 py-12 backdrop-blur-2xl sm:px-10 sm:py-16 lg:px-14">
      {/* Top subtle specular edge highlight */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />

      {/* Ambient warm corner glow */}
      <div className="pointer-events-none absolute -bottom-16 -right-16 size-64 rounded-full bg-primary/10 blur-[100px] -z-10" />

      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-[1.3fr_0.9fr_0.9fr_0.9fr] lg:gap-12">
          {/* Brand & Overview Column */}
          <div className="flex flex-col justify-between">
            <div>
              <Link href="/" className="inline-flex items-center gap-3 group">
                <span className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-visible">
                  <Image
                    src="/logo.png"
                    alt="Aura Studio"
                    width={72}
                    height={72}
                    className="h-10 w-10 max-h-none max-w-none origin-left scale-[1.5] object-cover transition-transform duration-300 group-hover:scale-[1.6]"
                  />
                </span>
                <div>
                  <span className="block text-base font-bold tracking-tight text-white group-hover:text-primary transition-colors">
                    Aura Studio
                  </span>
                  <span className="block text-[11px] font-semibold uppercase tracking-wider text-primary">
                    AI Vision Engine
                  </span>
                </div>
              </Link>

              <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
                High-precision neural studio for automated background isolation, generative scene replacement, 4K upscaling, and dynamic branding.
              </p>
            </div>


          </div>

          {/* Column 1: AI Tools */}
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-white/90">
              AI Tools
            </p>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <Link
                  href="/playground"
                  className="text-muted-foreground transition-colors hover:text-primary inline-flex items-center gap-1.5"
                >
                  <span>Background Cutout</span>
                  <span className="rounded bg-primary/15 border border-primary/25 px-1.5 py-0.2 text-[9px] font-semibold text-primary">Fast</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/playground"
                  className="text-muted-foreground transition-colors hover:text-primary"
                >
                  AI Scene Generator
                </Link>
              </li>
              <li>
                <Link
                  href="/playground"
                  className="text-muted-foreground transition-colors hover:text-primary"
                >
                  4K Super-Resolution
                </Link>
              </li>
              <li>
                <Link
                  href="/playground"
                  className="text-muted-foreground transition-colors hover:text-primary"
                >
                  Watermark Studio
                </Link>
              </li>
              <li>
                <Link
                  href="/playground"
                  className="text-muted-foreground transition-colors hover:text-primary"
                >
                  Dual-Canvas Split View
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Platform */}
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-white/90">
              Platform
            </p>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <Link
                  href="/playground"
                  className="text-muted-foreground transition-colors hover:text-primary"
                >
                  AI Playground
                </Link>
              </li>
              <li>
                <Link
                  href="#how-it-works"
                  className="text-muted-foreground transition-colors hover:text-primary"
                >
                  How It Works
                </Link>
              </li>
              <li>
                <Link
                  href="#styles"
                  className="text-muted-foreground transition-colors hover:text-primary"
                >
                  Quality Benchmarks
                </Link>
              </li>
              <li>
                <Link
                  href="#pricing"
                  className="text-muted-foreground transition-colors hover:text-primary inline-flex items-center gap-1.5"
                >
                  <span>Pricing Plans</span>
                  <span className="rounded bg-white/5 border border-white/10 px-1.5 py-0.2 text-[9px] text-zinc-400">Free Trial</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Trust & Privacy */}
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-white/90">
              Privacy & Trust
            </p>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li className="flex items-center gap-2 text-muted-foreground">
                <CheckCircle2Icon className="size-3.5 text-emerald-400 shrink-0" />
                <span>Zero Image Retention</span>
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <CheckCircle2Icon className="size-3.5 text-emerald-400 shrink-0" />
                <span>Lossless 4K PNG Export</span>
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <CheckCircle2Icon className="size-3.5 text-emerald-400 shrink-0" />
                <span>Encrypted Cloud Pipeline</span>
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <CheckCircle2Icon className="size-3.5 text-emerald-400 shrink-0" />
                <span>Commercial Usage Rights</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom divider & Legal / Copyright Bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 sm:flex-row text-xs text-muted-foreground">
          <p>© {year} Aura Studio. Built for creators, designers, and high-performance teams.</p>

          <div className="flex items-center gap-6">
            <button
              onClick={scrollToTop}
              className="group inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-white transition-colors cursor-pointer"
            >
              <span>Back to top</span>
              <ArrowUpIcon className="size-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 text-primary" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
