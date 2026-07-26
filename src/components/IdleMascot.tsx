"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

export function IdleMascot() {
  const [isIdle, setIsIdle] = useState(false);

  useEffect(() => {
    let idleTimer: ReturnType<typeof setTimeout>;

    const resetIdle = () => {
      setIsIdle(false);
      clearTimeout(idleTimer);
      // Mascot appears after 10 seconds of total inactivity
      idleTimer = setTimeout(() => {
        setIsIdle(true);
      }, 10000);
    };

    // Initialize
    resetIdle();

    const events = ["mousemove", "keydown", "scroll", "touchstart", "click"];
    events.forEach((event) => {
      window.addEventListener(event, resetIdle);
    });

    return () => {
      clearTimeout(idleTimer);
      events.forEach((event) => {
        window.removeEventListener(event, resetIdle);
      });
    };
  }, []);

  return (
    <AnimatePresence>
      {isIdle && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="fixed bottom-32 right-12 z-[9999] pointer-events-none hidden md:flex flex-col items-center select-none"
        >
          {/* Subtle Hovering speech hint */}
          <motion.div
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            className="mb-2 bg-zinc-900/90 dark:bg-white/95 text-white dark:text-zinc-950 text-[10px] tracking-widest uppercase font-bold py-1 px-2.5 rounded-full border border-white/10 dark:border-black/5 shadow-md flex items-center gap-1.5"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping shrink-0" />
            <span>Idle Mascot</span>
          </motion.div>

          {/* Golden floating mascot icon */}
          <motion.div
            animate={{
              y: [0, -12, 0],
              rotate: [0, 4, -4, 0],
              x: [0, 6, -6, 0]
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-500/20 to-primary/20 backdrop-blur-md border border-primary/40 shadow-[0_0_20px_rgba(201,149,55,0.25)] flex items-center justify-center relative"
          >
            {/* Pulsing ring */}
            <span className="absolute inset-0 rounded-full border border-primary/20 animate-pulse" />

            <svg
              className="w-8 h-8 text-primary"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {/* Robot Antenna */}
              <path d="M12 2v4M8 6h8" />
              {/* Robot Face Box */}
              <rect x="4" y="6" width="16" height="12" rx="2" />
              {/* Glow Eyes */}
              <circle cx="9" cy="12" r="1" fill="currentColor" className="animate-pulse" />
              <circle cx="15" cy="12" r="1" fill="currentColor" className="animate-pulse" />
              {/* Smile Mouth */}
              <path d="M9 15c.66 1 2.33 1 3 0" />
              {/* Bottom neck details */}
              <path d="M10 18v2h4v-2" />
            </svg>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
