"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { GALLERY_IMAGES, GALLERY_STATS, HIGHLIGHTS, SHOWCASE_BG_VIDEO_SRC } from "@/lib/constants";
import { ArrowRightIcon, CheckCircle2Icon, SparklesIcon } from "lucide-react";

const FEATURE_TAGS: Record<string, { badge: string; desc: string }> = {
  "AI Background Remove": { badge: "0.8s Fast", desc: "Sub-pixel edges" },
  "AI Upscale 2x": { badge: "4K Detail", desc: "Micro-texture restore" },
  "Change Background": { badge: "GenAI", desc: "Lighting blend" },
  "Text Watermark": { badge: "Pro", desc: "Dynamic branding" },
};

function InteractiveGalleryCard({
  image,
  index,
}: {
  image: (typeof GALLERY_IMAGES)[number];
  index: number;
}) {
  const [isHovered, setIsHovered] = useState(false);

  const tagLabels = [
    "Background Cutout",
    "AI Scene Replace",
    "4K Detail Upscaled",
    "Dynamic Watermark",
  ];
  const tagLabel = tagLabels[index % tagLabels.length];

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`group relative rounded-2xl sm:rounded-[1.8rem] p-[1.5px] transition-all duration-500 ${
        index % 2 === 1 ? "translate-y-3 sm:translate-y-6" : ""
      }`}
    >
      {/* Subtle border outline with smooth hover tint */}
      <div className="pointer-events-none absolute inset-0 rounded-2xl sm:rounded-[1.8rem] border border-white/10 group-hover:border-primary/40 transition-colors duration-300" />

      {/* Inner Image Container */}
      <div className="relative overflow-hidden rounded-[calc(1rem-1.5px)] sm:rounded-[calc(1.8rem-1.5px)] bg-card shadow-lg">
        {/* Subtle dark vignette overlay */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-black/20 z-10 opacity-70 group-hover:opacity-30 transition-opacity duration-500" />

        {/* 2. Ultra-Smooth Neural Laser Scan Line on Hover */}
        {isHovered && (
          <motion.div
            initial={{ top: "-15%", opacity: 0 }}
            animate={{ top: "115%", opacity: [0, 1, 1, 0.9, 0] }}
            transition={{
              duration: 1.5,
              ease: [0.22, 1, 0.36, 1],
              repeat: Infinity,
              repeatDelay: 1.1,
            }}
            className="pointer-events-none absolute inset-x-0 z-20 flex flex-col"
          >
            {/* Trailing soft laser glow haze */}
            <div className="h-10 w-full bg-gradient-to-b from-transparent via-amber-500/15 to-transparent blur-[2px]" />
            {/* Intense precision laser beam line */}
            <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-amber-200 to-transparent shadow-[0_0_10px_#ff9500,0_0_20px_#ff5a14]" />
          </motion.div>
        )}

        {/* The Image */}
        <Image
          src={image.src}
          alt={image.alt}
          width={900}
          height={1200}
          className="h-full w-full object-cover aspect-[3/4] transition-transform duration-700 ease-out group-hover:scale-[1.035]"
          priority={index < 2}
        />

        {/* Bottom Floating Feature Pill */}
        <div className="absolute inset-x-2.5 bottom-2.5 sm:inset-x-3 sm:bottom-3 z-20 flex items-center justify-between pointer-events-none">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-black/75 px-2.5 py-1 text-[10px] sm:text-xs font-medium text-white/95 shadow-[0_4px_16px_rgba(0,0,0,0.6)] backdrop-blur-xl opacity-80 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-300 sm:translate-y-1 sm:group-hover:translate-y-0">
            <span>{tagLabel}</span>
          </div>

          <div className="hidden sm:inline-flex size-6 items-center justify-center rounded-full border border-white/20 bg-black/75 text-white/80 shadow-md backdrop-blur-xl opacity-0 group-hover:opacity-100 transition-all duration-300">
            <ArrowRightIcon className="size-3 text-primary group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function GalleryShowcaseSection() {
  return (
    <section
      id="styles"
      className="section-shell relative mt-6 overflow-hidden px-5 py-14 sm:px-8 sm:py-18 lg:px-12 lg:py-20"
    >
      <video
        className="hero-video pointer-events-none absolute inset-0 z-0 h-full w-full object-cover object-center"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        aria-hidden
      >
        <source src={SHOWCASE_BG_VIDEO_SRC} type="video/mp4" />
      </video>
      <div
        className="showcase-surface pointer-events-none absolute inset-0 z-1"
        aria-hidden="true"
      />
      <div
        className="showcase-pattern pointer-events-none absolute inset-0 z-2 opacity-70"
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <div className="showcase-panel relative overflow-hidden rounded-[2rem] border border-white/15 bg-gradient-to-b from-card/85 via-card/70 to-card/50 p-6 sm:p-8 lg:p-10 backdrop-blur-2xl shadow-[0_24px_60px_rgba(0,0,0,0.8),0_0_40px_rgba(255,90,20,0.1)]">
          {/* Specular top border light */}
          <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none z-20" />
          <div className="showcase-glow absolute -left-14 top-8 size-48 rounded-full blur-3xl bg-primary/20 pointer-events-none" />

          <div className="relative z-10">
            {/* Top Interactive Feature Modules Grid */}
            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4 sm:gap-3">
              {HIGHLIGHTS.map((item) => {
                const Icon = item.icon;
                const meta = FEATURE_TAGS[item.label] || { badge: "AI Core", desc: "Instant tool" };

                return (
                  <Link
                    key={item.label}
                    href="/playground"
                    className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-3 sm:p-3.5 transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:bg-white/[0.07] hover:shadow-[0_10px_25px_rgba(255,90,20,0.18)] backdrop-blur-md"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 via-orange-500/15 to-transparent text-primary border border-primary/25 shadow-sm transition-transform duration-300 group-hover:scale-110 group-hover:text-amber-300">
                        <Icon className="size-4" />
                      </div>
                      <span className="rounded-md border border-white/10 bg-white/5 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-zinc-400 group-hover:border-primary/30 group-hover:text-primary transition-colors">
                        {meta.badge}
                      </span>
                    </div>

                    <div className="mt-3">
                      <p className="text-xs font-semibold tracking-tight text-white/95 group-hover:text-primary transition-colors">
                        {item.label}
                      </p>
                      <p className="mt-0.5 text-[10px] text-zinc-400 line-clamp-1">
                        {meta.desc}
                      </p>
                    </div>

                    {/* Subtle corner light sheen on hover */}
                    <div className="absolute -right-8 -top-8 size-16 rounded-full bg-primary/20 blur-xl opacity-0 transition-opacity duration-300 group-hover:opacity-100 pointer-events-none" />
                  </Link>
                );
              })}
            </div>

            {/* Typography & Value Proposition */}
            <div className="mt-8 sm:mt-10">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary backdrop-blur-md">
                <SparklesIcon className="size-3.5 text-primary" />
                <span className="uppercase tracking-widest text-[10px] sm:text-[11px]">AI Precision Vision Engine</span>
              </div>

              <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-[3.25rem] leading-[1.08]">
                Transform <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-orange-400 to-amber-300">photos</span>
                <br />
                <span
                  style={{ fontFamily: 'Georgia, "Merriweather", "Times New Roman", serif' }}
                  className="italic font-normal text-white/95"
                >
                  with surgical precision.
                </span>
              </h2>

              <p className="mt-4 max-w-xl text-sm sm:text-base leading-relaxed text-muted-foreground font-normal">
                Isolate intricate hair and edges with sub-pixel edge detection, synthesize photorealistic neural backgrounds, upscale textures without blur, and stamp dynamic branding.
              </p>

              {/* Capability feature chips - clean, realistic developer/creator features */}
              <div className="mt-5 flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[11px] font-medium text-zinc-300">
                  <CheckCircle2Icon className="size-3 text-emerald-400" /> Sub-Pixel Alpha Masking
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[11px] font-medium text-zinc-300">
                  <CheckCircle2Icon className="size-3 text-amber-400" /> Dual-Canvas Real-Time Split
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[11px] font-medium text-zinc-300">
                  <CheckCircle2Icon className="size-3 text-primary" /> Lossless 4K PNG Export
                </span>
              </div>
            </div>

            {/* Technical Specifications Bar (Responsive benchmarks) */}
            <div className="mt-8 grid grid-cols-3 gap-2 sm:gap-4 rounded-2xl border border-white/10 bg-white/[0.02] p-3 sm:p-5 backdrop-blur-xl">
              {GALLERY_STATS.map((stat, idx) => (
                <div
                  key={stat.label}
                  className={`flex min-w-0 flex-col justify-center space-y-0.5 sm:space-y-1 text-center sm:text-left ${
                    idx !== 0 ? "border-l border-white/10 pl-2 sm:pl-4 lg:pl-6" : ""
                  }`}
                >
                  <p className="truncate text-base xs:text-lg sm:text-2xl lg:text-3xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-primary to-amber-400">
                    {stat.value}
                  </p>
                  <p className="text-[9px] xs:text-[10px] sm:text-xs font-semibold uppercase tracking-tight sm:tracking-wider text-muted-foreground leading-tight break-words sm:whitespace-nowrap">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>

            {/* Sleek Action & Proof Bar */}
            <div className="mt-8 flex flex-wrap items-center justify-between gap-3 pt-5 border-t border-white/10">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                </span>
                <span>Instant Cloud Engine • Free Credits Included</span>
              </div>

              <Link
                href="/playground"
                prefetch={false}
                className="group inline-flex items-center gap-1.5 text-xs font-semibold text-white/90 hover:text-primary transition-colors cursor-pointer"
              >
                <span>Try in Playground</span>
                <ArrowRightIcon className="size-3.5 text-primary transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>

        <motion.div
          animate={{ y: [0, -16, 0] }}
          transition={{ duration: 7.5, repeat: Infinity, ease: "easeInOut" }}
          className="showcase-frame relative rounded-[2.25rem] border border-border/60 p-3 sm:p-5"
        >
          {/* 2 items in a row on mobile, masonry stagger */}
          <div className="grid grid-cols-2 gap-2.5 sm:gap-4">
            {GALLERY_IMAGES.map((image, index) => (
              <InteractiveGalleryCard key={image.src} image={image} index={index} />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
