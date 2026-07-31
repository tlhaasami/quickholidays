"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useRouter, usePathname } from "next/navigation";
import { BorderBeam } from "@/components/ui/border-beam";

// --- Customizable Delay (30 Seconds by default) ---
const APPEARANCE_DELAY = 30000; // in milliseconds

interface Message {
  sender: "user" | "bot";
  text: string;
  isError?: boolean;
}

export function AiAssistantPopup() {
  const router = useRouter();
  const pathname = usePathname();

  if (
    pathname === "/create-cover-letter" ||
    pathname === "/create-document" ||
    pathname === "/agent-portal"
  ) {
    return null;
  }

  // Visibility & Position states
  const [hasAppeared, setHasAppeared] = useState(false);
  const [isCentered, setIsCentered] = useState(false); // Controls transition to center modal

  // Chat states
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "bot",
      text: "Hello! I am your Schengen Visa Assistant. Are you looking for a visa booking or custom document preparation? I can walk you through our website services, answer details, or connect you with our visa experts directly. How would you like to proceed?"
    }
  ]);
  const [chatMode, setChatMode] = useState(false); // false: initial options, true: chat view
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [invalidCount, setInvalidCount] = useState(0);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const punchlines = [
    "QUICK Holidays Agent",
    "Ask me!",
    "Get Schengen Visa Fast",
    "Track Application Process",
    "Embassy Document Rules?",
    "Direct Visa Assistance"
  ];
  const [punchlineIndex, setPunchlineIndex] = useState(0);
  const [isPunchlineVisible, setIsPunchlineVisible] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleToggle = (e: Event) => {
      const customEvent = e as CustomEvent;
      setIsMobileMenuOpen(!!customEvent.detail?.open);
    };
    window.addEventListener("mobile-menu-toggle", handleToggle);
    return () => window.removeEventListener("mobile-menu-toggle", handleToggle);
  }, []);

  useEffect(() => {
    if (isCentered) return;

    // 1. Initial delay: appear after 11 seconds (when WhatsApp tooltip auto-hides)
    const startTimeout = setTimeout(() => {
      setIsPunchlineVisible(true);
    }, 11000);

    return () => clearTimeout(startTimeout);
  }, [isCentered]);

  useEffect(() => {
    if (!isPunchlineVisible || isCentered) return;

    // 2. Rotate through the punchlines once
    const interval = setInterval(() => {
      setPunchlineIndex((prev) => {
        if (prev >= punchlines.length - 1) {
          setIsPunchlineVisible(false);
          clearInterval(interval);
          return prev;
        }
        return prev + 1;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [isPunchlineVisible, isCentered]);

  // Prevent background scrolling when chat modal is active
  useEffect(() => {
    if (isCentered) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isCentered]);

  // Scroll to bottom on message updates in chat view
  useEffect(() => {
    if (chatMode) {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping, chatMode]);

  // Delayed appearance effect — disabled, bot only opens on manual trigger
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Just mark as appeared so the floating icon shows immediately
      setHasAppeared(true);
    }
  }, []);

  // Listen for manual trigger from Dock
  useEffect(() => {
    const handleOpen = () => {
      setHasAppeared(true);
      setIsCentered(true);
      if (typeof window !== "undefined") {
        sessionStorage.setItem("quick_holidays_ai_agent_shown", "true");
      }
    };
    window.addEventListener("open-ai-assistant", handleOpen);
    return () => window.removeEventListener("open-ai-assistant", handleOpen);
  }, []);

  const handleSend = async (text: string) => {
    if (!text.trim() || invalidCount >= 3) return;

    setMessages((prev) => [...prev, { sender: "user", text }]);
    setInput("");
    setIsTyping(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: text }),
      });

      if (!response.ok) {
        throw new Error("Chat request failed");
      }

      const data = await response.json();
      setMessages((prev) => [...prev, { sender: "bot", text: data.text }]);

      if (data.isValid === false) {
        setInvalidCount((c) => {
          const newCount = c + 1;
          if (newCount >= 3) {
            setTimeout(() => {
              setMessages((prev) => [
                ...prev,
                {
                  sender: "bot",
                  text: "You have reached the maximum number of inquiries outside our Schengen visa scope. To guide you properly, please consult directly with our live agents."
                }
              ]);
            }, 500);
          }
          return newCount;
        });
      }
    } catch (err) {
      console.error("AI assistant fetch error:", err);
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "Our AI Assistant is currently experiencing high demand or request limits. Don't worry! You can get direct help from our team right now.",
          isError: true
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  // Walkthrough Guide Action
  const triggerWalkthrough = () => {
    setChatMode(true);
    setMessages((prev) => [
      ...prev,
      { sender: "user", text: "Walk me through the website services" },
      {
        sender: "bot",
        text: "Here is a quick guide through our primary website services:\n\n1. **Schengen Visa Guides**: Visit our [Visa Selection Selector Hub](/schengen-visa) to view custom checklist templates & embassy lead times by country.\n2. **Pricing**: Go to our [Pricing Plan Overview](/pricing) page. Our primary tier is the **Complete Visa Service** (£175) which covers cover letters, checklists, and automated appointment tracking.\n3. **How It Works**: Visit [How It Works](/how-it-works) to see our simple 4-step preparation process.\n4. **Contact Us**: Navigate to [Contact Us](/contact-us) to take our quick Schengen eligibility wizard and open a case file."
      }
    ]);
  };

  const closeAssistant = () => {
    setIsCentered(false);
    setChatMode(false);
  };

  const parseInlineStyles = (text: string) => {
    return text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
  };

  const renderFormattedMessage = (text: string) => {
    const lines = text.split("\n");
    return (
      <div className="space-y-2.5">
        {lines.map((line, idx) => {
          let cleanLine = line.trim();
          if (!cleanLine) return <div key={idx} className="h-1.5" />;

          const isBullet = cleanLine.startsWith("-") || cleanLine.startsWith("●") || cleanLine.startsWith("*");
          if (isBullet) {
            cleanLine = cleanLine.replace(/^[-●*]\s*/, "");
            return (
              <div key={idx} className="flex items-start gap-2 pl-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                <span
                  className="flex-1 text-zinc-800 dark:text-zinc-300 text-xs font-sans font-light leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: parseInlineStyles(cleanLine) }}
                />
              </div>
            );
          }

          const numMatch = cleanLine.match(/^(\d+)[.)]\s*(.*)/);
          if (numMatch) {
            const num = numMatch[1];
            const content = numMatch[2];
            return (
              <div key={idx} className="flex items-start gap-2 pl-2">
                <span className="text-primary font-semibold text-xs shrink-0">{num}.</span>
                <span
                  className="flex-1 text-zinc-800 dark:text-zinc-300 text-xs font-sans font-light leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: parseInlineStyles(content) }}
                />
              </div>
            );
          }

          let innerHtml = parseInlineStyles(cleanLine);
          const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
          innerHtml = innerHtml.replace(linkRegex, '<a href="$2" class="text-primary hover:underline font-semibold">$1</a>');

          return (
            <p
              key={idx}
              className="text-zinc-800 dark:text-zinc-300 text-xs font-sans font-light leading-relaxed break-words"
              dangerouslySetInnerHTML={{ __html: innerHtml }}
            />
          );
        })}
      </div>
    );
  };

  // Chat bubble mascot — dark circle with gold ring, matching the floating icon
  const renderRobotMascot = (sizeClass = "w-14 h-14") => (
    <div
      className={`${sizeClass} rounded-full bg-[#1a1a1a] flex items-center justify-center relative`}
      style={{ boxShadow: "0 0 0 3px #C99537, 0 8px 32px rgba(201,149,55,0.35)" }}
    >
      {/* Live indicator dot */}
      <span className="absolute top-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white dark:border-zinc-900 animate-pulse" />
      {/* Gold chat bubble */}
      <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="#C99537" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    </div>
  );

  return (
    <>
      {/* Sitting Robot Mascot (bottom right) when minimized - automatically hides when mobile sidebar menu is activated */}
      {!isCentered && !isMobileMenuOpen && (
        <motion.div
          initial={{ scale: 0.8, opacity: 0, y: 30 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          whileHover={{ scale: 1.05 }}
          onClick={() => setIsCentered(true)}
          className="fixed bottom-6 right-6 z-40 w-16 h-16 cursor-pointer pointer-events-auto"
        >
          {/* Rotating Text Label */}
          {isPunchlineVisible && (
            <div className="absolute bottom-full right-0 mb-3.5 bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 text-[11px] font-sans font-semibold tracking-wide px-4 py-2 rounded-xl border border-zinc-800 dark:border-zinc-200 shadow-xl whitespace-nowrap min-h-[32px] flex items-center justify-center gap-2">
              {/* Speech bubble pointer arrow */}
              <div className="absolute top-full right-6 -mt-[5px] w-2 h-2 bg-zinc-950 dark:bg-white border-r border-b border-zinc-800 dark:border-zinc-200 transform rotate-45" />
              
              {/* Pulsing AI Indicator */}
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C99537] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#C99537]"></span>
              </span>

              <AnimatePresence mode="wait">
                <motion.span
                  key={punchlineIndex}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.2 }}
                >
                  {punchlines[punchlineIndex]}
                </motion.span>
              </AnimatePresence>
            </div>
          )}

          {/* Chat Bubble AI Icon — dark circle with gold ring and gold message icon */}
          <div className="w-full h-full rounded-full bg-[#1a1a1a] flex items-center justify-center shadow-2xl"
            style={{ boxShadow: "0 0 0 3px #C99537, 0 8px 32px rgba(201,149,55,0.35)" }}>
            <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="#C99537" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          </div>
        </motion.div>
      )}

      {/* Center Screen Modal view */}
      <AnimatePresence>
        {isCentered && (
          <>
            {/* Dark blurred background backdrop overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeAssistant}
              className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm z-[9990] pointer-events-auto"
            />

            {/* Centered mascot + window container */}
            <div className="fixed inset-0 z-[9995] flex flex-col items-center justify-center p-4 pointer-events-none">
              
              {/* Sitting robot floating down to the center */}
              <motion.div
                initial={{ y: -80, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -80, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 22 }}
                className="mb-4 pointer-events-auto"
              >
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                >
                  <div
                    className="w-16 h-16 rounded-full bg-[#1a1a1a] flex items-center justify-center relative shadow-2xl"
                    style={{ boxShadow: "0 0 0 3px #C99537, 0 8px 32px rgba(201,149,55,0.35)" }}
                  >
                    {/* Live indicator dot */}
                    <span className="absolute top-0.5 right-0.5 w-3 h-3 rounded-full bg-emerald-500 border border-white dark:border-zinc-950 animate-pulse" />
                    
                    {/* Gold chat bubble */}
                    <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="#C99537" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                    </svg>
                  </div>
                </motion.div>
              </motion.div>

              {/* Chat / Options Modal card */}
              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                transition={{ type: "spring", stiffness: 350, damping: 28 }}
                className="relative w-full max-w-[500px] h-[580px] bg-white/95 dark:bg-zinc-950/90 border border-zinc-200/80 dark:border-white/10 rounded-none shadow-2xl flex flex-col overflow-hidden backdrop-blur-xl pointer-events-auto font-sans"
              >
                {/* Glow Border Beam */}
                <BorderBeam size={180} duration={8} colorFrom="#C99537" colorTo="#FBBF24" borderWidth={1.5} />
                {/* Header */}
                <div className="px-5 py-4 bg-gradient-to-r from-zinc-50 to-zinc-100 dark:from-zinc-900/60 dark:to-zinc-900 border-b border-zinc-200 dark:border-white/5 flex items-center justify-between shrink-0">
                  <div>
                    <h4 className="font-semibold text-xs text-zinc-900 dark:text-white leading-tight">Quick Holidays Visa Agent</h4>
                    <span className="text-[10px] text-zinc-500 dark:text-zinc-400 font-light">Direct Assistant Console</span>
                  </div>
                  <button
                    onClick={closeAssistant}
                    className="w-7 h-7 rounded-none bg-red-500/10 hover:bg-red-500 flex items-center justify-center text-red-500 hover:text-white transition-colors cursor-pointer border border-red-500/30 hover:border-red-500"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-5 space-y-4 scrollbar-thin scrollbar-thumb-zinc-300 dark:scrollbar-thumb-zinc-800">
                  
                  {!chatMode ? (
                    <div className="space-y-4">
                      <div className="relative bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/50 dark:border-white/5 p-4 rounded-none text-[13px] text-zinc-800 dark:text-zinc-300 leading-relaxed font-sans font-light">
                        <div className="absolute -top-2 left-6 w-3 h-3 bg-zinc-50 dark:bg-zinc-900 border-t border-l border-zinc-200/50 dark:border-white/5 transform rotate-45" />
                        Hello! I am your Schengen Visa Assistant. Are you looking for a visa booking or custom document preparation? I can walk you through our website services, answer details, or connect you with our visa experts directly. How would you like to proceed?
                      </div>

                      <div className="space-y-2.5 pt-2">
                        <motion.button
                          whileHover={{ scale: 1.02, y: -1 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={triggerWalkthrough}
                          className="w-full py-3.5 px-4 text-left text-xs font-semibold border border-zinc-200 dark:border-white/5 rounded-none bg-zinc-50 dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 hover:border-primary/40 hover:text-primary hover:shadow-[0_8px_20px_rgba(201,149,55,0.05)] dark:hover:shadow-[0_8px_20px_rgba(201,149,55,0.1)] transition-all flex items-center justify-between cursor-pointer font-sans group"
                        >
                          <span>Guide me through website services</span>
                          <span className="text-zinc-400 group-hover:translate-x-1 transition-transform">→</span>
                        </motion.button>
                        
                        <motion.button
                          whileHover={{ scale: 1.02, y: -1 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => {
                            setChatMode(true);
                            handleSend("Tell me about the Complete Visa Service (£175)");
                          }}
                          className="w-full py-3.5 px-4 text-left text-xs font-semibold border border-zinc-200 dark:border-white/5 rounded-none bg-zinc-50 dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 hover:border-primary/40 hover:text-primary hover:shadow-[0_8px_20px_rgba(201,149,55,0.05)] dark:hover:shadow-[0_8px_20px_rgba(201,149,55,0.1)] transition-all flex items-center justify-between cursor-pointer font-sans group"
                        >
                          <span>Ask details / price booking inquiries</span>
                          <span className="text-zinc-400 group-hover:translate-x-1 transition-transform">→</span>
                        </motion.button>

                        <motion.a
                          whileHover={{ scale: 1.02, y: -1 }}
                          whileTap={{ scale: 0.98 }}
                          href="https://wa.me/447828707425?text=Hi,%20I'd%20like%20to%20get%20help%20with%20my%20Schengen%20visa%20application."
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full py-3.5 px-4 text-left text-xs font-semibold border border-emerald-500/20 rounded-none bg-emerald-50/50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 hover:border-emerald-500/40 hover:bg-emerald-500 hover:text-white hover:shadow-[0_8px_20px_rgba(16,185,129,0.08)] transition-all flex items-center justify-between cursor-pointer font-sans group"
                        >
                          <span className="group-hover:text-white transition-colors">Chat with visa experts on WhatsApp</span>
                          <span className="text-emerald-500/70 group-hover:text-white group-hover:translate-x-1 transition-all">→</span>
                        </motion.a>
                      </div>
                    </div>
                  ) : (
                    // Interactive RAG chatbot log
                    <div className="space-y-4">
                      {messages.map((msg, index) => (
                        <div
                          key={index}
                          className={`flex gap-2.5 items-start ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                        >
                          {msg.sender === "bot" && (
                            <div className="w-7 h-7 rounded-none bg-zinc-200 dark:bg-zinc-900 flex items-center justify-center border border-zinc-300 dark:border-white/5 shrink-0 mt-0.5">
                              <svg className="w-3.5 h-3.5 text-zinc-650 dark:text-zinc-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 21m0 0l-.813-5.096M9 21h3.75m-6.75 0h-.75m3-9h.008v.008H12V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3 10.067a1.5 1.5 0 01.072-.467c.75-2.25 2.872-3.85 5.303-3.85h5.25c2.43 0 4.553 1.6 5.303 3.85.048.145.072.298.072.467v3.708c0 .246-.052.488-.152.71l-1.026 2.256c-.347.763-1.115 1.258-1.95 1.258H8.156c-.835 0-1.603-.495-1.95-1.258L5.18 14.485a1.696 1.696 0 01-.152-.71v-3.708z" />
                              </svg>
                            </div>
                          )}
                          <div
                            className={`max-w-[85%] px-3.5 py-2.5 rounded-none text-[13px] shadow-sm ${
                              msg.sender === "user"
                                ? "bg-gradient-to-r from-amber-500 to-primary text-zinc-950 font-semibold"
                                : "bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/50 dark:border-white/5 text-zinc-800 dark:text-zinc-300"
                            }`}
                          >
                            {msg.sender === "bot" ? renderFormattedMessage(msg.text) : msg.text}
                            {msg.isError && (
                              <div className="flex gap-2 mt-3.5">
                                <a
                                  href="/contact-us"
                                  className="px-3 py-2 bg-[#C99537] text-zinc-950 font-bold text-[10px] tracking-wider uppercase border border-zinc-950 dark:border-white text-center flex-1 rounded-lg transition-all hover:brightness-105 active:scale-98"
                                >
                                  Book Consultation
                                </a>
                                <a
                                  href="https://wa.me/447828707425?text=Hi,%20I'd%20like%20to%20get%20help%20with%20my%20Schengen%20visa%20application."
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="px-3 py-2 bg-emerald-600 text-white font-bold text-[10px] tracking-wider uppercase border border-zinc-950 dark:border-white text-center flex-1 rounded-lg transition-all hover:brightness-105 active:scale-98"
                                >
                                  WhatsApp Help
                                </a>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}

                      {isTyping && (
                        <div className="flex gap-2.5 items-center justify-start">
                          <div className="w-7 h-7 rounded-none bg-zinc-200 dark:bg-zinc-900 flex items-center justify-center border border-zinc-300 dark:border-white/5 shrink-0">
                            <svg className="w-3.5 h-3.5 text-zinc-650 dark:text-zinc-400 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                          </div>
                          <div className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/50 dark:border-white/5 text-zinc-500 dark:text-zinc-400 px-3.5 py-2 rounded-none text-[11px] flex items-center gap-1 font-sans">
                            <span>AI Agent is typing</span>
                            <span className="animate-pulse">...</span>
                          </div>
                        </div>
                      )}
                      <div ref={chatEndRef} />
                    </div>
                  )}

                </div>

                {/* Footer Input Area (Always visible) */}
                <div className="p-4 pr-6 pb-6 pt-2 border-t border-zinc-200 dark:border-white/10 bg-zinc-50/20 dark:bg-zinc-900/20 shrink-0">
                  {invalidCount >= 3 ? (
                    <div className="text-center space-y-1.5 py-1">
                      <p className="text-[11px] text-zinc-500 dark:text-zinc-400 font-light leading-relaxed">
                        Limit reached. Please contact our live experts directly on WhatsApp or drop us a message.
                      </p>
                      <a
                        href="https://wa.me/447828707425?text=Hi,%20I'd%20like%20to%20get%20help%20with%20my%20Schengen%20visa%20application."
                        target="_blank"
                        className="inline-block px-4 py-2 bg-emerald-600 text-white font-bold text-xs rounded-lg transition-all hover:brightness-105 active:scale-98"
                      >
                        Send Message
                      </a>
                    </div>
                  ) : (
                    <div className="relative w-full">
                      <div className="relative w-full my-2.5">
                        <input
                          type="text"
                          placeholder="Type custom visa question..."
                          value={input}
                          onChange={(e) => setInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && input.trim()) {
                              setChatMode(true);
                              handleSend(input);
                            }
                          }}
                          className="w-full px-4 py-3.5 text-sm text-zinc-900 dark:text-white bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all !pr-24"
                        />
                        <label className="absolute left-3 -top-2.5 px-1.5 text-[9px] font-extrabold uppercase tracking-widest text-zinc-500 dark:text-zinc-400 bg-white dark:bg-zinc-950">Visa Inquiry</label>
                      </div>
                      <div className="absolute right-2 top-1/2 -translate-y-1/2 z-10 flex items-center">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => {
                            if (input.trim()) {
                              setChatMode(true);
                              handleSend(input);
                            }
                          }}
                          disabled={!input.trim()}
                          className="py-1.5 px-3.5 bg-primary text-zinc-950 font-bold text-xs rounded-lg cursor-pointer disabled:opacity-50 transition-all flex items-center gap-1.5 shrink-0"
                        >
                          <span>Send</span>
                          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </motion.button>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
