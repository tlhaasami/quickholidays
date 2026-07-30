"use client"

import * as React from "react"
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence, type MotionValue } from "framer-motion"
import { cn } from "@/lib/utils"

interface MagneticDockProps {
    /** Array of dock items */
    items: DockItemData[]
    /** Size of icons in pixels */
    iconSize?: number
    /** Maximum scale on hover */
    maxScale?: number
    /** Distance of magnetic effect in pixels */
    magneticDistance?: number
    /** Show labels on hover */
    showLabels?: boolean
    /** Dock position */
    position?: "bottom" | "top" | "left" | "right"
    /** Background style */
    variant?: "glass" | "solid" | "transparent"
    /** Custom class name */
    className?: string
    /** Dynamic container styles */
    design?: "classic" | "sketchy" | "brutalist" | "neon" | "minimal"
    /** Dynamic icon style accents */
    iconStyle?: "default" | "creative"
}

interface DockItemData {
    /** Unique identifier */
    id: string
    /** Display label */
    label: string
    /** Icon component or image URL */
    icon: React.ReactNode
    /** Click handler */
    onClick?: () => void
    /** Whether item is active */
    isActive?: boolean
    /** Badge count */
    badge?: number
    /** Custom class name to override icon container gradient/border */
    className?: string;
}

interface DockItemProps {
    item: DockItemData
    mouseX: MotionValue<number>
    iconSize: number
    maxScale: number
    magneticDistance: number
    showLabels: boolean
    isVertical: boolean
    position: "bottom" | "top" | "left" | "right"
    design: "classic" | "sketchy" | "brutalist" | "neon" | "minimal"
    iconStyle: "default" | "creative"
}

