"use client";

import React from "react";
import { Toaster as SonnerToaster } from "sonner";

export function Toaster() {
  return (
    <SonnerToaster
      position="top-right"
      theme="dark"
      richColors
      closeButton
      toastOptions={{
        className:
          "border border-white/12 bg-card/95 text-foreground backdrop-blur-2xl rounded-2xl shadow-[0_15px_40px_rgba(0,0,0,0.8)] font-sans",
      }}
    />
  );
}
