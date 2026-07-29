"use client";

import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import { IconPhoneCall, IconFiles, IconCalendarEvent, IconCompass } from "@tabler/icons-react";
import { cn } from "@/lib/utils";

// Inline useWindowSize hook to avoid extra import files and ensure server-safe rendering
const useWindowSize = () => {
  const [width, setWidth] = useState<number | undefined>(undefined);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const handleResize = () => setWidth(window.innerWidth);
      window.addEventListener("resize", handleResize);
      handleResize();
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  return { width };
};

interface PanelProps {
  open: number;
  setOpen: (id: number) => void;
  id: number;
  Icon: React.ComponentType<{ size?: number }>;
  title: string;
  imgSrc: string;
  description: string;
}

const Panel = ({ open, setOpen, id, Icon, title, imgSrc, description }: PanelProps) => {
  const { width } = useWindowSize();
  const isOpen = open === id;

  return (
    <>
      <button
        type="button"
        className={cn(
          "bg-zinc-50 dark:bg-zinc-950 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors border-r border-b border-zinc-200 dark:border-white/10 flex flex-row-reverse lg:flex-col justify-end items-center gap-4 relative group shrink-0 lg:w-[80px] cursor-pointer",
          isOpen ? "bg-zinc-200 dark:bg-zinc-900" : ""
        )}
        onClick={() => setOpen(id)}
      >
        <span
          style={{
            writingMode: "vertical-lr",
          }}
          className="hidden lg:block text-xs font-sans font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400 group-hover:text-primary transition-colors rotate-180 my-auto py-6"
        >
          {title}
        </span>
        <span className="block lg:hidden text-xs font-sans font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400 group-hover:text-primary transition-colors py-2">
          {title}
        </span>
        
        {/* Full-width square Icon block at the bottom of the button (matching reference) */}
        <div className="w-12 h-12 lg:w-full aspect-square bg-[#C99537] text-zinc-950 grid place-items-center group-hover:bg-[#C99537]/90 transition-colors shrink-0">
          <Icon size={24} />
        </div>
        
        {/* Active Indicator Arrow pointing towards open image panel */}
        <span 
          className={cn(
            "w-4 h-4 transition-colors border-r border-b lg:border-b-0 lg:border-t border-zinc-200 dark:border-white/10 rotate-45 absolute bottom-0 lg:bottom-[50%] right-[50%] lg:right-0 translate-y-[50%] translate-x-[50%] z-20",
            isOpen ? "bg-zinc-200 dark:bg-zinc-900" : "bg-zinc-50 dark:bg-zinc-950 hover:bg-zinc-100 dark:hover:bg-zinc-900"
          )} 
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            key={`panel-${id}`}
            variants={width && width > 1024 ? panelVariants : panelVariantsSm}
            initial="closed"
            animate="open"
            exit="closed"
            style={{
              backgroundImage: `url(${imgSrc})`,
              backgroundPosition: "center",
              backgroundSize: "cover",
            }}
            className="w-full h-full overflow-hidden relative bg-black flex items-end grow"
          >
            {/* Dark gradient overlay for readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent pointer-events-none" />
            
            {/* Full-width bottom description overlay block (matching reference) */}
            <motion.div
              variants={descriptionVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className="absolute bottom-0 left-0 right-0 px-8 py-6 bg-white/60 dark:bg-black/55 backdrop-blur-md text-zinc-950 dark:text-white border-t border-zinc-200/50 dark:border-white/10 text-left z-10"
            >
              <p className="font-sans text-sm sm:text-base font-light leading-relaxed text-zinc-850 dark:text-zinc-200">
                {description}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export function VerticalAccordion() {
  const [open, setOpen] = useState(items[0].id);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setOpen((prev) => {
        const currentIndex = items.findIndex((item) => item.id === prev);
        const nextIndex = (currentIndex + 1) % items.length;
        return items[nextIndex].id;
      });
    }, 4500);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  // Resume auto-rotation after 8 seconds of inactivity
  useEffect(() => {
    if (isAutoPlaying) return;

    const resumeTimeout = setTimeout(() => {
      setIsAutoPlaying(true);
    }, 8000);

    return () => clearTimeout(resumeTimeout);
  }, [isAutoPlaying, open]);

  const handlePanelOpen = (id: number) => {
    setOpen(id);
    setIsAutoPlaying(false);
  };

  return (
    <section className="w-full max-w-6xl mx-auto transition-colors duration-300">
      <div className="flex flex-col lg:flex-row h-[550px] lg:h-[450px] w-full rounded-none overflow-hidden bg-zinc-50 dark:bg-zinc-950 transition-colors duration-300">
        {items.map((item) => (
          <Panel
            key={item.id}
            open={open}
            setOpen={handlePanelOpen}
            id={item.id}
            Icon={item.Icon}
            title={item.title}
            imgSrc={item.imgSrc}
            description={item.description}
          />
        ))}
      </div>
    </section>
  );
}

const panelVariants = {
  open: {
    width: "100%",
    height: "100%",
  },
  closed: {
    width: "0%",
    height: "100%",
  },
};

const panelVariantsSm = {
  open: {
    width: "100%",
    height: "280px",
  },
  closed: {
    width: "100%",
    height: "0px",
  },
};

const descriptionVariants = {
  open: {
    opacity: 1,
    y: "0%",
    transition: {
      delay: 0.125,
    },
  },
  closed: { opacity: 0, y: "100%" },
};

const items = [
  {
    id: 1,
    title: "01. Consultation",
    Icon: IconPhoneCall,
    imgSrc: "/images/step1_consultation.webp",
    description: "A free, honest assessment: whether you're ready to apply, what it will cost, and a realistic timeline — before you pay anything.",
  },
  {
    id: 2,
    title: "02. Documentation",
    Icon: IconFiles,
    imgSrc: "/images/step2_documentation.webp",
    description: "Your checklist, cover letter, and application forms — built for your situation. We show you exactly which refundable flights and free-cancellation hotels satisfy the embassy, booked and paid directly by you so you stay in control of your money.",
  },
  {
    id: 3,
    title: "03. Appointment",
    Icon: IconCalendarEvent,
    imgSrc: "/images/step3_appointment.webp",
    description: "We book and manage your biometrics appointment — London, Manchester, or Edinburgh — and hand you your appointment letter once confirmed.",
  },
  {
    id: 4,
    title: "04. Tracking",
    Icon: IconCompass,
    imgSrc: "/images/step4_tracking.webp",
    description: "We track your application wherever the system allows it. Where it doesn't, we follow up directly. Either way, you're not left wondering — and you're covered by our Accountability Promise if we get something wrong.",
  },
];
