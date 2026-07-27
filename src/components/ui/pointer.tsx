"use client"

import { useEffect, useRef, useState } from "react"
import {
  AnimatePresence,
  motion,
  useMotionValue,
  type HTMLMotionProps,
} from "motion/react"

import { usePathname } from "next/navigation"
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
  const pathname = usePathname()
  const isExcludedPath = pathname === "/login" || pathname === "/agent-portal"
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const [isActive, setIsActive] = useState<boolean>(false)
  const [isHoveringInteractive, setIsHoveringInteractive] = useState<boolean>(false)
  const [isMobile, setIsMobile] = useState<boolean>(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(
        window.innerWidth < 768 || 
        ('ontouchstart' in window) || 
        navigator.maxTouchPoints > 0
      )
    }
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  useEffect(() => {
    if (isMobile) return;
    const parentElement =
      typeof window !== "undefined"
        ? (containerRef.current?.parentElement ?? null)
        : null

    const handleMouseMove = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null
      const shouldHideCustom =
        target?.closest("input") ||
        target?.closest("textarea") ||
        target?.closest("select") ||
        target?.closest(".no-custom-cursor")

      if (shouldHideCustom) {
        setIsActive(false)
        if (parentElement) {
          parentElement.classList.remove("custom-pointer-active")
        }
        return
      }

      x.set(e.clientX)
      y.set(e.clientY)
      setIsActive(true)
      if (parentElement && !parentElement.classList.contains("custom-pointer-active")) {
        parentElement.classList.add("custom-pointer-active")
      }
    }

    const handleMouseEnter = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null
      const shouldHideCustom =
        target?.closest("input") ||
        target?.closest("textarea") ||
        target?.closest("select") ||
        target?.closest(".no-custom-cursor")

      if (shouldHideCustom) {
        setIsActive(false)
        if (parentElement) {
          parentElement.classList.remove("custom-pointer-active")
        }
        return
      }

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
        const shouldHideCustom =
          target.closest("input") ||
          target.closest("textarea") ||
          target.closest("select") ||
          target.closest(".no-custom-cursor")

        if (shouldHideCustom) {
          setIsActive(false)
          setIsHoveringInteractive(false)
          if (parentElement) {
            parentElement.classList.remove("custom-pointer-active")
          }
          return
        }

        const isInsideDock = target.closest(".magnetic-dock-container")
        const isClickable =
          target.closest("a") ||
          target.closest("button") ||
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
  }, [x, y, isMobile])

  if (isMobile) return null;

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
            className="pointer-events-none fixed z-[100000] transform-[translate(-50%,-50%)]"
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
                // Hover state: Simple hand pointer pointing to the top-left matching interactive hover cursor
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  height="26"
                  width="26"
                  className={cn(
                    "text-[#C99537] fill-[#C99537] drop-shadow-[0_4px_12px_rgba(201,149,55,0.5)] transition-all duration-300",
                    className
                  )}
                >
                  <path d="M10 21.5c-1.8 0-3.4-.7-4.6-2L2 15.6l1.4-1.4c.4-.4 1-.5 1.4-.2l2.2 1.3V5.5c0-.8.7-1.5 1.5-1.5s1.5.7 1.5 1.5V12h1V8.5c0-.8.7-1.5 1.5-1.5s1.5.7 1.5 1.5V12h1V9.5c0-.8.7-1.5 1.5-1.5s1.5.7 1.5 1.5V12h1v-1.5c0-.8.7-1.5 1.5-1.5s1.5.7 1.5 1.5v8c0 3-2.5 5.5-5.5 5.5h-2.5z" />
                </svg>
              ) : (
                // Normal state: Simple mouse pointer arrow
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  height="24"
                  width="24"
                  className={cn(
                    "text-zinc-900 dark:text-white fill-current drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)] transition-all duration-300",
                    className
                  )}
                >
                  <path d="M4 3v16l4.58-4.59L12 21l3-1.5-3.41-6.41L17 12z" />
                </svg>
              )
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
