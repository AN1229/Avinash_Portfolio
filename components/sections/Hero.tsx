"use client";

import { ArrowDown, ChevronDown, Download } from "lucide-react";
import { motion } from "motion/react";
import {
  INNER_PLANETS,
  OrbitalHeroSection,
  SOLAR_SYSTEM,
} from "@/components/ui/orbital-hero";
import { BlurFade } from "@/components/ui/blur-fade";
import { useMediaQuery } from "@/lib/use-media-query";
import { personal } from "@/lib/data";

export function Hero() {
  // The canvas runs on the main thread, so phones get the four inner planets
  // and a thinner star field instead of all eight bodies with their full wakes.
  const compact = useMediaQuery("(max-width: 768px)");

  return (
    <section
      id="hero"
      className="relative flex min-h-screen items-center overflow-hidden"
    >
      {/* Full bleed behind everything: stars run the width of the hero, the
          spirals sit out to the right of the copy. */}
      <div className="absolute inset-0">
        <OrbitalHeroSection
          planets={compact ? INNER_PLANETS : SOLAR_SYSTEM}
          starCount={compact ? 350 : 1400}
          // Half the frames on a phone. Lighthouse measured 6.1 seconds of
          // blocking time on a throttled handset, all of it this canvas; the
          // orbits move slowly enough that thirty is indistinguishable.
          maxFps={compact ? 30 : 60}
          interactive={!compact}
          yearSeconds={18}
          // On a phone the copy fills the lower half, so the system sits in the
          // empty space above the name instead of behind the pitch.
          focus={compact ? [0.74, 0.18] : [0.72, 0.5]}
          lead={0.12}
          scrim={compact ? "bottom" : "left"}
          scrimStrength={0.8}
          background="#0A0A0A"
        />
      </div>

      {/* The hero is dark in both themes, so its copy is set in white rather
          than the theme tokens. */}
      <div className="relative z-10 mx-auto w-full max-w-6xl px-6">
        {/* No top padding on a phone: the section already centres this, so the
            padding was pushing an otherwise centred block downward and opening
            a gap under the navbar. The desktop offset stays, where the copy sits
            deliberately below centre against the canvas. */}
        <div className="flex max-w-3xl flex-col gap-5 md:gap-7 md:pt-24">
          <BlurFade delay={0.1}>
            <span className="flex items-center gap-2 text-lg text-white/70 md:text-xl">
              <span
                aria-hidden="true"
                className="inline-block origin-[70%_80%] motion-safe:animate-wave"
              >
                👋
              </span>
              Hey, I&apos;m
            </span>
          </BlurFade>

          {/* The whole name on one line, every letter the same size. */}
          <motion.h1
            initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ delay: 0.2, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="whitespace-nowrap font-display text-4xl leading-[0.9] text-white sm:text-5xl"
          >
            {personal.name}
          </motion.h1>

          <motion.span
            aria-hidden="true"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.75, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="h-px w-40 origin-left bg-gradient-to-r from-white/60 to-transparent"
          />

          {/* One title, held still. The rotating list moved to About, where
              there is room to read all four at once. */}
          <BlurFade delay={1}>
            <p className="font-display text-3xl italic leading-none text-brand md:text-4xl">
              {personal.role}
            </p>
          </BlurFade>

          <BlurFade delay={1.1}>
            <p className="max-w-xl text-lg leading-relaxed text-white/75 md:text-xl">
              {personal.pitch}
            </p>
          </BlurFade>

          <BlurFade delay={1.2}>
            <ul className="flex flex-wrap gap-2">
              {personal.highlights.map((highlight) => (
                <li
                  key={highlight}
                  className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-sm text-white/80 backdrop-blur-sm"
                >
                  {highlight}
                </li>
              ))}
            </ul>
          </BlurFade>

          {/* The work leads, since that is what a recruiter came for; the
              résumé is the takeaway for anyone who has already decided. */}
          <BlurFade delay={1.3}>
            <div className="flex flex-wrap items-center gap-3">
              <a
                href="#projects"
                className="group inline-flex items-center gap-2 rounded-full bg-brand-solid px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-brand/25 transition hover:brightness-110"
              >
                View my work
                <ArrowDown className="size-4 transition-transform group-hover:translate-y-0.5" />
              </a>
              <a
                href={personal.resumeUrl}
                download={personal.resumeFilename}
                className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-5 py-2.5 text-sm font-medium text-white backdrop-blur-sm transition-colors hover:border-white/40 hover:bg-white/10"
              >
                <Download className="size-4" />
                Download résumé
              </a>
            </div>
          </BlurFade>
        </div>
      </div>

      {/* Fades the canvas into whatever the next section's background is. */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-32 bg-gradient-to-b from-transparent to-background" />

      <motion.div
        className="absolute bottom-8 left-1/2 z-20 -translate-x-1/2"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
      >
        <ChevronDown className="size-5 text-white/40" />
      </motion.div>
    </section>
  );
}
