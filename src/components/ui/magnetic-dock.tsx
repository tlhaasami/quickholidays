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
    /** Custom theme styling: 'classic' (colorful glowing glass) or 'sketchy' (sketch outline) */
    dockDesign?: "classic" | "sketchy"
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
    dockDesign: "classic" | "sketchy"
}

// Color styling configs for classic creative mode
const hoverGlowColors: Record<string, string> = {
    home: "from-amber-400 to-orange-500",
    "schengen-visa": "from-sky-400 to-blue-600",
    pricing: "from-yellow-300 to-amber-500",
    "how-it-works": "from-cyan-400 to-teal-500",
    faq: "from-purple-400 to-indigo-600",
    reviews: "from-rose-400 to-red-500",
    "about-us": "from-emerald-400 to-teal-600",
    "contact-us": "from-pink-400 to-fuchsia-600",
    whatsapp: "from-green-400 to-emerald-600",
    "ai-assistant": "from-indigo-400 to-violet-600",
    "theme-toggle": "from-transparent to-transparent",
};

const hoverIconColors: Record<string, string> = {
    home: "group-hover:text-amber-500 dark:group-hover:text-amber-400",
    "schengen-visa": "group-hover:text-blue-500 dark:group-hover:text-blue-400",
    pricing: "group-hover:text-amber-500 dark:group-hover:text-amber-400",
    "how-it-works": "group-hover:text-cyan-500 dark:group-hover:text-cyan-400",
    faq: "group-hover:text-purple-500 dark:group-hover:text-purple-400",
    reviews: "group-hover:text-rose-500 dark:group-hover:text-rose-400",
    "about-us": "group-hover:text-emerald-500 dark:group-hover:text-emerald-400",
    "contact-us": "group-hover:text-pink-500 dark:group-hover:text-pink-400",
    whatsapp: "group-hover:text-green-500 dark:group-hover:text-green-400",
    "ai-assistant": "group-hover:text-indigo-500 dark:group-hover:text-indigo-400",
};

const activeIndicatorColors: Record<string, string> = {
    home: "bg-amber-500 shadow-amber-500/50",
    "schengen-visa": "bg-blue-500 shadow-blue-500/50",
    pricing: "bg-amber-500 shadow-amber-500/50",
    "how-it-works": "bg-cyan-500 shadow-cyan-500/50",
    faq: "bg-purple-500 shadow-purple-500/50",
    reviews: "bg-rose-500 shadow-rose-500/50",
    "about-us": "bg-emerald-500 shadow-emerald-500/50",
    "contact-us": "bg-pink-500 shadow-pink-500/50",
    whatsapp: "bg-green-500 shadow-green-500/50",
    "ai-assistant": "bg-indigo-500 shadow-indigo-500/50",
};

