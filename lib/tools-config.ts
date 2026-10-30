import {
  CropIcon,
  ExpandIcon,
  LayersIcon,
  Maximize2Icon,
  PaletteIcon,
  ScissorsIcon,
  SparklesIcon,
  TypeIcon,
  Wand2Icon,
  ZapIcon,
} from "lucide-react";

export interface StudioTool {
  id: string;
  name: string;
  category: "background" | "enhance" | "overlay";
  description: string;
  icon: any;
  transform: string;
  requiresPrompt?: boolean;
  promptPlaceholder?: string;
  quickPrompts?: string[];
  requiresTextWatermark?: boolean;
  badge?: string;
}

export const STUDIO_TOOLS: StudioTool[] = [
  {
    id: "clarity",
    name: "HDR Clarity & Contrast",
    category: "enhance",
    description: "Dynamic contrast expansion and unsharp mask micro-texture sharpening.",
    icon: ZapIcon,
    transform: "e-contrast,e-usm-2-1-0.05",
    badge: "Ultra HD",
  },
  {
    id: "upscale",
    name: "AI Super Upscale 2x",
    category: "enhance",
    description: "Doubled resolution and reconstructed high-frequency texture details.",
    icon: Maximize2Icon,
    transform: "w-iw_mul_2,q-95,e-sharpen-5",
    badge: "2x HD",
  },
  {
    id: "retouch",
    name: "AI Retouch & Polish",
    category: "enhance",
    description: "Auto-enhance lighting, color balance, vibrancy, and micro-contrast.",
    icon: SparklesIcon,
    transform: "e-contrast,e-usm-1-1-0.05,q-95",
    badge: "Auto Tone",
  },
  {
    id: "sharpen",
    name: "Pro Ultra Sharpen",
    category: "enhance",
    description: "Unveil pin-sharp edges and micro-details from soft or blurry images.",
    icon: Wand2Icon,
    transform: "e-sharpen-10",
    badge: "Crisp",
  },
  {
    id: "noir",
    name: "Cinematic Noir Film",
    category: "enhance",
    description: "Rich monochrome black and white conversion with enhanced tonal dynamic range.",
    icon: PaletteIcon,
    transform: "e-grayscale,e-contrast",
    badge: "Classic",
  },
  {
    id: "sepia",
    name: "Vintage Analog Film",
    category: "enhance",
    description: "Warm golden analog tones reminiscent of classic 35mm film photography.",
    icon: SparklesIcon,
    transform: "e-sepia,e-contrast",
    badge: "Vintage",
  },
  {
    id: "dropshadow",
    name: "Realistic Drop Shadow",
    category: "overlay",
    description: "Generate natural dynamic 3D shadow with realistic blur and offset.",
    icon: LayersIcon,
    transform: "e-shadow",
    badge: "3D Depth",
  },
  {
    id: "vignette",
    name: "Cinematic Vignette Focus",
    category: "overlay",
    description: "Subtly darkens borders to naturally guide attention to the subject.",
    icon: ExpandIcon,
    transform: "e-vignette",
    badge: "Focus",
  },
  {
    id: "avatar",
    name: "Circular Profile Avatar",
    category: "overlay",
    description: "Precision circular mask cutout tailored for social avatars and badges.",
    icon: CropIcon,
    transform: "r-max",
    badge: "Avatar",
  },
  {
    id: "text-watermark",
    name: "Watermark & Text Overlay",
    category: "overlay",
    description: "Stamp customized typography, brand names, or copyrights.",
    icon: TypeIcon,
    transform: "text-overlay",
    requiresTextWatermark: true,
  },
  {
    id: "bg-remove",
    name: "Remove Background",
    category: "background",
    description: "Instant AI background removal with crisp subject edge detection.",
    icon: ScissorsIcon,
    transform: "e-bgremove",
    badge: "AI Cloud",
  },
  {
    id: "bg-remove-pro",
    name: "HD Background Remover",
    category: "background",
    description: "High-precision background removal optimized for hair and fine details.",
    icon: Wand2Icon,
    transform: "e-removedotbg",
    badge: "Pro Detail",
  },
  {
    id: "change-bg",
    name: "Change Background",
    category: "background",
    description: "Replace your background with realistic AI-generated environments.",
    icon: ExpandIcon,
    transform: "e-changebg",
    requiresPrompt: true,
    promptPlaceholder: "e.g., luxury modern minimalist studio with soft warm lighting",
    quickPrompts: [
      "luxury minimalist photography studio with soft shadows",
      "tropical beach with palm trees at golden hour sunset",
      "cyberpunk neon Tokyo alley with reflective wet ground",
      "modern high-end living room with Scandinavian interior",
      "clean aesthetic pastel aesthetic backdrop",
    ],
    badge: "AI Gen",
  },
];
