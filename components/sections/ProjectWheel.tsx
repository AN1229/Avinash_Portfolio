"use client";

/**
 * The projects as a wheel: cards ride a large, half-buried circle that turns as
 * the section is scrolled, and whichever card reaches the top drives a detail
 * panel above it.
 *
 * Two decisions worth knowing about, both departures from the component this
 * was modelled on:
 *
 * The cards counter-rotate. The original baked a tangent rotation into each
 * item and spun the container, so every card was sideways or upside down for
 * most of the turn — fine for a photo with one word on it, useless for a
 * project title. Here the ring's rotation is negated on each card, so they
 * travel round the circle while staying upright.
 *
 * There is no GSAP. The original pulled in gsap, ScrollTrigger and @gsap/react,
 * about 95 KB gzipped, for a scrub tween and a pin. `motion` is already in the
 * bundle and gives the same scrub through `useScroll`, and `position: sticky`
 * pins better than ScrollTrigger does — no injected spacer elements, no
 * refresh() on resize.
 *
 * The rim carries a picture and a title, the picture shown whole. Everything that has to be read or
 * clicked — summary, impact, skills, links — lives in the static panel, which
 * is the only place a link can be both reachable and not spinning. The one
 * exception is a card with an image: clicking it opens the image full size.
 */

import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import { Badge } from "@/components/ui/badge";
import {
  ProjectImageDialog,
  ProjectImpact,
  ProjectLinks,
  ProjectVisual,
  type Project,
} from "./ProjectParts";
import { cn } from "@/lib/utils";
import { projects } from "@/lib/data";

/**
 * The picture on a card has the Skiaverse screen strip's shape (1920×593), so
 * that strip shows whole, and the title sits in a footer under it rather than
 * over it. Pictures of any other shape are fitted inside, never cropped.
 */
const VISUAL_ASPECT = 1920 / 593;
const FOOTER_H = 64;
const MAX_CARD_W = 960;
/** The active card lifts 12px and grows to 105%; both need room. */
const ACTIVE_SCALE = 1.05;
const LIFT = 12;

type CardSize = {
  radius: number;
  cardW: number;
  cardH: number;
  visualH: number;
  /** Headroom over the resting card, so the active one does not lift out of view. */
  inset: number;
};

/**
 * The card is as large as the space under the panel allows: the full width
 * of the window less a margin, unless the height runs out first.
 *
 * Widths are bounded by the ring, since four slots sit 2·R·sin(45°) apart, so
 * the radius follows the card. The cards beside the top one sit a radius
 * below it, out of view, which is what makes the wheel read as larger than
 * the window.
 */
function cardSize(w: number, h: number): CardSize {
  const fromWidth = (Math.min(MAX_CARD_W, w - 48)) / ACTIVE_SCALE;
  // Lifted and grown, the active card spans 105% of its height from the top
  // of the ring. It stops short of the fade at the bottom, with a margin, so
  // the whole card is on screen with the panel above it.
  const fromHeight =
    ((Math.min(h * 0.92, h - 28)) / ACTIVE_SCALE - FOOTER_H) * VISUAL_ASPECT;
  const cardW = Math.max(240, Math.min(fromWidth, fromHeight));
  const visualH = cardW / VISUAL_ASPECT;
  const cardH = visualH + FOOTER_H;
  return {
    radius: (cardW * ACTIVE_SCALE) / Math.SQRT2 + 24,
    cardW,
    cardH,
    visualH,
    inset: LIFT + (cardH * (ACTIVE_SCALE - 1)) / 2,
  };
}

/**
 * Measures the ring's space, but only re-measures when the window changes.
 * The panel above it changes height from one project to the next, and the
 * cards should not resize as the wheel turns.
 */
