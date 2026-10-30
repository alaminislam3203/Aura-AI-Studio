"use client";

import Link from "next/link";
import { motion } from "motion/react";
import {
  ArrowRightIcon,
  CheckCircle2Icon,
  DownloadIcon,
  ImagePlusIcon,
  Maximize2Icon,
  ScissorsIcon,
  SlidersHorizontalIcon,
  SparklesIcon,
  TypeIcon,
  Wand2Icon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { HOW_IT_WORKS_STEPS } from "@/lib/constants";

export function HowItWorksSection() {
  return (
    <section
      id="how-it-works"
      className="section-shell relative mt-6 overflow-hidden px-5 py-16 sm:px-8 sm:py-20 lg:px-12"
    >
      {/* Ambient background glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 size-[32rem] rounded-full bg-primary/10 blur-[140px] -z-10" />

      <div className="relative z-10 mx-auto max-w-7xl">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto max-w-3xl text-center"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary backdrop-blur-md">
            <SparklesIcon className="size-3.5 text-primary" />
            <span className="uppercase tracking-widest text-[11px]">Streamlined Workflow</span>
          </div>

          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-white sm:text-5xl leading-tight">
            From raw capture to{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-orange-400 to-amber-300">
              production ready.
            </span>
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-base text-muted-foreground leading-relaxed sm:text-lg">
            A transparent three-step pipeline engineered for sub-pixel precision, real-time comparison, and lossless 4K export.
          </p>
        </motion.div>

        {/* 3 Step Pipeline Cards */}
        <div className="mt-14 grid gap-6 md:grid-cols-3 lg:gap-8">
          {/* Card 1: Upload */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            whileHover={{ y: -8, transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] } }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="group relative flex flex-col justify-between rounded-[2rem] border border-white/10 bg-card/40 p-6 sm:p-8 backdrop-blur-2xl transition-all duration-500 hover:border-primary/50 hover:shadow-[0_25px_70px_rgba(0,0,0,0.95),0_0_50px_rgba(255,90,20,0.22)] overflow-hidden"
          >
            {/* Top specular highlight edge line - glows golden on hover */}
            <div className="absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-amber-400 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 pointer-events-none" />
            <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none group-hover:opacity-0 transition-opacity duration-300" />

            {/* Ambient warm corner glow on hover */}
            <div className="pointer-events-none absolute -right-10 -top-10 size-40 rounded-full bg-primary/20 blur-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

            <div>
              {/* Step & Icon Header */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold tracking-widest uppercase text-primary/90 rounded-full border border-primary/20 bg-primary/10 px-2.5 py-1 transition-all duration-300 group-hover:border-primary/50 group-hover:bg-primary/20 group-hover:text-amber-300">
                  Step 01
                </span>
                <div className="flex size-11 items-center justify-center rounded-xl bg-primary/15 border border-primary/25 text-primary shadow-sm transition-all duration-500 group-hover:scale-110 group-hover:border-primary/60 group-hover:bg-primary/25 group-hover:text-amber-300 group-hover:shadow-[0_0_24px_rgba(255,90,20,0.45)]">
                  <ImagePlusIcon className="size-5" />
                </div>
              </div>

              <h3 className="mt-5 text-xl font-bold tracking-tight text-white transition-colors duration-300 group-hover:text-white">
                {HOW_IT_WORKS_STEPS[0].title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {HOW_IT_WORKS_STEPS[0].body}
              </p>
            </div>

            {/* Visual Micro-UI Demonstration */}
            <div className="mt-8 rounded-2xl border border-white/10 bg-black/40 p-4 relative overflow-hidden transition-colors duration-500 group-hover:border-primary/30">
              {/* Soft upload dropzone */}
              <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-primary/30 bg-primary/[0.03] py-5 px-3 text-center transition-all duration-500 group-hover:border-primary/60 group-hover:bg-primary/[0.08]">
                <div className="flex size-10 items-center justify-center rounded-full bg-primary/20 text-primary mb-2 shadow-inner transition-all duration-300 group-hover:scale-110 group-hover:bg-primary/30 group-hover:text-amber-300">
                  <ImagePlusIcon className="size-5" />
                </div>
                <p className="text-xs font-semibold text-white/90">Drop file or browse</p>
                <div className="mt-2 flex items-center gap-1.5 text-[10px] text-muted-foreground font-mono">
                  <span className="rounded bg-white/5 px-1.5 py-0.5 border border-white/10 group-hover:border-primary/30 transition-colors">PNG</span>
                  <span className="rounded bg-white/5 px-1.5 py-0.5 border border-white/10 group-hover:border-primary/30 transition-colors">JPG</span>
                  <span className="rounded bg-white/5 px-1.5 py-0.5 border border-white/10 group-hover:border-primary/30 transition-colors">WEBP</span>
                  <span>• 25MB Max</span>
                </div>
              </div>

              {/* Ingested Status Pill */}
              <div className="mt-3 flex items-center justify-between rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-xs transition-colors duration-300 group-hover:border-primary/30">
                <div className="flex items-center gap-2 truncate">
                  <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="truncate font-mono text-[11px] text-zinc-300">sample_portrait.png</span>
                </div>
                <span className="text-[10px] font-semibold text-emerald-400 shrink-0 ml-2">Ready</span>
              </div>
            </div>
          </motion.div>

          {/* Card 2: Select Tool */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            whileHover={{ y: -8, transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] } }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="group relative flex flex-col justify-between rounded-[2rem] border border-primary/40 bg-card/75 p-6 sm:p-8 shadow-[0_20px_60px_rgba(0,0,0,0.7),0_0_40px_rgba(255,90,20,0.18)] backdrop-blur-2xl transition-all duration-500 hover:border-primary hover:shadow-[0_25px_70px_rgba(0,0,0,0.95),0_0_60px_rgba(255,90,20,0.35)] overflow-hidden"
          >
            {/* Top specular amber edge line */}
            <div className="absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-amber-400 to-transparent pointer-events-none transition-opacity duration-500 opacity-80 group-hover:opacity-100" />

            {/* Ambient warm corner glow on hover */}
            <div className="pointer-events-none absolute -right-10 -top-10 size-40 rounded-full bg-primary/25 blur-3xl opacity-50 transition-opacity duration-500 group-hover:opacity-100" />

            <div>
              {/* Step & Icon Header */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold tracking-widest uppercase text-amber-300 rounded-full border border-amber-400/30 bg-amber-400/10 px-2.5 py-1 transition-all duration-300 group-hover:border-amber-400/60 group-hover:bg-amber-400/20 group-hover:text-amber-200">
                  Step 02
                </span>
                <div className="flex size-11 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-orange-500 text-white shadow-md transition-all duration-500 group-hover:scale-110 group-hover:shadow-[0_0_24px_rgba(255,90,20,0.55)]">
                  <Wand2Icon className="size-5" />
                </div>
              </div>

              <h3 className="mt-5 text-xl font-bold tracking-tight text-white transition-colors duration-300 group-hover:text-white">
                {HOW_IT_WORKS_STEPS[1].title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {HOW_IT_WORKS_STEPS[1].body}
              </p>
            </div>

            {/* Visual Micro-UI Demonstration (The 4 Real Aura AI Tools) */}
            <div className="mt-8 grid grid-cols-2 gap-2">
              {/* Tool 1: Cutout (Active) */}
              <div className="flex flex-col justify-between rounded-xl border border-primary/50 bg-primary/15 p-2.5 shadow-sm transition-all duration-300 group-hover:border-primary group-hover:shadow-[0_0_16px_rgba(255,90,20,0.25)]">
                <div className="flex items-center justify-between">
                  <ScissorsIcon className="size-4 text-primary" />
                  <span className="text-[9px] font-bold uppercase tracking-wider text-amber-300">Active</span>
                </div>
                <div className="mt-2">
                  <p className="text-xs font-bold text-white">Cutout BG</p>
                  <p className="text-[10px] text-zinc-400">Sub-pixel edge</p>
                </div>
              </div>

              {/* Tool 2: Scene Replacer */}
              <div className="flex flex-col justify-between rounded-xl border border-white/10 bg-white/[0.03] p-2.5 hover:border-primary/50 hover:bg-white/[0.08] hover:scale-[1.03] transition-all duration-200 cursor-pointer">
                <div className="flex items-center justify-between">
                  <SparklesIcon className="size-4 text-zinc-400" />
                  <span className="text-[9px] font-semibold text-zinc-500">GenAI</span>
                </div>
                <div className="mt-2">
                  <p className="text-xs font-semibold text-zinc-200">Scene Gen</p>
                  <p className="text-[10px] text-zinc-400">Prompt studio</p>
                </div>
              </div>

              {/* Tool 3: 4K Upscale */}
              <div className="flex flex-col justify-between rounded-xl border border-white/10 bg-white/[0.03] p-2.5 hover:border-primary/50 hover:bg-white/[0.08] hover:scale-[1.03] transition-all duration-200 cursor-pointer">
                <div className="flex items-center justify-between">
                  <Maximize2Icon className="size-4 text-zinc-400" />
                  <span className="text-[9px] font-semibold text-zinc-500">4K HD</span>
                </div>
                <div className="mt-2">
                  <p className="text-xs font-semibold text-zinc-200">AI Upscale</p>
                  <p className="text-[10px] text-zinc-400">2x & 4x super-res</p>
                </div>
              </div>

              {/* Tool 4: Watermark */}
              <div className="flex flex-col justify-between rounded-xl border border-white/10 bg-white/[0.03] p-2.5 hover:border-primary/50 hover:bg-white/[0.08] hover:scale-[1.03] transition-all duration-200 cursor-pointer">
                <div className="flex items-center justify-between">
                  <TypeIcon className="size-4 text-zinc-400" />
                  <span className="text-[9px] font-semibold text-zinc-500">Overlay</span>
                </div>
                <div className="mt-2">
                  <p className="text-xs font-semibold text-zinc-200">Watermark</p>
                  <p className="text-[10px] text-zinc-400">Custom branding</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Card 3: Inspect & Export */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            whileHover={{ y: -8, transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] } }}
            transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="group relative flex flex-col justify-between rounded-[2rem] border border-white/10 bg-card/40 p-6 sm:p-8 backdrop-blur-2xl transition-all duration-500 hover:border-primary/50 hover:shadow-[0_25px_70px_rgba(0,0,0,0.95),0_0_50px_rgba(255,90,20,0.22)] overflow-hidden"
          >
            {/* Top specular highlight edge line - glows golden on hover */}
            <div className="absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-amber-400 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 pointer-events-none" />
            <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none group-hover:opacity-0 transition-opacity duration-300" />

            {/* Ambient warm corner glow on hover */}
            <div className="pointer-events-none absolute -right-10 -top-10 size-40 rounded-full bg-primary/20 blur-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

            <div>
              {/* Step & Icon Header */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold tracking-widest uppercase text-primary/90 rounded-full border border-primary/20 bg-primary/10 px-2.5 py-1 transition-all duration-300 group-hover:border-primary/50 group-hover:bg-primary/20 group-hover:text-amber-300">
                  Step 03
                </span>
                <div className="flex size-11 items-center justify-center rounded-xl bg-primary/15 border border-primary/25 text-primary shadow-sm transition-all duration-500 group-hover:scale-110 group-hover:border-primary/60 group-hover:bg-primary/25 group-hover:text-amber-300 group-hover:shadow-[0_0_24px_rgba(255,90,20,0.45)]">
                  <SlidersHorizontalIcon className="size-5" />
                </div>
              </div>

              <h3 className="mt-5 text-xl font-bold tracking-tight text-white transition-colors duration-300 group-hover:text-white">
                {HOW_IT_WORKS_STEPS[2].title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {HOW_IT_WORKS_STEPS[2].body}
              </p>
            </div>

            {/* Visual Micro-UI Demonstration (Split Comparison & Lossless Export) */}
            <div className="mt-8 rounded-2xl border border-white/10 bg-black/40 p-3.5 relative overflow-hidden transition-colors duration-500 group-hover:border-primary/30">
              {/* Mini Split Canvas Mockup */}
              <div className="relative h-20 w-full overflow-hidden rounded-xl border border-white/10 flex transition-colors duration-300 group-hover:border-primary/30">
                {/* Left side: Original */}
                <div className="w-1/2 bg-gradient-to-br from-zinc-800 to-zinc-900 flex items-center justify-center relative">
                  <span className="absolute left-2 top-2 text-[9px] font-mono uppercase bg-black/70 px-1.5 py-0.5 rounded text-zinc-400">
                    Original
                  </span>
                </div>
                {/* Divider Line with dynamic glow */}
                <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-[2px] bg-primary shadow-[0_0_10px_#ff5a14] z-10 flex items-center justify-center transition-all duration-300 group-hover:shadow-[0_0_18px_#ff5a14]">
                  <div className="size-4 rounded-full bg-primary text-black flex items-center justify-center text-[8px] font-bold shadow-md transition-transform duration-300 group-hover:scale-125">
                    ↔
                  </div>
                </div>
                {/* Right side: Transparent Cutout Result */}
                <div className="w-1/2 bg-[radial-gradient(#ffffff12_1px,transparent_1px)] [background-size:8px_8px] bg-card flex items-center justify-center relative">
                  <span className="absolute right-2 top-2 text-[9px] font-mono uppercase bg-primary/20 border border-primary/30 px-1.5 py-0.5 rounded text-primary">
                    Cutout 4K
                  </span>
                </div>
              </div>

              {/* Export Info & Action */}
              <div className="mt-3 flex items-center justify-between rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-xs transition-colors duration-300 group-hover:border-primary/30">
                <div className="flex items-center gap-1.5 text-zinc-300">
                  <CheckCircle2Icon className="size-3.5 text-emerald-400" />
                  <span className="text-[11px] font-medium">Lossless PNG Export</span>
                </div>
                <span className="inline-flex items-center gap-1 rounded bg-primary/20 px-2 py-0.5 text-[10px] font-bold text-primary transition-all duration-300 group-hover:bg-primary group-hover:text-black">
                  <DownloadIcon className="size-3" />
                  <span>4K Ready</span>
                </span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Quick Action Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.6, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.02] p-5 sm:p-6 backdrop-blur-xl"
        >
          <div className="flex items-center gap-3 text-center sm:text-left">
            <div className="flex size-3 relative">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex size-3 rounded-full bg-emerald-500" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Experience the full pipeline in real time</p>
              <p className="text-xs text-muted-foreground">Test background removal, upscaling, and generative replacement with 3 free trial credits.</p>
            </div>
          </div>

          <Button
            asChild
            className="rounded-full bg-gradient-to-r from-primary via-orange-500 to-amber-500 h-10 sm:h-11 px-4 sm:px-6 text-xs sm:text-sm font-semibold text-white shadow-[0_4px_20px_rgba(255,90,20,0.35)] transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_6px_28px_rgba(255,90,20,0.6)] cursor-pointer shrink-0"
          >
            <Link href="/playground" className="inline-flex items-center gap-2">
              <span>Open AI Playground</span>
              <ArrowRightIcon className="size-4" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