function DockItem({
    item,
    mouseX,
    iconSize,
    maxScale,
    magneticDistance,
    showLabels,
    isVertical,
    dockDesign,
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

    // Floating effect
    const y = useTransform(smoothScale, (s) => (s - 1) * -10)
    const smoothY = useSpring(y, springConfig)

    // Theme state to toggle box-shadow colors dynamically in sketchy mode
    const [isDark, setIsDark] = React.useState(true);

    React.useEffect(() => {
        const checkTheme = () => {
            setIsDark(document.documentElement.classList.contains("dark"));
        };
        checkTheme();
        const observer = new MutationObserver(checkTheme);
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ["class"]
        });
        return () => observer.disconnect();
    }, []);

    // Sketchy box shadows
    const baseBoxShadow = isDark
        ? "0 0 0 2px #fff, 2.5px 3px 0 2px rgba(255, 255, 255, 0.25)"
        : "0 0 0 2px #1c1917, 2.5px 3px 0 2px rgba(28, 25, 23, 0.22)";

    const hoverBoxShadow = isDark
        ? "0 0 0 2px #fff, 4px 5px 0 2px rgba(255, 255, 255, 0.35)"
        : "0 0 0 2px #1c1917, 4px 5px 0 2px rgba(28, 25, 23, 0.3)";

    const activeBoxShadow = isHovered ? hoverBoxShadow : baseBoxShadow;

    return (
        <motion.button
            ref={ref}
            onClick={item.onClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="relative flex items-center justify-center cursor-pointer bg-transparent border-0 focus:outline-none group"
            style={{
                width: size,
                height: size,
                y: isVertical ? 0 : smoothY,
                x: isVertical ? smoothY : 0,
            }}
            whileTap={{ scale: 0.95 }}
        >
            {/* Out-of-bounds Glow Drop-shadow for Classic Mode */}
            {dockDesign === "classic" && isHovered && hoverGlowColors[item.id] && (
                <div className={cn(
                    "absolute -inset-1.5 rounded-3xl opacity-30 blur-lg transition-opacity duration-300 bg-gradient-to-br -z-10",
                    hoverGlowColors[item.id]
                )} />
            )}

            {/* Icon Container */}
            <motion.div
                className={cn(
                    "relative w-full h-full rounded-2xl flex items-center justify-center transition-all duration-300",
                    item.id === "theme-toggle" ? "overflow-visible" : "overflow-hidden",
                    // SKETCHY VARIANT container
                    dockDesign === "sketchy"
                        ? (item.id === "theme-toggle"
                            ? "bg-transparent border-none shadow-none"
                            : "bg-white dark:bg-zinc-950")
                        // CLASSIC VARIANT container (glowing glass styling)
                        : (item.id === "theme-toggle"
                            ? "bg-transparent border-none shadow-none"
                            : cn(
                                "bg-gradient-to-b from-white/95 to-white/70 dark:from-zinc-900/95 dark:to-zinc-950/70",
                                "backdrop-blur-md border border-zinc-200/50 dark:border-white/5",
                                "shadow-md hover:shadow-xl shadow-black/[0.05]"
                              )),
                    item.className
                )}
                style={{
                    // Sketchy inline parameters
                    filter: dockDesign === "sketchy" && item.id !== "theme-toggle" ? "url(#sketchy-sm)" : "none",
                    boxShadow: dockDesign === "sketchy" && item.id !== "theme-toggle" ? activeBoxShadow : undefined,
                    transform: dockDesign === "sketchy" && item.id !== "theme-toggle"
                        ? (isHovered ? "rotate(3deg) scale(1.05)" : "rotate(-1.5deg) scale(1)")
                        : "none",
                    transition: "transform 0.25s cubic-bezier(0.25, 0.8, 0.25, 1), box-shadow 0.25s cubic-bezier(0.25, 0.8, 0.25, 1), border-color 0.3s ease",
                }}
            >
                {/* Icon wrapper with hover state matching colors */}
                <div className={cn(
                    "flex items-center justify-center transition-colors duration-300",
                    dockDesign === "sketchy"
                        ? (item.id !== "theme-toggle" && "text-neutral-700 dark:text-white filter drop-shadow-[0_1px_1px_rgba(0,0,0,0.15)] dark:drop-shadow-[0_1px_1px_rgba(255,255,255,0.15)]")
                        : (item.id !== "theme-toggle" && cn("text-zinc-600 dark:text-zinc-400", hoverIconColors[item.id])),
                    item.id === "theme-toggle" ? "w-full h-full" : "w-[60%] h-[60%]"
                )}>
                    {item.icon}
                </div>

                {/* Reflection Sweep (Shine sweep animation on hover for classic mode) */}
                {dockDesign === "classic" && isHovered && item.id !== "theme-toggle" && (
                    <motion.div
                        initial={{ left: "-100%" }}
                        animate={{ left: "100%" }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="absolute top-0 bottom-0 w-1/2 bg-white/20 skew-x-12 pointer-events-none -z-0"
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
                        className={cn(
                            "absolute -bottom-2",
                            dockDesign === "sketchy"
                                ? "w-2.5 h-1.5 rounded-sm bg-neutral-600 dark:bg-white/80"
                                : cn("w-3.5 h-1 rounded-full shadow-lg", activeIndicatorColors[item.id] || "bg-zinc-650 dark:bg-white/80")
                        )}
                        style={dockDesign === "sketchy" ? {
                            filter: "url(#sketchy-sm)",
                            transform: "rotate(-1deg)"
                        } : undefined}
                    />
                )}
            </AnimatePresence>

            {/* Tooltip */}
            <AnimatePresence>
                {showLabels && isHovered && (
                    <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.9 }}
                        transition={{ duration: 0.15, ease: "easeOut" }}
                        className={cn(
                            "absolute -top-10 left-1/2 -translate-x-1/2",
                            "px-3 py-1.5 rounded-lg",
                            "bg-white dark:bg-neutral-900/95",
                            "backdrop-blur-sm",
                            "text-neutral-800 dark:text-white text-sm font-medium whitespace-nowrap",
                            "border border-neutral-200 dark:border-white/10",
                            "shadow-xl shadow-black/10 dark:shadow-black/20",
                            "pointer-events-none z-50"
                        )}
                    >
                        {item.label}
                        {/* Tooltip arrow */}
                        <div
                            className={cn(
                                "absolute left-1/2 -translate-x-1/2 -bottom-1",
                                "w-2 h-2 rotate-45",
                                "bg-white dark:bg-neutral-900/95",
                                "border-r border-b border-neutral-200 dark:border-white/10"
                            )}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
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
    dockDesign = "classic",
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
            "border border-neutral-200 dark:border-neutral-700"
        ),
        solid: cn(
            "bg-neutral-100 dark:bg-neutral-900",
            "border border-neutral-300 dark:border-neutral-700"
        ),
        transparent: "bg-transparent border-0",
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
                "magnetic-dock-container inline-flex items-end gap-2 p-3 rounded-3xl",
                variantStyles[variant],
                positionStyles[position],
                "shadow-xl shadow-black/10 dark:shadow-black/30",
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
                    dockDesign={dockDesign}
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
}