function useRingSize() {
  const ref = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState(() => cardSize(1024, 380));

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let windowKey = "";
    const observer = new ResizeObserver(([entry]) => {
      const key = `${window.innerWidth}x${window.innerHeight}`;
      if (key === windowKey) return;
      windowKey = key;
      setSize(cardSize(entry.contentRect.width, entry.contentRect.height));
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return { ref, size };
}

export function ProjectWheel({ compact = false }: { compact?: boolean }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const count = projects.length;
  // The ring always has at least four places. With three projects spaced a
  // third of a turn apart, the two beside the top card sit below the visible
  // arc and the wheel reads as a single card; at a quarter turn they stay in
  // view, and the fourth place simply stays empty.
  const slots = Math.max(count, 4);
  const scrollPer = compact ? 280 : 320;
  const { ref: ringRef, size } = useRingSize();

  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start start", "end end"],
  });

  const [scrolled, setScrolled] = useState(0);
  const [focused, setFocused] = useState<number | null>(null);
  // Which project's image is open, kept apart from `open` so the dialog still
  // has its picture while it animates closed.
  const [viewing, setViewing] = useState(0);
  const [viewerOpen, setViewerOpen] = useState(false);

  // Scroll picks which card is at the top; it does not drive the angle directly.
  // Mapping rotation straight off progress meant the ring was only ever aligned
  // at the exact instants progress hit i/(n-1), so a card sat squarely at the
  // apex only if you scrolled to the pixel. Each project owns an equal slice of
  // the track instead, and the spring below walks the ring between the stops.
  useMotionValueEvent(scrollYProgress, "change", (value) => {
    const slice = Math.floor(Math.max(0, Math.min(0.999, value)) * count);
    setScrolled(Math.min(count - 1, slice));
  });

  // Softer and heavier than it was. At stiffness 120 the ring snapped to each
  // stop and stopped dead; a lower stiffness with more mass makes it lean into
  // the turn and settle, which is what a wheel of this size would actually do.
  // Damping stays just under critical so it eases in without wobbling.
  const rotate = useSpring(0, { stiffness: 55, damping: 18, mass: 1.1 });
  const counterRotate = useTransform(rotate, (value) => -value);

  useEffect(() => {
    rotate.set(-(scrolled * 360) / slots);
  }, [slots, rotate, scrolled]);

  // Pointing at a card wins over the scroll position, so someone can look
  // around the ring without having to scroll back and forth.
  const active = focused ?? scrolled;
  const project = projects[active];

  return (
    <div
      ref={trackRef}
      // One slice per project, not per gap: the last card used to reach the top
      // at the exact scroll position where the sticky panel unsticks, so it was
      // gone before it could be read. Its slice now holds it there.
      style={{ height: `calc(100vh + ${count * scrollPer}px)` }}
    >
      <div
        className={cn(
          "sticky top-0 flex h-screen flex-col overflow-hidden",
          // Just clears the navbar (72px), so the panel and card both fit.
          "pt-20",
        )}
      >
        <Detail
          project={project}
          index={active}
          count={count}
          compact={compact}
        />

        {/* The ring. Cropped at the bottom and faded out at the very edge, so
            it reads as something larger than the viewport rather than a
            floating circle, without fading the card at the top. */}
        <div
          ref={ringRef}
          className="relative mt-5 flex-1"
          style={{
            maskImage:
              "linear-gradient(to bottom, black 0%, black 92%, transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(to bottom, black 0%, black 92%, transparent 100%)",
          }}
        >
          <motion.ul
            className="absolute left-1/2 m-0 list-none p-0"
            style={{
              width: size.radius * 2,
              height: size.radius * 2,
              top: size.cardH / 2 + size.inset,
              x: "-50%",
              rotate,
            }}
          >
            {projects.map((item, index) => {
              // Card 0 sits at the top of the circle; the rest follow clockwise.
              const angle = (index / slots) * 2 * Math.PI;
              const x = size.radius * Math.sin(angle);
              const y = -size.radius * Math.cos(angle);

              return (
                <li
                  key={item.id}
                  className="absolute left-1/2 top-1/2"
                  style={{
                    transform: `translate(-50%, -50%) translate3d(${x}px, ${y}px, 0)`,
                  }}
                >
                  <motion.div style={{ rotate: counterRotate }}>
                    <RimCard
                      project={item}
                      width={size.cardW}
                      height={size.cardH}
                      visualHeight={size.visualH}
                      isActive={index === active}
                      dimmed={focused !== null && focused !== index}
                      onFocus={() => setFocused(index)}
                      onBlur={() => setFocused(null)}
                      onOpen={() => {
                        setViewing(index);
                        setViewerOpen(true);
                      }}
                    />
                  </motion.div>
                </li>
              );
            })}
          </motion.ul>
        </div>
      </div>

      <ProjectImageDialog
        project={projects[viewing]}
        open={viewerOpen}
        onOpenChange={setViewerOpen}
      />
    </div>
  );
}

