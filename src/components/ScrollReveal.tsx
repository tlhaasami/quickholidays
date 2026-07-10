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
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check if browser supports IntersectionObserver
    if (typeof window === "undefined" || !("IntersectionObserver" in window)) {
      setIsRevealed(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsRevealed(true);
          observer.unobserve(entry.target);
        }
      },
      {
        threshold: 0.1, // Trigger when 10% of the element is visible
        rootMargin: "0px 0px -50px 0px", // Trigger slightly before it fully enters viewport
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
    };
  }, []);

  const getAnimationStyles = () => {
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

  return (
    <div
      ref={ref}
      className={`transition-all duration-[800ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${getAnimationStyles()} ${className}`}
      style={{
        transitionDelay: `${delay}ms`,
        transitionDuration: `${duration}ms`,
      }}
    >
      {children}
    </div>
  );
}
