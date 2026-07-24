"use client";

import React, { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/utils";

interface TooltipProps {
  children: React.ReactNode;
  content: React.ReactNode;
  containerClassName?: string;
  cardClassName?: string;
}

export function Tooltip({ children, content, containerClassName, cardClassName }: TooltipProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <span
      className={cn("relative inline-block cursor-pointer", containerClassName)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {children}
      <AnimatePresence>
        {hovered && (
          <motion.span
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className={cn(
              "absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-72 p-4 bg-zinc-950 border border-white/10 text-white rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.5)] backdrop-blur-md z-[99999] pointer-events-none text-left block",
              cardClassName
            )}
          >
            {content}
            {/* Arrow pointing down to the trigger element */}
            <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-zinc-950" />
            <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-white/10 z-[-1] translate-y-[1px]" />
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
}
