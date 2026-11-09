"use client"

import React from "react"
import { Star, ShieldCheck, Quote } from "lucide-react"
import { mockTestimonials, Testimonial } from "../../utils/mockData"

export function TestimonialsSection() {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto mb-10 max-w-2xl text-center">
        <span className="mb-1 flex items-center justify-center gap-1.5 text-xs font-bold tracking-widest text-amber-500 uppercase">
          <ShieldCheck className="h-3.5 w-3.5" />
          Verified Buyer Experiences
        </span>
        <h2 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
          Trusted By Thousands Of Shoppers & Creators
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {mockTestimonials.map((review: Testimonial) => (
          <div
            key={review.id}
            className="group relative flex flex-col justify-between rounded-2xl border border-border bg-card p-6 shadow-sm transition-all duration-300 hover:border-zinc-400/50 hover:shadow-xl dark:hover:border-zinc-700"
          >
            <div>
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-1">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 fill-amber-500 text-amber-500"
                    />
                  ))}
                </div>
                <Quote className="h-8 w-8 text-muted/30 transition-colors group-hover:text-amber-500/20" />
              </div>

              <p className="text-xs leading-relaxed text-foreground italic sm:text-sm">
                &ldquo;{review.comment}&rdquo;
              </p>
            </div>

            <div className="mt-6 flex items-center gap-3 border-t border-border pt-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-zinc-100 text-xl shadow-inner dark:bg-zinc-800">
                {review.avatar}
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="truncate text-xs font-bold text-foreground">
                  {review.userName}
                </h4>
                <p className="truncate text-[10px] text-muted-foreground">
                  {review.userRole}
                </p>
              </div>

              {review.verifiedPurchase && (
                <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 font-mono text-[9px] font-bold text-emerald-600 dark:text-emerald-400">
                  VERIFIED
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default TestimonialsSection
