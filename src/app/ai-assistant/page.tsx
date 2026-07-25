"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "motion/react";
import { Highlighter } from "@/components/ui/highlighter";
import { ThemeButton } from "@/components/ThemeButton";

interface Message {
  sender: "user" | "bot";
  text: string;
}

export default function AiAssistant() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "bot",
      text: "Hello! I am your Quick Holidays Visa Assistant. I can help answer common questions about Schengen visa rules, document requirements, and embassy wait times. What is your visa inquiry?"
    }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [invalidCount, setInvalidCount] = useState(0);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const suggestedQuestions = [
    "Do I need a Schengen visa on a UK BRP?",
    "Which embassy is currently the fastest?",
    "What documents are required for tourist visas?",
    "How does the Accountability Promise work?"
  ];

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
                  text: "You have reached the maximum number of inquiries outside our Schengen visa consultancy scope. To guide you properly, please consult directly with our live agents."
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
          text: "I'm sorry, I'm having trouble connecting. Let me connect you with our visa experts for a direct answer. You can book a free consultation using the link below."
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  return (
    <div className="bg-white dark:bg-black min-h-screen w-full text-zinc-950 dark:text-white pt-24 pb-32 px-4 sm:px-8 transition-colors duration-300 flex flex-col justify-start">
      <div className="max-w-4xl mx-auto flex flex-col w-full gap-4">
        
        {/* Header */}
        <div className="text-center mb-2 w-full shrink-0">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-serif text-2xl sm:text-3xl md:text-4xl font-medium tracking-tight mb-2 text-zinc-900 dark:text-white"
          >
            Schengen Visa{" "}
            <span className="text-primary">
              <Highlighter action="underline" color="#CCA352" strokeWidth={2.5} isView={true}>
                AI Consult Assistant.
              </Highlighter>
            </span>
          </motion.h1>
          <p className="font-sans text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 font-light max-w-lg mx-auto leading-relaxed">
            Get instant answers to embassy rules, travel checklists, and visa processing parameters.
          </p>
        </div>

        {/* Chat Window */}
        <div className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-white/10 rounded-2xl shadow-2xl p-4 sm:p-6 flex flex-col h-[350px] sm:h-[400px] relative">
          {/* Scrollable messages container */}
          <div className="flex-1 overflow-y-auto space-y-4 pr-2 scrollbar-thin scrollbar-thumb-zinc-300 dark:scrollbar-thumb-zinc-800">
            {messages.map((msg, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed ${
                    msg.sender === "user"
                      ? "bg-primary text-white rounded-br-none"
                      : "bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/5 text-zinc-800 dark:text-zinc-300 rounded-bl-none shadow-sm"
                  }`}
                >
                  {msg.text}
                </div>
              </motion.div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/5 text-zinc-450 dark:text-zinc-500 p-4 rounded-2xl rounded-bl-none text-xs font-sans tracking-widest flex items-center gap-1">
                  <span>Assistant is thinking</span>
                  <span className="animate-pulse">...</span>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Quick suggestions */}
          <div className="flex flex-wrap gap-2 pt-3 border-t border-zinc-200 dark:border-white/5 mt-3 shrink-0">
            {suggestedQuestions.map((q) => (
              <button
                key={q}
                onClick={() => invalidCount < 3 && handleSend(q)}
                disabled={invalidCount >= 3}
                className="text-[11px] sm:text-xs font-sans tracking-wide py-1.5 px-3 rounded-full border border-zinc-200 dark:border-white/10 hover:border-primary hover:text-primary transition-colors text-zinc-500 dark:text-zinc-400 bg-white dark:bg-zinc-900/40 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* Sticky Input panel / WhatsApp card */}
        {invalidCount >= 3 ? (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-500/30 rounded-2xl p-6 text-center shadow-lg flex flex-col items-center gap-4 shrink-0"
          >
            <div className="w-12 h-12 bg-emerald-600 text-white rounded-full flex items-center justify-center shadow-md animate-pulse">
              <svg className="w-6 h-6 fill-white" viewBox="0 0 24 24">
                <path d="M19.05 4.91A9.82 9.82 0 0 0 12.04 2c-5.46 0-9.91 4.45-9.91 9.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21c5.46 0 9.91-4.45 9.91-9.91c0-2.65-1.03-5.14-2.9-7.01m-7.01 15.24c-1.48 0-2.93-.4-4.2-1.15l-.3-.18l-3.12.82l.83-3.04l-.2-.31a8.26 8.26 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24c2.2 0 4.27.86 5.82 2.42a8.18 8.18 0 0 1 2.41 5.83c.02 4.54-3.68 8.23-8.22 8.23m4.52-6.16c-.25-.12-1.47-.72-1.69-.81c-.23-.08-.39-.12-.56.12c-.17.25-.64.81-.78.97c-.14.17-.29.19-.54.06c-.25-.12-1.05-.39-1.99-1.23c-.74-.66-1.23-1.47-1.38-1.72c-.14-.25-.02-.38.11-.51c.11-.11.25-.29.37-.43s.17-.25.25-.41c.08-.17.04-.31-.02-.43s-.56-1.34-.76-1.84c-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31c-.22.25-.86.85-.86 2.07s.89 2.4 1.01 2.56c.12.17 1.75 2.67 4.23 3.74c.59.26 1.05.41 1.41.52c.59.19 1.13.16 1.56.1c.48-.07 1.47-.6 1.67-1.18c.21-.58.21-1.07.14-1.18s-.22-.16-.47-.28" />
              </svg>
            </div>
            <div>
              <h4 className="font-serif text-lg font-bold text-zinc-900 dark:text-white mb-1">Connect with our Agents</h4>
              <p className="font-sans text-xs text-zinc-650 dark:text-zinc-400 font-light max-w-md mx-auto leading-relaxed">
                You can contact our agents directly on WhatsApp at **+44 7828 707425**. They will guide you through the process step-by-step.
              </p>
            </div>
            <a
              href="https://wa.me/447828707425?text=Hi,%20I'd%20like%20to%20get%20help%20with%20my%20Schengen%20visa%20application."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-650 hover:bg-emerald-600 text-white font-bold rounded-xl transition-all shadow-md active:scale-98 text-xs cursor-pointer"
            >
              Contact our Agents
            </a>
          </motion.div>
        ) : (
          <div className="w-full flex flex-col gap-3 shrink-0">
            <div className="w-full flex gap-3 items-end">
              <div className="brutalist-container flex-1">
                <input
                  type="text"
                  placeholder="Type your Schengen visa question..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend(input)}
                  className="brutalist-input smooth-type"
                />
                <label className="brutalist-label">Your Question</label>
              </div>
              <button
                onClick={() => handleSend(input)}
                className="px-6 py-3.5 bg-primary text-white font-bold border-3 border-black dark:border-white hover:bg-primary/90 transition-all cursor-pointer shadow-[3px_3px_0_#000] dark:shadow-[3px_3px_0_#fff] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none shrink-0"
              >
                Send
              </button>
            </div>

            {/* Compact CTA */}
            <div className="text-center flex items-center justify-center gap-2 text-xs">
              <span className="text-zinc-450 font-sans">Need human assistance?</span>
              <Link href="/contact-us" className="text-primary hover:underline font-bold">
                Connect to Visa Officer
              </Link>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
