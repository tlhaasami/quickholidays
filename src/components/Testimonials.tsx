"use client";

import { useState } from "react";
import Image from "next/image";
import { TESTIMONIALS } from "@/constants/data";
import ScrollReveal from "@/components/ScrollReveal";

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState(TESTIMONIALS);
  const [startIndex, setStartIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expandedIndices, setExpandedIndices] = useState<Record<number, boolean>>({});

  // Form states for new review
  const [newName, setNewName] = useState("");
  const [newLocation, setNewLocation] = useState("");
  const [newRating, setNewRating] = useState(5);
  const [newQuote, setNewQuote] = useState("");

  const handlePrev = () => {
    setStartIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setStartIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  const toggleExpand = (idx: number) => {
    setExpandedIndices((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();

    // Pick first default avatar as fallback
    const defaultAvatar = testimonials[0]?.avatar;

    const newReview = {
      name: newName,
      location: newLocation,
      rating: newRating,
      quote: newQuote,
      avatar: defaultAvatar,
    };

    setTestimonials([newReview, ...testimonials]);
    setStartIndex(0); // Reset sliding carousel view to the newest review
    setIsModalOpen(false);

    // Reset form states
    setNewName("");
    setNewLocation("");
    setNewRating(5);
    setNewQuote("");
    setExpandedIndices({}); // Reset expanded cards
  };

  const getVisibleIndices = () => {
    if (testimonials.length === 0) return [];
    const indices = [];
    // Show up to 3 cards on desktop
    const count = Math.min(3, testimonials.length);
    if (testimonials.length <= 3) {
      // Keep static and ordered if 3 or fewer reviews
      for (let i = 0; i < count; i++) {
        indices.push(i);
      }
    } else {
      // Slide cyclically if 4 or more reviews
      for (let i = 0; i < count; i++) {
        indices.push((startIndex + i) % testimonials.length);
      }
    }
    return indices;
  };

  const visibleIndices = getVisibleIndices();

  return (
    <section className="bg-brand-cream/20 pt-20 sm:pt-28 pb-12 sm:pb-16 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Testimonials Header (Without slider buttons) */}
        <ScrollReveal animation="fade-up">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6 mb-12 sm:mb-16">
            <div className="text-left">
              <span className="text-sm font-bold tracking-widest text-brand-gold uppercase block mb-3">
                What Our Clients Say
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-brand-navy leading-tight">
                Real Stories, Real Satisfaction
              </h2>
            </div>
          </div>
        </ScrollReveal>
 
        {/* Testimonials Container (With floating golden slider buttons) */}
        <div className="relative px-4 sm:px-12">
          
          {/* Floating Gold Left Button (Desktop only, visible when there are > 3 reviews) */}
          {testimonials.length > 3 && (
            <button
              onClick={handlePrev}
              className="hidden md:flex absolute left-0 lg:left-[-12px] top-1/2 -translate-y-1/2 z-20 items-center justify-center w-12 h-12 rounded-full bg-brand-navy text-white hover:bg-brand-gold hover:text-brand-navy hover:scale-[1.08] active:scale-95 transition-all duration-300 shadow-md hover:shadow-[0_0_15px_rgba(204,163,82,0.45)] border border-brand-gold/20"
              aria-label="Previous testimonial"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={3}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </button>
          )}

          {/* Floating Gold Right Button (Desktop only, visible when there are > 3 reviews) */}
          {testimonials.length > 3 && (
            <button
              onClick={handleNext}
              className="hidden md:flex absolute right-0 lg:right-[-12px] top-1/2 -translate-y-1/2 z-20 items-center justify-center w-12 h-12 rounded-full bg-brand-navy text-white hover:bg-brand-gold hover:text-brand-navy hover:scale-[1.08] active:scale-95 transition-all duration-300 shadow-md hover:shadow-[0_0_15px_rgba(204,163,82,0.45)] border border-brand-gold/20"
              aria-label="Next testimonial"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={3}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </button>
          )}
 
          {/* Desktop Layout (Show 3 cards starting from startIndex with unified sliding view) */}
          <div className="hidden md:grid md:grid-cols-3 gap-8 items-start">
            {visibleIndices.map((originalIdx) => {
              const t = testimonials[originalIdx];
              if (!t) return null;
              const isExpanded = expandedIndices[originalIdx] || false;
              
              return (
                <ScrollReveal key={t.name} animation="fade-in" duration={500} className="h-full">
                  <div
                    className={`flex flex-col bg-[#F9F8F6] rounded-[24px] p-8 border-[1.5px] border-brand-gold/25 shadow-[0_4px_20px_rgba(15,33,72,0.03)] transition-all duration-300 hover:shadow-[0_12px_30px_rgba(15,33,72,0.08)] hover:border-brand-gold select-none ${
                      isExpanded ? "h-auto min-h-[320px]" : "h-[320px]"
                    }`}
                  >
                    {/* Stars Rating */}
                    <div className="flex gap-1 mb-6 text-brand-gold">
                      {[...Array(t.rating)].map((_, i) => (
                        <svg
                          key={i}
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="w-4 h-4"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                            clipRule="evenodd"
                          />
                        </svg>
                      ))}
                    </div>

                    {/* Expandable Quote Text */}
                    <div className="flex-grow flex flex-col justify-between">
                      <div className="cursor-pointer text-left" onClick={() => toggleExpand(originalIdx)}>
                        <p className={`text-slate-600 text-[14px] leading-relaxed mb-2 transition-all duration-200 ${
                          isExpanded ? "" : "line-clamp-4"
                        }`}>
                          {t.quote}
                        </p>
                        {t.quote.length > 170 && (
                          <button
                            type="button"
                            className="text-[11px] font-bold text-brand-gold hover:text-brand-gold-dark transition-colors mb-4"
                          >
                            {isExpanded ? "Show Less" : "... Read More"}
                          </button>
                        )}
                      </div>

                      {/* Author Info */}
                      <div className="flex items-center gap-4 pt-2">
                        <div className="relative w-12 h-12 rounded-full overflow-hidden border border-brand-navy/5 bg-slate-100 flex-shrink-0">
                          <Image
                            src={t.avatar}
                            alt={t.name}
                            fill
                            sizes="48px"
                            className="object-cover"
                          />
                        </div>
                        <div className="text-left">
                          <h4 className="text-sm font-bold text-brand-navy">{t.name}</h4>
                          <p className="text-[11px] text-slate-500 font-medium mt-0.5">{t.location}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
 
          {/* Mobile Slider View (Show 1 card at a time with touch/button support) */}
          <div className="block md:hidden">
            {testimonials[startIndex] && (() => {
              const t = testimonials[startIndex];
              const isExpanded = expandedIndices[startIndex] || false;
              
              return (
                <ScrollReveal key={`mobile-${t.name}`} animation="scale-in">
                  <div
                    className={`flex flex-col bg-[#F9F8F6] rounded-[24px] p-6 border-[1.5px] border-brand-gold/25 shadow-[0_4px_20px_rgba(15,33,72,0.03)] justify-between transition-all duration-300 hover:border-brand-gold ${
                      isExpanded ? "h-auto min-h-[300px]" : "h-[300px]"
                    }`}
                  >
                    <div>
                      {/* Stars */}
                      <div className="flex gap-1 mb-5 text-brand-gold">
                        {[...Array(t.rating)].map((_, i) => (
                          <svg
                            key={i}
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="w-4.5 h-4.5"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                              clipRule="evenodd"
                            />
                          </svg>
                        ))}
                      </div>

                      {/* Expandable Quote Text */}
                      <div className="cursor-pointer text-left" onClick={() => toggleExpand(startIndex)}>
                        <p className={`text-slate-600 text-sm leading-relaxed mb-2 transition-all duration-200 ${
                          isExpanded ? "" : "line-clamp-4"
                        }`}>
                          {t.quote}
                        </p>
                        {t.quote.length > 150 && (
                          <button
                            type="button"
                            className="text-[11px] font-bold text-brand-gold hover:text-brand-gold-dark transition-colors mb-4"
                          >
                            {isExpanded ? "Show Less" : "... Read More"}
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Author Info */}
                    <div className="flex items-center gap-4 pt-2">
                      <div className="relative w-12 h-12 rounded-full overflow-hidden border border-brand-navy/5 bg-slate-100 flex-shrink-0">
                        <Image
                          src={t.avatar}
                          alt={t.name}
                          fill
                          sizes="48px"
                          className="object-cover"
                        />
                      </div>
                      <div className="text-left">
                        <h4 className="text-sm font-bold text-brand-navy">
                          {t.name}
                        </h4>
                        <p className="text-xs text-slate-500 font-medium mt-0.5">
                          {t.location}
                        </p>
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              );
            })()}
            
            {/* Dot Indicators */}
            <div className="flex justify-center gap-2 mt-6">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setStartIndex(i)}
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    i === startIndex ? "w-6 bg-brand-gold" : "w-2.5 bg-brand-gold/30"
                  }`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Write a Review Button Section */}
        <ScrollReveal animation="fade-in" delay={200}>
          <div className="flex justify-center mt-12">
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center justify-center gap-2.5 rounded-full bg-brand-navy hover:bg-brand-gold hover:text-brand-navy hover:shadow-[0_0_20px_rgba(204,163,82,0.45)] hover:scale-[1.04] active:scale-[0.98] transition-all duration-300 px-8 py-3.5 text-sm font-bold text-white shadow-md cursor-pointer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2.5}
                stroke="currentColor"
                className="w-4.5 h-4.5"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
              </svg>
              Write a Review
            </button>
          </div>
        </ScrollReveal>

      </div>

      {/* Write a Review Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-brand-navy/60 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="bg-brand-cream border border-brand-gold/20 rounded-[32px] max-w-lg w-full p-8 shadow-2xl relative transition-all duration-300">
            
            {/* Close Button */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute right-6 top-6 text-slate-500 hover:text-brand-navy transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <h3 className="font-serif text-2xl font-bold text-brand-navy mb-2">Write a Review</h3>
            <p className="text-sm text-slate-600 mb-6">Share your Schengen Visa experience with Quick Holidays.</p>

            <form onSubmit={handleSubmitReview} className="space-y-4 text-left">
              <div>
                <label htmlFor="modal-name" className="block text-xs font-bold text-brand-navy uppercase tracking-wider mb-2">Your Name</label>
                <input
                  id="modal-name"
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. John Doe"
                  className="w-full rounded-xl border border-brand-gold/30 bg-white px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:border-brand-gold focus:outline-none focus:ring-1 focus:ring-brand-gold/40 transition-all duration-200"
                />
              </div>

              <div>
                <label htmlFor="modal-location" className="block text-xs font-bold text-brand-navy uppercase tracking-wider mb-2">Location</label>
                <input
                  id="modal-location"
                  type="text"
                  required
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  placeholder="e.g. London, United Kingdom"
                  className="w-full rounded-xl border border-brand-gold/30 bg-white px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:border-brand-gold focus:outline-none focus:ring-1 focus:ring-brand-gold/40 transition-all duration-200"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-brand-navy uppercase tracking-wider mb-2">Rating</label>
                <div className="flex gap-1.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setNewRating(star)}
                      className={`transition-colors duration-200 cursor-pointer ${star <= newRating ? "text-brand-gold" : "text-slate-300 hover:text-brand-gold/60"}`}
                      aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
                        <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                      </svg>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label htmlFor="modal-quote" className="block text-xs font-bold text-brand-navy uppercase tracking-wider mb-2">Your Review</label>
                <textarea
                  id="modal-quote"
                  required
                  rows={4}
                  value={newQuote}
                  onChange={(e) => setNewQuote(e.target.value)}
                  placeholder="Tell us about the process, appointment booking, or support..."
                  className="w-full rounded-xl border border-brand-gold/30 bg-white px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:border-brand-gold focus:outline-none focus:ring-1 focus:ring-brand-gold/40 transition-all duration-200 resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full inline-flex items-center justify-center rounded-full bg-brand-navy hover:bg-brand-gold hover:text-brand-navy hover:shadow-[0_0_20px_rgba(204,163,82,0.45)] hover:scale-[1.02] active:scale-[0.99] transition-all duration-300 px-8 py-3.5 text-sm font-bold text-white shadow-md cursor-pointer"
              >
                Submit Review
              </button>
            </form>

          </div>
        </div>
      )}
    </section>
  );
}
