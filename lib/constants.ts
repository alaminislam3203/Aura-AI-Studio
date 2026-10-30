import type { LucideIcon } from "lucide-react";
import {
  CameraIcon,
  ImagePlusIcon,
  LayersIcon,
  Maximize2Icon,
  PaletteIcon,
  ScissorsIcon,
  SparklesIcon,
  TypeIcon,
  Wand2Icon,
  ZapIcon,
} from "lucide-react";

/** MIME types accepted for user source images */
export const ACCEPTED_SOURCE_IMAGE_MIME_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

export const HIGHLIGHTS: { label: string; icon: LucideIcon }[] = [
  { label: "AI Background Remove", icon: ScissorsIcon },
  { label: "AI Upscale 2x", icon: Maximize2Icon },
  { label: "Change Background", icon: SparklesIcon },
  { label: "Text Watermark", icon: TypeIcon },
];

export const GALLERY_STATS = [
  { value: "< 1.0s", label: "Execution speed" },
  { value: "4K UHD", label: "Max resolution" },
  { value: "100%", label: "Lossless quality" },
] as const;

export const GALLERY_IMAGES = [
  { src: "/1.webp", alt: "Stylized portrait with background removed" },
  { src: "/2.png", alt: "AI scene replacement result" },
  { src: "/3.jpg", alt: "Super-upscaled macro details" },
  { src: "/gallery-1.png", alt: "Watermarked studio branding" },
] as const;

export const HERO_VIDEO_SRC = "https://ik.imagekit.io/gcunh6w0m/hero.mp4";

export const SHOWCASE_BG_VIDEO_SRC =
  "https://ik.imagekit.io/gcunh6w0m/kling_20260321_%E4%BD%9C%E5%93%81_shot_1_5s__55_0%20(1).mp4";

export const CENTER_NAV_LINKS: { label: string; href: string; hasDropdown?: boolean }[] = [
  { label: "Home", href: "/" },
  { label: "Playground", href: "/playground" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Pricing", href: "#pricing" },
];

export const FOOTER_QUICK_LINKS = [
  { label: "Home", href: "/" },
  { label: "AI Playground", href: "/playground" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Pricing", href: "#pricing" },
] as const;

export const FEATURED_STYLES = [
  "Background Removal",
  "Scene Replacement",
  "AI Super Upscale",
  "Watermark Studio",
] as const;

export const WORKFLOW_STYLE_PREVIEW = [
  FEATURED_STYLES[0],
  FEATURED_STYLES[1],
  FEATURED_STYLES[2],
] as const;

export type MarketingTestimonial = {
  text: string;
  image: string;
  name: string;
  role: string;
};

export const TESTIMONIALS: MarketingTestimonial[] = [
  {
    text: "The background removal and upscale tools cut our product photography turnaround from hours to seconds.",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
    name: "Briana Patton",
    role: "E-Commerce Director",
  },
  {
    text: "Being able to replace product backgrounds with natural studio lighting via prompt is a complete game changer.",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
    name: "Bilal Ahmed",
    role: "Creative Lead",
  },
  {
    text: "The interactive split-comparison canvas makes it effortless to verify edge detection before downloading.",
    image:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=200&q=80",
    name: "Saman Malik",
    role: "Brand Designer",
  },
  {
    text: "Crisp 2x super-resolution and instantaneous cloud processing without installing heavy desktop software.",
    image:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80",
    name: "Omar Raza",
    role: "Digital Artist",
  },
  {
    text: "We integrated Aura Studio into our daily visual asset workflow. The speed and quality are unmatched.",
    image:
      "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=200&q=80",
    name: "Zainab Hussain",
    role: "Agency Founder",
  },
  {
    text: "The watermark overlay feature protects all our client proofs seamlessly before final sign-off.",
    image:
      "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=200&q=80",
    name: "Aliza Khan",
    role: "Commercial Photographer",
  },
  {
    text: "It gave our team a cleaner way to isolate subjects without losing hair strands or soft transparency.",
    image:
      "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?auto=format&fit=crop&w=200&q=80",
    name: "Farhan Siddiqui",
    role: "Head of Marketing",
  },
  {
    text: "The experience feels ultra-premium, intuitive, and blisteringly fast.",
    image:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80",
    name: "Sana Sheikh",
    role: "Product Manager",
  },
  {
    text: "Stripe checkout was instant, and unlimited AI edits on the Pro plan makes this an essential subscription.",
    image:
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80",
    name: "Hassan Ali",
    role: "Senior Full-Stack Engineer",
  },
];

export const TESTIMONIAL_COLUMNS = [
  TESTIMONIALS.slice(0, 3),
  TESTIMONIALS.slice(3, 6),
  TESTIMONIALS.slice(6, 9),
];

export type HowItWorksStep = {
  step: string;
  title: string;
  body: string;
  icon: LucideIcon;
  featured?: boolean;
};

export const HOW_IT_WORKS_STEPS: HowItWorksStep[] = [
  {
    step: "01",
    title: "Upload Any Photo",
    body: "Drop portraits, product shots, or landscapes in PNG, JPG, or WebP up to 25MB. Instant client-side decode with zero pre-compression.",
    icon: ImagePlusIcon,
  },
  {
    step: "02",
    title: "Select AI Transformation",
    body: "Choose sub-pixel background cutout, generative AI scene replacement from prompts, 4K upscaling, or custom watermark overlay.",
    icon: Wand2Icon,
  },
  {
    step: "03",
    title: "Inspect & Lossless Export",
    body: "Compare original and processed images side-by-side with the real-time split slider, then export uncompressed 4K transparent assets.",
    icon: SparklesIcon,
    featured: true,
  },
];
