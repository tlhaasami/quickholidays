"use client";

import { useEffect, useRef, useState, ReactNode } from "react";

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  animation?: "fade-up" | "fade-in" | "scale-in" | "slide-left" | "slide-right";
  delay?: number;
  duration?: number;
}

export default function ScrollReveal({
  children,
  className = "",
  animation = "fade-up",
  delay = 0,
  duration = 800,
}: ScrollRevealProps) {
  const [isRevealed, setIsRevealed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);

    if (typeof window === "undefined" || !("IntersectionObserver" in window)) {
      setIsRevealed(true);
      return () => window.removeEventListener("resize", checkMobile);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsRevealed(true);
          observer.unobserve(entry.target);
        }
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
      }
    );

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
      observer.disconnect();
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  const getAnimationStyles = () => {
    if (!isMobile) {
      return "opacity-100 translate-y-0 scale-100 translate-x-0";
    }
    switch (animation) {
      case "fade-up":
        return isRevealed
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-10";
      case "fade-in":
        return isRevealed ? "opacity-100" : "opacity-0";
      case "scale-in":
        return isRevealed ? "opacity-100 scale-100" : "opacity-0 scale-95";
      case "slide-left":
        return isRevealed
          ? "opacity-100 translate-x-0"
          : "opacity-0 -translate-x-10";
      case "slide-right":
        return isRevealed
          ? "opacity-100 translate-x-0"
          : "opacity-0 translate-x-10";
      default:
        return "";
    }
  };

  const transitionClass = isMobile 
    ? "transition-all duration-[800ms] ease-[cubic-bezier(0.16,1,0.3,1)]" 
    : "transition-none";

  return (
    <div
      ref={ref}
      className={`${transitionClass} ${getAnimationStyles()} ${className}`}
      style={{
        transitionDelay: isMobile ? `${delay}ms` : "0ms",
        transitionDuration: isMobile ? `${duration}ms` : "0ms",
      }}
    >
      {children}
    </div>
  );
}
