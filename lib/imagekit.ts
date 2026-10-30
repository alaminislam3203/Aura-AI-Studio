import ImageKit from "@imagekit/nodejs";
import { getUploadAuthParams } from "@imagekit/next/server";

let _client: InstanceType<typeof ImageKit> | null = null;

export function getImageKitServerClient() {
  if (!_client) {
    _client = new ImageKit({
      privateKey: process.env.IMAGEKIT_PRIVATE_KEY || "",
    });
  }
  return _client;
}

export function generateUploadAuth(customPrivateKey?: string, customPublicKey?: string) {
  const privateKey = customPrivateKey || process.env.IMAGEKIT_PRIVATE_KEY || "";
  const publicKey = customPublicKey || process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY || "";

  return getUploadAuthParams({
    privateKey,
    publicKey,
  });
}

export type TransformToolId =
  | "clarity"
  | "upscale"
  | "retouch"
  | "dropshadow"
  | "sharpen"
  | "noir"
  | "vignette"
  | "sepia"
  | "avatar"
  | "text-watermark"
  | "bg-remove"
  | "bg-remove-pro"
  | "change-bg";

export interface TransformOptions {
  prompt?: string;
  watermarkText?: string;
  fontSize?: number;
  fontColor?: string;
  position?: "bottom-right" | "bottom-left" | "top-right" | "top-left" | "center";
  badgeBackground?: boolean;
}

/**
 * Generates the raw ImageKit transformation parameter string for given tool
 */
export function getToolTransformation(toolId: TransformToolId, options?: TransformOptions): string {
  switch (toolId) {
    case "clarity":
      return "e-contrast,e-usm-2-1-0.05";
    case "upscale":
      return "w-iw_mul_2,q-95,e-sharpen-5";
    case "retouch":
      return "e-contrast,e-usm-1-1-0.05,q-95";
    case "dropshadow":
      return "e-shadow-bl-15_st-40_x-10_y-10";
    case "sharpen":
      return "e-sharpen-10";
    case "noir":
      return "e-grayscale,e-contrast";
    case "vignette":
      return "e-vignette,e-contrast";
    case "sepia":
      return "e-sepia,e-contrast";
    case "avatar":
      return "r-max,c-maintain_ratio";
    case "bg-remove":
      return "e-bgremove,f-png";
    case "bg-remove-pro":
      return "e-removedotbg,f-png";
    case "change-bg": {
      const p = options?.prompt?.trim();
      return p ? `e-changebg-prompt-${encodeURIComponent(p)}` : "e-changebg";
    }
    case "text-watermark": {
      const text = options?.watermarkText?.trim() || "Aura AI Studio";
      const size = options?.fontSize || 22;
      const color = (options?.fontColor || "FFFFFF").replace("#", "");
      const pos = options?.position || "bottom-right";
      const withBadge = options?.badgeBackground !== false;

      let posParams = "lx-N30,ly-N30";
      if (pos === "bottom-left") posParams = "lx-30,ly-N30";
      else if (pos === "top-right") posParams = "lx-N30,ly-30";
      else if (pos === "top-left") posParams = "lx-30,ly-30";
      else if (pos === "center") posParams = "";

      const bgParams = withBadge ? "bg-000000B0,pa-10_20,r-16" : "";

      const parts = [
        "l-text",
        `i-${encodeURIComponent(text)}`,
        `fs-${size}`,
        `co-${color}`,
        bgParams,
        posParams,
        "l-end",
      ].filter(Boolean);

      return parts.join(",");
    }
    default:
      return "";
  }
}

/**
 * Builds the full transformed ImageKit URL by applying transforms to base image URL
 */
export function buildTransformedImageUrl(
  baseImageUrl: string,
  transformations: string[],
): string {
  if (!baseImageUrl) return "";
  const cleanBase = baseImageUrl.split("?")[0];
  const activeTransforms = transformations.filter(Boolean);

  if (activeTransforms.length === 0) return cleanBase;

  return `${cleanBase}?tr=${activeTransforms.join(",")}`;
}
