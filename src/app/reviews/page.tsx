"use client";

import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { ThemeButton } from "@/components/ThemeButton";
import { Highlighter } from "@/components/ui/highlighter";

function VideoCard({ video }: { video: any }) {
  const elementId = `reviews-yt-player-${video.id}`;
  return (
    <div className="relative aspect-[9/16] w-full max-w-[240px] rounded-2xl border border-zinc-200 dark:border-white/10 bg-black shadow-lg overflow-hidden group">
      {/* Video Iframe Player Container with Top Cropping */}
      <div className="absolute top-[-50px] left-0 w-full h-[calc(100%+50px)] overflow-hidden z-10">
        <iframe
          id={elementId}
          src={`https://www.youtube.com/embed/${video.youtubeId}?enablejsapi=1&rel=0&modestbranding=1&playsinline=1&controls=1`}
          title={`${video.name} review`}
          className="w-full h-full object-cover border-0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    </div>
  );
}

export default function Reviews() {
  const [videoReviews, setVideoReviews] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch reviews dynamically from the Postgres database
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch("/api/video-reviews");
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.reviews) {
            setVideoReviews(data.reviews);
          }
        }
      } catch (err) {
        console.error("Failed to load reviews from API:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);

  // Detect mobile viewport
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Handle postMessage API to sync and pause overlapping videos
  useEffect(() => {
    const handleYoutubeMessage = (e: MessageEvent) => {
      if (typeof e.origin === "string" && e.origin.includes("youtube.com")) {
        try {
          const data = typeof e.data === "string" ? JSON.parse(e.data) : e.data;
          if (data.event === "onStateChange" && data.info === 1) {
            const iframes = document.querySelectorAll("iframe");
            let playingIframeId: string | null = null;
            
            iframes.forEach((iframe) => {
              if (iframe.contentWindow === e.source) {
                playingIframeId = iframe.id;
              }
            });

            if (playingIframeId) {
              iframes.forEach((iframe) => {
                if (iframe.id !== playingIframeId && iframe.id.includes("reviews-yt-player")) {
                  iframe.contentWindow?.postMessage(
                    JSON.stringify({ event: "command", func: "pauseVideo", args: "" }),
                    "*"
                  );
                }
              });
            }
          }
        } catch (err) {}
      }
    };

    window.addEventListener("message", handleYoutubeMessage);
    return () => window.removeEventListener("message", handleYoutubeMessage);
  }, []);

  // Injects Google Review schemas for SEO optimization
  const jsonLdSchema = videoReviews.map((rev) => ({
    "@context": "https://schema.org",
    "@type": "Review",
    "itemReviewed": {
      "@type": "LocalBusiness",
      "name": "Quick Holidays Ltd",
      "image": "/logos/logo.svg",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Office 25 Innovation Park, Edge Lane",
        "addressLocality": "Liverpool",
        "postalCode": "L7 9NJ",
        "addressCountry": "GB"
      }
    },
    "reviewRating": {
      "@type": "Rating",
      "ratingValue": "5",
      "bestRating": "5"
    },
    "author": {
      "@type": "Person",
      "name": rev.name
    },
    "reviewBody": rev.caption,
    "publisher": {
      "@type": "Organization",
      "name": "Quick Holidays"
    }
  }));

  const itemsPerPage = isMobile ? 1 : 3;
  const maxIndex = Math.max(0, videoReviews.length - itemsPerPage);

  return (
    <div className="bg-white dark:bg-black min-h-screen text-zinc-950 dark:text-white pt-32 pb-24 px-8 sm:px-16 md:px-24 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        
        {/* Schema Script Injection */}
        {jsonLdSchema.map((schema, idx) => (
          <script
            key={idx}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
          />
        ))}

        {/* Intro */}
        <div className="text-center mb-16">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="font-serif text-5xl sm:text-6xl font-medium tracking-tight mb-4 text-zinc-900 dark:text-white"
          >
            Real <Highlighter action="underline" color="#C99537" strokeWidth={2.5} isView={true}>clients.</Highlighter> Real <Highlighter action="highlight" color="#CCA35255" isView={true}>decisions.</Highlighter>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-sans text-base sm:text-lg text-zinc-650 dark:text-zinc-400 font-light max-w-xl mx-auto"
          >
            Watch what UK resident permit holders say about their Schengen visa experiences with us.
          </motion.p>
        </div>

        {loading ? (
          <div className="text-center py-20 font-sans text-sm text-zinc-500">
            Loading video reviews database...
          </div>
        ) : videoReviews.length === 0 ? (
          <div className="text-center py-20 font-sans text-sm text-zinc-500">
            No video reviews found.
          </div>
        ) : (
          <div className="flex items-center justify-center gap-4 sm:gap-6 max-w-5xl mx-auto mb-20">
            {/* Prev Arrow */}
            <button
              onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
              disabled={currentIndex === 0}
              className="p-3 rounded-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 text-zinc-900 dark:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-20 disabled:cursor-not-allowed transition-all shadow-md z-30 shrink-0 cursor-pointer"
              aria-label="Previous review"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </button>

            {/* Viewport content */}
            <div className="w-full overflow-hidden">
              <div 
                className="flex transition-transform duration-500 ease-out"
                style={{ transform: `translate3d(-${currentIndex * (isMobile ? 100 : 33.3333)}%, 0, 0)` }}
              >
                {videoReviews.map((video) => (
                  <div 
                    key={video.id}
                    className="shrink-0 w-full md:w-1/3 px-3 flex justify-center"
                  >
                    <VideoCard video={video} />
                  </div>
                ))}
              </div>
            </div>

            {/* Next Arrow */}
            <button
              onClick={() => {
                setCurrentIndex((prev) => Math.min(maxIndex, prev + 1));
              }}
              disabled={currentIndex >= maxIndex}
              className="p-3 rounded-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 text-zinc-900 dark:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-20 disabled:cursor-not-allowed transition-all shadow-md z-30 shrink-0 cursor-pointer"
              aria-label="Next review"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </button>
          </div>
        )}

        {/* Closing CTA */}
        <div className="text-center">
          <ThemeButton href="/contact-us">
            Start Your Schengen Application
          </ThemeButton>
        </div>
      </div>
    </div>
  );
}
