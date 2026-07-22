"use client";

import React from "react";
import { Star, ShieldCheck, Quote } from "lucide-react";
import { mockTestimonials, Testimonial } from "../../utils/mockData";

export function TestimonialsSection() {
  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <span className="text-xs font-bold text-amber-500 uppercase tracking-widest flex items-center justify-center gap-1.5 mb-1">
          <ShieldCheck className="w-3.5 h-3.5" />
          Verified Buyer Experiences
        </span>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
          Trusted By Thousands Of Shoppers & Creators
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {mockTestimonials.map((review: Testimonial) => (
          <div
            key={review.id}
            className="bg-card border border-border rounded-2xl p-6 flex flex-col justify-between hover:border-zinc-400/50 dark:hover:border-zinc-700 transition-all duration-300 relative group shadow-sm hover:shadow-xl"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-1">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-500 text-amber-500" />
                  ))}
                </div>
                <Quote className="w-8 h-8 text-muted/30 group-hover:text-amber-500/20 transition-colors" />
              </div>

              <p className="text-xs sm:text-sm text-foreground leading-relaxed italic">
                &ldquo;{review.comment}&rdquo;
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-border flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-800 border border-border flex items-center justify-center text-xl shadow-inner">
                {review.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-bold text-foreground truncate">
                  {review.userName}
                </h4>
                <p className="text-[10px] text-muted-foreground truncate">
                  {review.userRole}
                </p>
              </div>

              {review.verifiedPurchase && (
                <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-mono">
                  VERIFIED
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default TestimonialsSection;
