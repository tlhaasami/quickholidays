"use client";

import { useEffect } from "react";

export function GlobalCoolMode() {
  useEffect(() => {
    // Avoid running on server
    if (typeof window === "undefined") return;

    let activeParticles: Array<{
      element: HTMLDivElement;
      left: number;
      top: number;
      size: number;
      speedHorz: number;
      speedUp: number;
      spinSpeed: number;
      spinVal: number;
      direction: number;
      opacity: number;
    }> = [];

    let animationFrameId: number | null = null;

    const getContainer = () => {
      const id = "_global_cool_mode_container";
      let container = document.getElementById(id) as HTMLDivElement | null;
      if (!container) {
        container = document.createElement("div");
        container.setAttribute("id", id);
        container.setAttribute(
          "style",
          "overflow:hidden; position:fixed; inset:0; pointer-events:none; z-index:2147483647;"
        );
        document.body.appendChild(container);
      }
      return container;
    };

    const SVG_NS = "http://www.w3.org/2000/svg";

    // SVGs for travel-related entities: Airplane, Paper Airplane, Calendar, Passport/Document, Globe
    const travelSVGs = [
      // Mouse Pointer Arrow
      `<path d="M4 3v16l4.58-4.59L12 21l3-1.5-3.41-6.41L17 12z"/>`,
      // Mouse Hand Pointer
      `<path d="M10 21.5c-1.8 0-3.4-.7-4.6-2L2 15.6l1.4-1.4c.4-.4 1-.5 1.4-.2l2.2 1.3V5.5c0-.8.7-1.5 1.5-1.5s1.5.7 1.5 1.5V12h1V8.5c0-.8.7-1.5 1.5-1.5s1.5.7 1.5 1.5V12h1V9.5c0-.8.7-1.5 1.5-1.5s1.5.7 1.5 1.5V12h1v-1.5c0-.8.7-1.5 1.5-1.5s1.5.7 1.5 1.5v8c0 3-2.5 5.5-5.5 5.5h-2.5z"/>`,
      // Calendar
      `<path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2zm-7 3h5v5h-5z"/>`,
      // Passport / Document
      `<path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>`,
      // Globe
      `<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.53c-.26-.81-1-1.4-1.9-1.4h-1v-3c0-.55-.45-1-1-1h-6v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.4z"/>`
    ];

    const spawnParticles = (x: number, y: number) => {
      const container = getContainer();
      const count = 12; // number of items in the burst
      const sizes = [16, 20, 24, 28, 32];

      for (let i = 0; i < count; i++) {
        const size = sizes[Math.floor(Math.random() * sizes.length)];
        
        // Colors: 70% gold/amber brand colors, 30% rainbow colors
        const hue = Math.random() <= 0.7 
          ? Math.floor(35 + Math.random() * 15) // gold/amber
          : Math.floor(Math.random() * 360);    // full spectrum

        // Motion physics (slower popping)
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 2 + 1.5; // speed magnitude (slower)
        const speedHorz = Math.cos(angle) * speed;
        // Upward bias
        const speedUp = Math.abs(Math.sin(angle) * speed) + 1.2; 

        const spinVal = Math.random() * 360;
        const spinSpeed = Math.random() * 5 * (Math.random() <= 0.5 ? -1 : 1); // slower spin
        
        const top = y - size / 2;
        const left = x - size / 2;
        const direction = speedHorz < 0 ? -1 : 1;

        // Select a random travel SVG icon
        const pathContent = travelSVGs[Math.floor(Math.random() * travelSVGs.length)];

        // Create container div for SVG
        const particle = document.createElement("div");
        particle.style.position = "absolute";
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.transform = `translate3d(${left}px, ${top}px, 0px) rotate(${spinVal}deg)`;
        particle.style.opacity = "1";
        particle.style.pointerEvents = "none";
        
        // Build SVG element
        const svgEl = document.createElementNS(SVG_NS, "svg");
        svgEl.setAttribute("viewBox", "0 0 24 24");
        svgEl.setAttribute("width", size.toString());
        svgEl.setAttribute("height", size.toString());
        // Apply glowing/drop shadow styles and brand coloring
        svgEl.setAttribute(
          "style", 
          `fill: hsl(${hue}, 95%, 55%); filter: drop-shadow(0 2px 4px rgba(0,0,0,0.25)) drop-shadow(0 0 8px hsl(${hue}, 90%, 55%));`
        );
        svgEl.innerHTML = pathContent;
        particle.appendChild(svgEl);
        
        container.appendChild(particle);

        activeParticles.push({
          element: particle,
          left,
          top,
          size,
          speedHorz: Math.abs(speedHorz),
          speedUp,
          spinSpeed,
          spinVal,
          direction,
          opacity: 1,
        });
      }

      if (!animationFrameId) {
        animationFrameId = requestAnimationFrame(updateLoop);
      }
    };

    const updateLoop = () => {
      if (activeParticles.length === 0) {
        animationFrameId = null;
        return;
      }

      activeParticles.forEach((p) => {
        // Apply physics (horizontal drag applied to slow down)
        p.left = p.left + p.speedHorz * p.direction;
        p.speedHorz = p.speedHorz * 0.98;
        p.top = p.top - p.speedUp;
        
        // Gravity/drag deceleration (slower)
        p.speedUp = p.speedUp - 0.1;
        p.spinVal = p.spinVal + p.spinSpeed;

        // Fade out (slower)
        if (p.speedUp < 0) {
          p.opacity = Math.max(0, p.opacity - 0.015);
        }

        // Cleanup
        if (
          p.top >= window.innerHeight + p.size ||
          p.left < -p.size ||
          p.left > window.innerWidth + p.size ||
          p.opacity <= 0
        ) {
          p.element.remove();
          activeParticles = activeParticles.filter((o) => o !== p);
        } else {
          p.element.style.transform = `translate3d(${p.left}px, ${p.top}px, 0px) rotate(${p.spinVal}deg)`;
          p.element.style.opacity = p.opacity.toString();
        }
      });

      animationFrameId = requestAnimationFrame(updateLoop);
    };

    const handlePointerDown = (e: PointerEvent) => {
      let target = e.target as HTMLElement | null;
      let isClickable = false;
      let isDock = false;

      while (target && target !== document.body) {
        const tagName = target.tagName;
        const role = target.getAttribute("role");
        const className = typeof target.className === "string" ? target.className : "";

        // Check if inside the dock container
        if (
          (target.classList && target.classList.contains("magnetic-dock-container")) ||
          className.includes("magnetic-dock") ||
          (target.id && target.id.includes("dock"))
        ) {
          isDock = true;
          break;
        }

        if (
          tagName === "BUTTON" ||
          tagName === "A" ||
          role === "button" ||
          className.includes("button") ||
          className.includes("btn") ||
          window.getComputedStyle(target).cursor === "pointer"
        ) {
          isClickable = true;
        }
        target = target.parentElement;
      }

      // Only trigger if clickable AND not inside the dock
      if (isClickable && !isDock) {
        spawnParticles(e.clientX, e.clientY);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown, { passive: true });

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      const container = document.getElementById("_global_cool_mode_container");
      if (container) {
        container.remove();
      }
    };
  }, []);

  return null;
}
