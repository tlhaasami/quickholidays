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
  const chatEndRef = useRef<HTMLDivElement>(null);

  const suggestedQuestions = [
    "Do I need a Schengen visa on a UK BRP?",
    "Which embassy is currently the fastest?",
    "What documents are required for tourist visas?",
    "How does the Accountability Promise work?"
  ];

  const handleSend = (text: string) => {
    if (!text.trim()) return;

    setMessages((prev) => [...prev, { sender: "user", text }]);
    setInput("");
    setIsTyping(true);

    // Simulate bot response
    setTimeout(() => {
      let reply = "I'm sorry, I don't have that information. Let me connect you with our visa experts for a direct answer. You can book a free consultation using the button below.";
      
      const query = text.toLowerCase();
      if (query.includes("brp") || query.includes("uk spouse") || query.includes("do i need")) {
        reply = "Yes! If you are a non-UK national residing in the UK on a BRP (Work Visa, Spouse Visa, or Student Visa), you will generally need to apply for a Schengen visa to travel to Europe. Quick Holidays specializes in preparing applications specifically for BRP holders.";
      } else if (query.includes("fastest") || query.includes("embassy") || query.includes("slot")) {
        reply = "Currently, France, Spain, and Italy are receiving the highest volumes. France is generally the fastest for processing once you complete your biometrics, with decisions back in 7 to 10 days. However, slots can be difficult to find. Our automated slot tracking handles that scheduling process for you.";
      } else if (query.includes("document") || query.includes("require") || query.includes("checklist")) {
        reply = "For most applications, you need: 1) A passport valid for 3+ months beyond travel. 2) Valid UK BRP. 3) Fully compiled Schengen form. 4) Travel insurance covering €30k+. 5) Flight & hotel reservations. 6) 3 months of bank statements showing sufficient funds. When you book our Premium Pack, we compile all forms and checklists for you.";
      } else if (query.includes("promise") || query.includes("refund") || query.includes("accountability")) {
        reply = "Our Accountability Promise ensures that if your visa is rejected due to a documentation compilation error on our end, we refund our service fee in full. We back our compilation quality completely.";
      }

      setMessages((prev) => [...prev, { sender: "bot", text: reply }]);
      setIsTyping(false);
    }, 1200);
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  return (
    <div className="bg-white dark:bg-black min-h-screen w-full text-zinc-950 dark:text-white pt-24 pb-48 px-4 sm:px-8 transition-colors duration-300 flex flex-col justify-between">
      <div className="max-w-4xl mx-auto flex flex-col h-full w-full justify-between">
        
        {/* Header */}
        <div className="text-center mb-4 w-full shrink-0">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-serif text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight mb-2 text-zinc-900 dark:text-white"
          >
            Schengen Visa <br />
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
        <div className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-white/10 rounded-2xl shadow-2xl p-4 sm:p-6 flex flex-col h-[480px] mb-4 relative">
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
                onClick={() => handleSend(q)}
                className="text-[11px] sm:text-xs font-sans tracking-wide py-1.5 px-3 rounded-full border border-zinc-200 dark:border-white/10 hover:border-primary hover:text-primary transition-colors text-zinc-500 dark:text-zinc-400 bg-white dark:bg-zinc-900/40 cursor-pointer"
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* Sticky Input panel */}
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

      </div>
    </div>
  );
}
