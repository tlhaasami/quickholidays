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
  disabled?: boolean;
}

export function ThemeButton({ 
  href, 
  onClick, 
  className, 
  children, 
  type = "button", 
  hideArrow = false, 
  target, 
  rel, 
  size = "md", 
  fullWidth = true,
  disabled = false
}: ThemeButtonProps) {
  const content = (
    <div
      className={cn(
        "inline-flex items-center justify-center select-none font-sans font-bold tracking-wider uppercase border border-zinc-900 dark:border-white bg-white dark:bg-zinc-950 text-zinc-950 dark:text-white transition-colors duration-200",
        disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer",
        size === "sm" ? "px-5 py-3 text-[11px]" : "px-8 py-4 text-xs sm:text-sm",
        fullWidth ? "w-full sm:w-auto" : "w-auto",
        className
      )}
    >
      {children}
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
    <button type={type} onClick={onClick} disabled={disabled} className={cn("border-none p-0 bg-transparent cursor-pointer", fullWidth ? "inline-block w-full sm:w-auto" : "inline-block w-auto")}>
      {content}
    </button>
  );
}
