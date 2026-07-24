"use client";

import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface ThemeButtonProps {
  href?: string;
  onClick?: () => void;
  className?: string;
  children: React.ReactNode;
  type?: "button" | "submit" | "reset";
  hideArrow?: boolean;
  target?: string;
  rel?: string;
  size?: "sm" | "md";
  fullWidth?: boolean;
}

export function ThemeButton({ href, onClick, className, children, type = "button", hideArrow = false, target, rel, size = "md", fullWidth = true }: ThemeButtonProps) {
  const content = (
    <div className={cn(
      "relative group inline-block select-none",
      fullWidth ? "w-full sm:w-auto" : "w-auto"
    )}>
      {/* Bottom Shadow Background (exposes to bottom-left when button moves up-right, transitions to gold) */}
      <div className="absolute inset-0 bg-black dark:bg-white border border-black dark:border-white z-0 transition-colors duration-200 group-hover:bg-[#C99537] dark:group-hover:bg-[#C99537]" />
      
      {/* Top Active Button */}
      <div 
        className={cn(
          "relative bg-white dark:bg-zinc-950 text-zinc-950 dark:text-white border border-black dark:border-white font-sans font-bold tracking-wider uppercase transition-transform duration-200 flex items-center justify-between gap-6 cursor-pointer z-10 group-hover:translate-x-2 group-hover:-translate-y-2",
          size === "sm" ? "px-5 py-3 text-[11px]" : "px-8 py-4 text-xs sm:text-sm",
          fullWidth ? "w-full sm:w-auto" : "w-auto",
          className
        )}
      >
        <span>{children}</span>
        {!hideArrow && (
          <span className="text-zinc-950 dark:text-white group-hover:text-[#C99537] dark:group-hover:text-[#C99537] transition-colors duration-200 text-base shrink-0">
            →
          </span>
        )}
      </div>
    </div>
  );

  if (href) {
    return (
      <Link href={href} target={target} rel={rel} className={fullWidth ? "inline-block w-full sm:w-auto" : "inline-block w-auto"}>
        {content}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} className={cn("border-none p-0 bg-transparent cursor-pointer", fullWidth ? "inline-block w-full sm:w-auto" : "inline-block w-auto")}>
      {content}
    </button>
  );
}
