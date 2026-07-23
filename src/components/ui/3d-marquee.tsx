"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";

export const ThreeDMarquee = ({
  images,
  className,
  columns = 5,
  speedOdd = 15,
  speedEven = 20,
  gap = 32,
  hoverTranslateY = -15,
  size = 2400,
  scaleMobile = 0.65,
  scaleTablet = 0.9,
  scaleDesktop = 1.35,
}: {
  images: string[];
  className?: string;
  columns?: number;
  speedOdd?: number;
  speedEven?: number;
  gap?: number;
  hoverTranslateY?: number;
  size?: number;
  scaleMobile?: number;
  scaleTablet?: number;
  scaleDesktop?: number;
}) => {
  // Insert the logo placeholder dynamically at the mathematically computed center position
  const logoPlaceholder = "logo-placeholder";
  const totalCards = images.length + 1;
  const chunkSize = Math.ceil(totalCards / columns);

  const colIndexMiddle = Math.floor(columns / 2);
  const rowIndexMiddle = Math.floor(chunkSize / 2);
  const logoIndex = colIndexMiddle * chunkSize + rowIndexMiddle;

  // Insert logo placeholder without mutating the original array
  const combinedImages = [...images];
  combinedImages.splice(logoIndex, 0, logoPlaceholder);

  // Split the combined array into equal parts based on configured columns
  const chunks = Array.from({ length: columns }, (_, colIndex) => {
    const start = colIndex * chunkSize;
    return combinedImages.slice(start, start + chunkSize);
  });



  return (
    <div
      className={cn(
        "mx-auto block h-screen w-screen overflow-hidden rounded-none",
        className,
      )}
    >
      <div className="flex size-full items-center justify-center overflow-hidden">
        {/* Dynamic canvas wrapper scaled to fill the viewport and rotated in 3D */}
        <div
          style={
            {
              width: `${size}px`,
              height: `${size}px`,
              "--scale-mobile": scaleMobile,
              "--scale-tablet": scaleTablet,
              "--scale-desktop": scaleDesktop,
            } as React.CSSProperties
          }
          className="shrink-0 origin-center transition-all duration-300 scale-[var(--scale-mobile)] sm:scale-[var(--scale-tablet)] lg:scale-[var(--scale-desktop)]"
        >
          <div
            style={{
              transform: "rotateX(55deg) rotateY(0deg) rotateZ(-45deg)",
              gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
              gap: `${gap}px`,
            }}
            className="grid size-full origin-center transform-3d"
          >
            {chunks.map((subarray, colIndex) => {
              const isMiddleColumn = colIndex === colIndexMiddle;

              return (
                <motion.div
                  // Lock the middle column containing the logo to always remain static and centered
                  animate={isMiddleColumn ? { y: 0 } : { y: colIndex % 2 === 0 ? 100 : -100 }}
                  transition={
                    isMiddleColumn
                      ? { duration: 0 }
                      : {
                        duration: colIndex % 2 === 0 ? speedEven : speedOdd,
                        repeat: Infinity,
                        repeatType: "reverse",
                      }
                  }
                  key={colIndex + "marquee"}
                  style={{ gap: `${gap}px` }}
                  className="flex flex-col items-center justify-center"
                >
                  <GridLineVertical className="-left-4" offset="80px" />
                  {subarray.map((item, itemIndex) => {
                    if (item === logoPlaceholder) {
                      const fifthFlag = images[4] || "";
                      return (
                        <div className="relative w-full" key="grid-logo">
                          <GridLineHorizontal className="-top-4" offset="20px" />
                          <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 30 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            transition={{
                              duration: 0.8,
                              delay: (colIndex * chunkSize + itemIndex) * 0.05,
                              ease: [0.16, 1, 0.3, 1],
                            }}
                            className="w-full"
                          >
                            <motion.img
                              whileHover={{
                                y: hoverTranslateY,
                              }}
                              transition={{
                                duration: 0.3,
                                ease: "easeInOut",
                              }}
                              src={fifthFlag}
                              alt="5th Flag"
                              className="aspect-[970/700] rounded-lg object-cover ring ring-gray-950/5 hover:shadow-2xl w-full"
                              width={970}
                              height={700}
                            />
                          </motion.div>
                        </div>
                      );
                    }

                    // Avoid rendering empty placeholders if chunk calculations extend slightly past images
                    if (!item) return null;

                    return (
                      <div className="relative w-full" key={itemIndex + item}>
                        <GridLineHorizontal className="-top-4" offset="20px" />
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9, y: 30 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          transition={{
                            duration: 0.8,
                            delay: (colIndex * chunkSize + itemIndex) * 0.05,
                            ease: [0.16, 1, 0.3, 1],
                          }}
                          className="w-full"
                        >
                          <motion.img
                            whileHover={{
                              y: hoverTranslateY,
                            }}
                            transition={{
                              duration: 0.3,
                              ease: "easeInOut",
                            }}
                            src={item}
                            alt={`Flag ${itemIndex + 1}`}
                            className="aspect-[970/700] rounded-lg object-cover ring ring-gray-950/5 hover:shadow-2xl w-full"
                            width={970}
                            height={700}
                          />
                        </motion.div>
                      </div>
                    );
                  })}
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

const GridLineHorizontal = ({
  className,
  offset,
}: {
  className?: string;
  offset?: string;
}) => {
  return (
    <div
      style={
        {
          "--background": "#ffffff",
          "--color": "rgba(255, 255, 255, 0.15)",
          "--height": "1px",
          "--width": "5px",
          "--fade-stop": "90%",
          "--offset": offset || "200px",
          "--color-dark": "rgba(255, 255, 255, 0.15)",
          maskComposite: "exclude",
        } as React.CSSProperties
      }
      className={cn(
        "absolute left-[calc(var(--offset)/2*-1)] h-[var(--height)] w-[calc(100%+var(--offset))]",
        "bg-[linear-gradient(to_right,var(--color),var(--color)_50%,transparent_0,transparent)]",
        "[background-size:var(--width)_var(--height)]",
        "[mask:linear-gradient(to_left,var(--background)_var(--fade-stop),transparent),_linear-gradient(to_right,var(--background)_var(--fade-stop),transparent),_linear-gradient(black,black)]",
        "[mask-composite:exclude]",
        "z-30",
        "dark:bg-[linear-gradient(to_right,var(--color-dark),var(--color-dark)_50%,transparent_0,transparent)]",
        className,
      )}
    ></div>
  );
};

const GridLineVertical = ({
  className,
  offset,
}: {
  className?: string;
  offset?: string;
}) => {
  return (
    <div
      style={
        {
          "--background": "#ffffff",
          "--color": "rgba(255, 255, 255, 0.15)",
          "--height": "5px",
          "--width": "1px",
          "--fade-stop": "90%",
          "--offset": offset || "150px",
          "--color-dark": "rgba(255, 255, 255, 0.15)",
          maskComposite: "exclude",
        } as React.CSSProperties
      }
      className={cn(
        "absolute top-[calc(var(--offset)/2*-1)] h-[calc(100%+var(--offset))] w-[var(--width)]",
        "bg-[linear-gradient(to_bottom,var(--color),var(--color)_50%,transparent_0,transparent)]",
        "[background-size:var(--width)_var(--height)]",
        "[mask:linear-gradient(to_top,var(--background)_var(--fade-stop),transparent),_linear-gradient(to_bottom,var(--background)_var(--fade-stop),transparent),_linear-gradient(black,black)]",
        "[mask-composite:exclude]",
        "z-30",
        "dark:bg-[linear-gradient(to_bottom,var(--color-dark),var(--color-dark)_50%,transparent_0,transparent)]",
        className,
      )}
    ></div>
  );
};