function DockItem({
    item,
    mouseX,
    iconSize,
    maxScale,
    magneticDistance,
    showLabels,
    isVertical,
    position,
    design,
    iconStyle,
}: DockItemProps) {
    const ref = React.useRef<HTMLButtonElement>(null)
    const [isHovered, setIsHovered] = React.useState(false)

    // Calculate distance from mouse to center of item
    const distance = useTransform(mouseX, (val: number) => {
        if (!ref.current) return magneticDistance + 1
        const rect = ref.current.getBoundingClientRect()
        const center = isVertical
            ? rect.top + rect.height / 2
            : rect.left + rect.width / 2
        return val - center
    })

    // Scale based on distance - closer = larger
    const scale = useTransform(distance, [-magneticDistance, 0, magneticDistance], [1, maxScale, 1])

    // Apply spring physics for smooth animation
    const springConfig = { damping: 20, stiffness: 300, mass: 0.5 }
    const smoothScale = useSpring(scale, springConfig)

    // Calculate the size based on scale
    const size = useTransform(smoothScale, (s) => s * iconSize)

    // Calculate font size dynamically based on scale
    const fontSize = useTransform(smoothScale, (s) => s * 9.5)

    // Calculate padding dynamically based on scale
    const paddingX = useTransform(smoothScale, (s) => s * 14)

    // Calculate icon container size dynamically based on scale
    const iconWrapperSize = useTransform(smoothScale, (s) => s * (item.id === "theme-toggle" ? 20 : 16))

    // Floating effect for horizontal; sliding offset for vertical
    const y = useTransform(smoothScale, (s) => (s - 1) * -10)
    const smoothY = useSpring(y, springConfig)

    const slideX = isVertical
        ? (position === "left"
            ? (isHovered ? 8 : 0)
            : position === "right"
                ? (isHovered ? -8 : 0)
                : 0)
        : 0;

    // Tooltip and indicator positions based on dock layout orientation
    const tooltipPositionStyles = {
        bottom: "absolute -top-10 left-1/2 -translate-x-1/2",
        top: "absolute -bottom-10 left-1/2 -translate-x-1/2",
        left: "absolute left-full top-1/2 -translate-y-1/2 ml-3.5",
        right: "absolute right-full top-1/2 -translate-y-1/2 mr-3.5",
    };

    const tooltipArrowStyles = {
        bottom: "absolute left-1/2 -translate-x-1/2 -bottom-1 w-2 h-2 rotate-45 border-r border-b",
        top: "absolute left-1/2 -translate-x-1/2 -top-1 w-2 h-2 rotate-45 border-l border-t",
        left: "absolute top-1/2 -translate-y-1/2 -left-1 w-2 h-2 rotate-45 border-l border-b",
        right: "absolute top-1/2 -translate-y-1/2 -right-1 w-2 h-2 rotate-45 border-r border-t",
    };

    const activeIndicatorStyles = {
        bottom: "absolute -bottom-2 w-1.5 h-1.5 rounded-full bg-neutral-600 dark:bg-white/80",
        top: "absolute -top-2 w-1.5 h-1.5 rounded-full bg-neutral-600 dark:bg-white/80",
        left: "absolute -left-2 w-1.5 h-1.5 rounded-full bg-neutral-600 dark:bg-white/80",
        right: "absolute -right-2 w-1.5 h-1.5 rounded-full bg-neutral-600 dark:bg-white/80",
    };

    const glowActive = item.isActive || isHovered;

    const themeMap = {
        home: {
            bg: "var(--glow-schengen-visa-bg)",
            border: "var(--glow-schengen-visa-border)",
            shadow: "var(--glow-schengen-visa-shadow)",
            textClass: "text-[#C99537] dark:text-amber-400",
            defaultBg: "var(--dock-schengen-visa-bg)",
            defaultBorder: "var(--dock-schengen-visa-border)",
            defaultText: "text-[#C99537]/75 dark:text-amber-400/80"
        },
        "schengen-visa": {
            bg: "var(--glow-schengen-visa-bg)",
            border: "var(--glow-schengen-visa-border)",
            shadow: "var(--glow-schengen-visa-shadow)",
            textClass: "text-[#C99537] dark:text-amber-400",
            defaultBg: "var(--dock-schengen-visa-bg)",
            defaultBorder: "var(--dock-schengen-visa-border)",
            defaultText: "text-[#C99537]/75 dark:text-amber-400/80"
        },
        "schengen-ready": {
            bg: "var(--glow-schengen-visa-bg)",
            border: "var(--glow-schengen-visa-border)",
            shadow: "var(--glow-schengen-visa-shadow)",
            textClass: "text-[#C99537] dark:text-amber-400",
            defaultBg: "var(--dock-schengen-visa-bg)",
            defaultBorder: "var(--dock-schengen-visa-border)",
            defaultText: "text-[#C99537]/75 dark:text-amber-400/80"
        },
        pricing: {
            bg: "var(--glow-schengen-visa-bg)",
            border: "var(--glow-schengen-visa-border)",
            shadow: "var(--glow-schengen-visa-shadow)",
            textClass: "text-[#C99537] dark:text-amber-400",
            defaultBg: "var(--dock-schengen-visa-bg)",
            defaultBorder: "var(--dock-schengen-visa-border)",
            defaultText: "text-[#C99537]/75 dark:text-amber-400/80"
        },
        "how-it-works": {
            bg: "var(--glow-schengen-visa-bg)",
            border: "var(--glow-schengen-visa-border)",
            shadow: "var(--glow-schengen-visa-shadow)",
            textClass: "text-[#C99537] dark:text-amber-400",
            defaultBg: "var(--dock-schengen-visa-bg)",
            defaultBorder: "var(--dock-schengen-visa-border)",
            defaultText: "text-[#C99537]/75 dark:text-amber-400/80"
        },
        faq: {
            bg: "var(--glow-schengen-visa-bg)",
            border: "var(--glow-schengen-visa-border)",
            shadow: "var(--glow-schengen-visa-shadow)",
            textClass: "text-[#C99537] dark:text-amber-400",
            defaultBg: "var(--dock-schengen-visa-bg)",
            defaultBorder: "var(--dock-schengen-visa-border)",
            defaultText: "text-[#C99537]/75 dark:text-amber-400/80"
        },
        reviews: {
            bg: "var(--glow-schengen-visa-bg)",
            border: "var(--glow-schengen-visa-border)",
            shadow: "var(--glow-schengen-visa-shadow)",
            textClass: "text-[#C99537] dark:text-amber-400",
            defaultBg: "var(--dock-schengen-visa-bg)",
            defaultBorder: "var(--dock-schengen-visa-border)",
            defaultText: "text-[#C99537]/75 dark:text-amber-400/80"
        },
        "about-us": {
            bg: "var(--glow-schengen-visa-bg)",
            border: "var(--glow-schengen-visa-border)",
            shadow: "var(--glow-schengen-visa-shadow)",
            textClass: "text-[#C99537] dark:text-amber-400",
            defaultBg: "var(--dock-schengen-visa-bg)",
            defaultBorder: "var(--dock-schengen-visa-border)",
            defaultText: "text-[#C99537]/75 dark:text-amber-400/80"
        },
        "contact-us": {
            bg: "var(--glow-schengen-visa-bg)",
            border: "var(--glow-schengen-visa-border)",
            shadow: "var(--glow-schengen-visa-shadow)",
            textClass: "text-[#C99537] dark:text-amber-400",
            defaultBg: "var(--dock-schengen-visa-bg)",
            defaultBorder: "var(--dock-schengen-visa-border)",
            defaultText: "text-[#C99537]/75 dark:text-amber-400/80"
        },
        "refund-policy": {
            bg: "var(--glow-schengen-visa-bg)",
            border: "var(--glow-schengen-visa-border)",
            shadow: "var(--glow-schengen-visa-shadow)",
            textClass: "text-[#C99537] dark:text-amber-400",
            defaultBg: "var(--dock-schengen-visa-bg)",
            defaultBorder: "var(--dock-schengen-visa-border)",
            defaultText: "text-[#C99537]/75 dark:text-amber-400/80"
        }
    };

    const theme = themeMap[item.id as keyof typeof themeMap] || {
        bg: "transparent",
        border: "transparent",
        shadow: "none",
        textClass: "",
        defaultBg: "transparent",
        defaultBorder: "transparent",
        defaultText: ""
    };

    return (
        <motion.button
            ref={ref}
            onClick={item.onClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{
                height: size,
                y: isVertical ? 0 : smoothY,
                x: slideX,
            }}
            className="relative flex items-center justify-center pointer-events-auto cursor-pointer w-auto shrink-0"
        >
            {/* Icon Container */}
            <motion.div
                className={cn(
                    "relative h-full flex items-center gap-2 px-0",
                    design === "brutalist" ? "rounded-none" : "rounded-2xl",
                    item.id === "theme-toggle" ? "overflow-visible" : "overflow-hidden",
                    item.id === "theme-toggle"
                        ? "bg-transparent border-none shadow-none"
                        : cn(
                            design === "brutalist" 
                                ? "bg-white dark:bg-zinc-950 border-2 border-zinc-950 dark:border-white"
                                : design === "neon"
                                    ? "bg-zinc-950 border-2 border-[#C99537] shadow-[0_0_10px_rgba(201,149,55,0.2)]"
                                    : "border-transparent bg-none"
                        ),
                    "transition-all duration-200",
                    item.className
                )}
                style={{
                    paddingLeft: paddingX,
                    paddingRight: paddingX,
                    background: item.id !== "theme-toggle" ? (glowActive ? theme.bg : theme.defaultBg) : undefined,
                    borderColor: item.id !== "theme-toggle" ? (glowActive ? theme.border : theme.defaultBorder) : undefined,
                    boxShadow: item.id === "theme-toggle" || design === "brutalist" || design === "neon"
                        ? "none"
                        : (glowActive
                            ? `0 0 18px ${theme.shadow}, 0 4px 12px rgba(0,0,0,0.06)`
                            : "none"),
                }}
            >
                {/* Icon */}
                <motion.div 
                    style={{ width: iconWrapperSize, height: iconWrapperSize }}
                    className={cn(
                        "flex items-center justify-center shrink-0 transition-colors duration-200",
                        item.id !== "theme-toggle" ? (glowActive ? theme.textClass : theme.defaultText) : "text-neutral-700 dark:text-white"
                    )}
                >
                    {item.icon}
                </motion.div>

                {/* Option Name */}
                {item.id !== "theme-toggle" && (
                    <motion.span 
                        style={{ fontSize: fontSize }}
                        className={cn(
                            "font-sans font-bold uppercase tracking-wider whitespace-nowrap select-none pointer-events-none transition-colors duration-200",
                            glowActive ? theme.textClass : theme.defaultText
                        )}
                    >
                        {item.label}
                    </motion.span>
                )}

                {/* Creative Accent: Top-Right flag triangle */}
                {iconStyle === "creative" && item.id !== "theme-toggle" && (
                    <div className="absolute top-0 right-0 w-2.5 h-2.5 bg-amber-500 border-l border-b border-zinc-950 dark:border-white transform rotate-45 translate-x-1.5 translate-y-[-1.5px] z-20 pointer-events-none" />
                )}

                {/* Creative Accent: Mini computer mouse floating next to item on hover when on left dock */}
                {iconStyle === "creative" && isHovered && position === "left" && (
                    <motion.div
                        initial={{ scale: 0, opacity: 0, x: -10 }}
                        animate={{ scale: 1, opacity: 1, x: 0 }}
                        className="absolute -left-6 top-1/2 -translate-y-1/2 text-[#C99537] z-20 text-[11px]"
                    >
                        🖱️
                    </motion.div>
                )}

                {/* Shine effect */}
                {item.id !== "theme-toggle" && design !== "brutalist" && (
                    <motion.div
                        className="absolute inset-0 pointer-events-none"
                        style={{
                            background:
                                "linear-gradient(135deg, rgba(255,255,255,0.75) 0%, rgba(255,255,255,0.2) 35%, transparent 70%)",
                            opacity: isHovered ? 0.95 : 0.65,
                        }}
                    />
                )}
            </motion.div>

            {/* Badge */}
            <AnimatePresence>
                {item.badge !== undefined && item.badge > 0 && (
                    <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        className={cn(
                            "absolute -top-1 -right-1",
                            "min-w-[20px] h-5 px-1.5",
                            "rounded-full",
                            "bg-red-500",
                            "text-white text-xs font-semibold",
                            "flex items-center justify-center",
                            "border-2 border-white dark:border-neutral-950",
                            "shadow-lg"
                        )}
                    >
                        {item.badge > 99 ? "99+" : item.badge}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Active Indicator */}
            <AnimatePresence>
                {item.isActive && (
                    <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        className={cn(activeIndicatorStyles[position])}
                        style={{
                            backgroundColor: theme.border,
                            boxShadow: `0 0 8px ${theme.border}`
                        }}
                    />
                )}
            </AnimatePresence>




            {/* Hover glow */}
            {design !== "brutalist" && (
                <motion.div
                    className="absolute inset-0 rounded-2xl pointer-events-none"
                    animate={{
                        boxShadow: isHovered
                            ? "0 0 30px rgba(255,255,255,0.15)"
                            : "0 0 0px rgba(255,255,255,0)",
                    }}
                    transition={{ duration: 0.3 }}
                />
            )}
        </motion.button>
    )
}

function MagneticDock({
    items,
    iconSize = 40,
    maxScale = 1.3,
    magneticDistance = 100,
    showLabels = true,
    position = "bottom",
    variant = "glass",
    className,
    design = "classic",
    iconStyle = "default",
}: MagneticDockProps) {
    const mousePosition = useMotionValue(Infinity)
    const isVertical = position === "left" || position === "right"

    const handleMouseMove = React.useCallback(
        (e: React.MouseEvent) => {
            if (isVertical) {
                mousePosition.set(e.clientY)
            } else {
                mousePosition.set(e.clientX)
            }
        },
        [mousePosition, isVertical]
    )

    const handleMouseLeave = () => {
        mousePosition.set(Infinity)
    }

    const variantStyles = {
        glass: cn(
            "bg-white/80 dark:bg-neutral-900/80",
            "backdrop-blur-xl backdrop-saturate-150",
            "border border-neutral-200 dark:border-neutral-700",
            "shadow-xl shadow-black/10 dark:shadow-black/30",
            "rounded-3xl"
        ),
        solid: cn(
            "bg-neutral-100 dark:bg-neutral-900",
            "border border-neutral-300 dark:border-neutral-700",
            "shadow-xl shadow-black/10 dark:shadow-black/30",
            "rounded-3xl"
        ),
        transparent: "bg-transparent border-0 shadow-none",
    }

    const designStyles = {
        classic: cn(
            "bg-white/80 dark:bg-neutral-900/80",
            "backdrop-blur-xl backdrop-saturate-150",
            "border border-neutral-200 dark:border-neutral-700",
            "shadow-xl shadow-black/10 dark:shadow-black/30",
            "rounded-3xl"
        ),
        sketchy: cn(
            "bg-[#faf6eb] dark:bg-zinc-900",
            "border-3 border-zinc-950 dark:border-white",
            "shadow-[5px_5px_0px_rgba(0,0,0,0.85)] dark:shadow-[5px_5px_0px_rgba(255,255,255,0.85)]",
            "rotate-[-0.5deg]",
            "rounded-2xl"
        ),
        brutalist: cn(
            "bg-white dark:bg-zinc-950",
            "border-3 border-zinc-950 dark:border-white",
            "shadow-[6px_6px_0_#000] dark:shadow-[6px_6px_0_#fff]",
            "rounded-none"
        ),
        neon: cn(
            "bg-black/95",
            "border-2 border-[#C99537]",
            "shadow-[0_0_20px_rgba(201,149,55,0.55)]",
            "rounded-3xl"
        ),
        minimal: cn(
            "bg-transparent border-0 shadow-none p-0 gap-3"
        )
    }

    const positionStyles = {
        bottom: "flex-row",
        top: "flex-row",
        left: "flex-col",
        right: "flex-col",
    }

    return (
        <motion.div
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className={cn(
                "magnetic-dock-container inline-flex items-center gap-2 p-3",
                design ? designStyles[design] : variantStyles[variant],
                positionStyles[position],
                className
            )}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
            {items.map((item) => (
                <DockItem
                    key={item.id}
                    item={item}
                    mouseX={mousePosition}
                    iconSize={iconSize}
                    maxScale={maxScale}
                    magneticDistance={magneticDistance}
                    showLabels={showLabels}
                    isVertical={isVertical}
                    position={position}
                    design={design}
                    iconStyle={iconStyle}
                />
            ))}
        </motion.div>
    )
}

// Preset icons for common use cases
function DockIconHome({ className }: { className?: string }) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={cn("w-full h-full", className)}
        >
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
    )
}

function DockIconSearch({ className }: { className?: string }) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={cn("w-full h-full", className)}
        >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
    )
}

function DockIconFolder({ className }: { className?: string }) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={cn("w-full h-full", className)}
        >
            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
        </svg>
    )
}

function DockIconMail({ className }: { className?: string }) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={cn("w-full h-full", className)}
        >
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
            <polyline points="22,6 12,13 2,6" />
        </svg>
    )
}

function DockIconMusic({ className }: { className?: string }) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={cn("w-full h-full", className)}
        >
            <path d="M9 18V5l12-2v13" />
            <circle cx="6" cy="18" r="3" />
            <circle cx="18" cy="16" r="3" />
        </svg>
    )
}

function DockIconSettings({ className }: { className?: string }) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={cn("w-full h-full", className)}
        >
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
    )
}

function DockIconTrash({ className }: { className?: string }) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={cn("w-full h-full", className)}
        >
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
        </svg>
    )
}

export {
    MagneticDock,
    DockIconHome,
    DockIconSearch,
    DockIconFolder,
    DockIconMail,
    DockIconMusic,
    DockIconSettings,
    DockIconTrash,
    type MagneticDockProps,
    type DockItemData,
}
