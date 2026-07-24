"use client";

import React, { useEffect, useRef, useState } from "react";

interface PixelImageProps {
  src: string;
  className?: string;
  grid?: string; // e.g. "8x8"
  duration?: number; // ms
}

export function PixelImage({ src, className, grid = "8x8", duration = 1600 }: PixelImageProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [img, setImg] = useState<HTMLImageElement | null>(null);

  useEffect(() => {
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.src = src;
    image.onload = () => {
      setImg(image);
    };
  }, [src]);

  useEffect(() => {
    if (!img) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let startTime: number | null = null;
    let animationFrameId: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);

      // Ease out cubic
      const easedProgress = 1 - Math.pow(1 - progress, 3);

      // Transition from coarse pixels (size 24) to fine pixels (size 1)
      const startPixelSize = 24;
      const endPixelSize = 1;
      const currentPixelSize = Math.max(
        endPixelSize,
        Math.round(startPixelSize - easedProgress * (startPixelSize - endPixelSize))
      );

      const w = canvas.width;
      const h = canvas.height;

      ctx.clearRect(0, 0, w, h);

      if (currentPixelSize > 1) {
        const lowResW = Math.max(1, Math.round(w / currentPixelSize));
        const lowResH = Math.max(1, Math.round(h / currentPixelSize));

        // Downscale image
        const tempCanvas = document.createElement("canvas");
        tempCanvas.width = lowResW;
        tempCanvas.height = lowResH;
        const tempCtx = tempCanvas.getContext("2d");
        if (tempCtx) {
          tempCtx.drawImage(img, 0, 0, lowResW, lowResH);

          // Upscale back without smoothing
          ctx.imageSmoothingEnabled = false;
          ctx.drawImage(tempCanvas, 0, 0, lowResW, lowResH, 0, 0, w, h);
        }
      } else {
        ctx.imageSmoothingEnabled = true;
        ctx.drawImage(img, 0, 0, w, h);
      }

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      }
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [img, src, duration]);

  return (
    <div className={className}>
      <canvas
        ref={canvasRef}
        width={300}
        height={300}
        className="w-full h-full object-cover rounded-2xl border border-zinc-200/20 shadow-xl"
      />
    </div>
  );
}
