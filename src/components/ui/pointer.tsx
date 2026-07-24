"use client"

import { useEffect, useRef, useState } from "react"
import {
  AnimatePresence,
  motion,
  useMotionValue,
  type HTMLMotionProps,
} from "motion/react"

import { cn } from "@/lib/utils"

/**
 * A custom pointer component that displays an animated cursor.
 * Add this as a child to any component to enable a custom pointer when hovering.
 * You can pass custom children to render as the pointer.
 *
 * @component
 * @param {HTMLMotionProps<"div">} props - The component props
 */
export function Pointer({
  className,
  style,
  children,
  ...props
}: HTMLMotionProps<"div">): React.ReactNode {
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const [isActive, setIsActive] = useState<boolean>(false)
  const [isHoveringInteractive, setIsHoveringInteractive] = useState<boolean>(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const parentElement =
      typeof window !== "undefined"
        ? (containerRef.current?.parentElement ?? null)
        : null

    const handleMouseMove = (e: MouseEvent) => {
      x.set(e.clientX)
      y.set(e.clientY)
      setIsActive(true)
      if (parentElement && !parentElement.classList.contains("custom-pointer-active")) {
        parentElement.classList.add("custom-pointer-active")
      }
    }

    const handleMouseEnter = (e: MouseEvent) => {
      x.set(e.clientX)
      y.set(e.clientY)
      setIsActive(true)
      parentElement?.classList.add("custom-pointer-active")
    }

    const handleMouseLeave = () => {
      setIsActive(false)
      setIsHoveringInteractive(false)
      parentElement?.classList.remove("custom-pointer-active")
    }

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null
      if (target) {
        const isInsideDock = target.closest(".magnetic-dock-container")
        const isClickable =
          target.closest("a") ||
          target.closest("button") ||
          target.closest("input") ||
          target.closest("select") ||
          target.closest("[role='button']") ||
          isInsideDock ||
          window.getComputedStyle(target).cursor === "pointer"
        setIsHoveringInteractive(!!isClickable)
      }
    }

    if (parentElement) {
      parentElement.style.cursor = "none"
      parentElement.addEventListener("mousemove", handleMouseMove)
      parentElement.addEventListener("mouseenter", handleMouseEnter)
      parentElement.addEventListener("mouseleave", handleMouseLeave)
      parentElement.addEventListener("mouseover", handleMouseOver)
    }

    return () => {
      if (parentElement) {
        parentElement.style.cursor = ""
        parentElement.classList.remove("custom-pointer-active")
        parentElement.removeEventListener("mousemove", handleMouseMove)
        parentElement.removeEventListener("mouseenter", handleMouseEnter)
        parentElement.removeEventListener("mouseleave", handleMouseLeave)
        parentElement.removeEventListener("mouseover", handleMouseOver)
      }
    }
  }, [x, y])

  return (
    <>
      <div ref={containerRef} />
      <style dangerouslySetInnerHTML={{ __html: `
        .custom-pointer-active, 
        .custom-pointer-active * {
          cursor: none !important;
        }
      `}} />
      <AnimatePresence>
        {isActive && (
          <motion.div
            className="pointer-events-none fixed z-[9999] transform-[translate(-50%,-50%)]"
            style={{
              top: y,
              left: x,
              ...style,
            }}
            initial={{
              scale: 0.5,
              opacity: 0,
            }}
            animate={{
              scale: isHoveringInteractive ? 1.25 : 1,
              opacity: 1,
            }}
            exit={{
              scale: 0.5,
              opacity: 0,
            }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 25,
              mass: 0.8
            }}
            {...props}
          >
            {children || (
              isHoveringInteractive ? (
                // Hover state: Paper airplane pointing to the top-left (left side) matching normal plane rotation
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  height="26"
                  width="26"
                  className={cn(
                    "text-amber-400 fill-amber-400 drop-shadow-[0_4px_12px_rgba(245,158,11,0.5)] rotate-[-45deg] transition-all duration-300",
                    className
                  )}
                >
                  <path d="M12 2L2 22l10-6 10 6L12 2z" />
                </svg>
              ) : (
                // Normal state: Passenger plane flying pointing to the top-left (left side)
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  height="24"
                  width="24"
                  className={cn(
                    "text-yellow-400 fill-yellow-400 drop-shadow-[0_2px_8px_rgba(0,0,0,0.4)] rotate-[-45deg] transition-all duration-300",
                    className
                  )}
                >
                  <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
                </svg>
              )
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