function Detail({
  project,
  index,
  count,
  compact,
}: {
  project: Project;
  index: number;
  count: number;
  compact: boolean;
}) {
  return (
    <div className="mx-auto w-full max-w-3xl shrink-0 px-6 text-center">
      <AnimatePresence mode="wait">
        <motion.div
          key={project.id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
        >
          <p className="font-heading text-sm font-bold text-brand">
            {project.id}{" "}
            <span className="text-muted-foreground">
              / {String(count).padStart(2, "0")}
            </span>
          </p>

          <h3
            className={cn(
              "mt-2 font-bold leading-[1.15] tracking-[-0.025em] text-foreground",
              compact ? "text-xl" : "text-2xl md:text-4xl",
            )}
          >
            {project.title}
          </h3>

          <p
            className={cn(
              "text-muted-foreground",
              compact ? "mt-1 text-label" : "mt-2 text-meta",
            )}
          >
            {project.context} · {project.period}
          </p>

          <p
            className={cn(
              "mx-auto max-w-2xl text-muted-foreground",
              compact ? "mt-3 line-clamp-4 text-meta" : "mt-3 text-body",
            )}
          >
            {project.summary}
          </p>

          <ProjectImpact
            project={project}
            compact={compact}
            className={cn(
              "mx-auto max-w-lg text-left",
              compact ? "mt-3" : "mt-4",
            )}
          />

          <div
            className={cn(
              "flex flex-wrap justify-center gap-2",
              compact ? "mt-3" : "mt-4",
            )}
          >
            {project.skills.slice(0, compact ? 3 : 4).map((skill) => (
              <Badge
                key={skill}
                variant="outline"
                className="h-auto border-brand/30 px-3 py-1 text-label text-muted-foreground"
              >
                {skill}
              </Badge>
            ))}
          </div>

          <ProjectLinks
            project={project}
            className={cn("justify-center", compact ? "mt-3" : "mt-4")}
          />
        </motion.div>
      </AnimatePresence>

      {/* Fixed-height rail under the panel: a progress read-out that does not
          reflow when a longer title swaps in. */}
      <div
        className="mx-auto mt-5 flex w-40 gap-1.5"
        aria-hidden="true"
      >
        {Array.from({ length: count }, (_, i) => (
          <span
            key={i}
            className={cn(
              "h-0.5 flex-1 rounded-full transition-colors duration-300",
              i === index ? "bg-brand" : "bg-border",
            )}
          />
        ))}
      </div>
    </div>
  );
}

function RimCard({
  project,
  width,
  height,
  visualHeight,
  isActive,
  dimmed,
  onFocus,
  onBlur,
  onOpen,
}: {
  project: Project;
  width: number;
  height: number;
  visualHeight: number;
  isActive: boolean;
  dimmed: boolean;
  onFocus: () => void;
  onBlur: () => void;
  onOpen: () => void;
}) {
  return (
    <button
      type="button"
      onMouseEnter={onFocus}
      onMouseLeave={onBlur}
      onFocus={onFocus}
      onBlur={onBlur}
      onClick={project.image ? onOpen : undefined}
      aria-label={
        project.image ? `${project.title}: view image full size` : project.title
      }
      style={{ width, height }}
      className={cn(
        "group relative block overflow-hidden rounded-xl border bg-background text-left shadow-lg outline-none transition-all duration-500 ease-out focus-visible:ring-2 focus-visible:ring-brand",
        project.image && "cursor-zoom-in",
        isActive
          ? "-translate-y-3 scale-105 border-brand/50"
          : "scale-100 border-border",
        dimmed && "opacity-40 grayscale",
      )}
    >
      {/* The picture whole, with nothing laid over it. */}
      <div className="relative w-full" style={{ height: visualHeight }}>
        <ProjectVisual
          project={project}
          sizes={`${Math.round(width * 1.05)}px`}
        />
      </div>

      <div className="border-t border-border px-4 py-2.5">
        <p className="font-heading text-[11px] font-bold text-brand">
          {project.id}
        </p>
        <p className="mt-0.5 line-clamp-1 text-base font-semibold leading-tight text-foreground">
          {project.title}
        </p>
        <span
          className={cn(
            "mt-1.5 block h-0.5 rounded-full bg-brand transition-all duration-500",
            isActive ? "w-full opacity-100" : "w-0 opacity-0",
          )}
        />
      </div>
    </button>
  );
}
