/**
 * The pieces every project layout shares — the wheel, the phone carousel and
 * the reduced-motion list — so a project reads the same whichever one a
 * visitor gets.
 */

import Image from "next/image";
import {
  ArrowUpRight,
  Building2,
  HeartPulse,
  Trophy,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { projects } from "@/lib/data";

export type Project = (typeof projects)[number];

const visualIcons: Record<string, LucideIcon> = {
  trophy: Trophy,
  building: Building2,
  pulse: HeartPulse,
};

/**
 * The project's picture: its image when it has one, otherwise a drawn panel —
 * the keyword large over a faint grid, the icon in the corner. Fills its
 * parent, which sets the size and shape.
 */
export function ProjectVisual({
  project,
  sizes,
  className,
}: {
  project: Project;
  sizes: string;
  className?: string;
}) {
  if (project.image) {
    return (
      <Image
        src={project.image}
        alt=""
        fill
        sizes={sizes}
        className={cn("object-cover", className)}
      />
    );
  }

  const Icon = visualIcons[project.visual.icon] ?? Trophy;

  return (
    <div
      aria-hidden="true"
      className={cn(
        "absolute inset-0 overflow-hidden bg-surface",
        // A faint grid; the overlay inside fades it out towards the edges.
        "bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-[size:28px_28px]",
        className,
      )}
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,var(--brand-glow),transparent_65%),radial-gradient(ellipse_at_center,transparent_30%,var(--surface)_85%)]" />
      {/* Inset from the top: on the wheel the active card lifts into the edge
          of the ring's frame, which would clip anything set closer. */}
      <Icon className="absolute right-5 top-7 size-6 text-brand/70" />
      <span className="absolute left-6 top-6 font-display text-6xl leading-none text-foreground/85">
        {project.visual.keyword}
      </span>
    </div>
  );
}

/** The headline numbers, as a row split by rules. */
export function ProjectImpact({
  project,
  compact = false,
  className,
}: {
  project: Project;
  compact?: boolean;
  className?: string;
}) {
  return (
    <dl className={cn("grid grid-cols-3", className)}>
      {project.impact.map((item, index) => (
        <div
          key={item.label}
          className={cn(
            compact ? "px-2" : "px-3",
            index > 0 && "border-l border-border",
          )}
        >
          <dt
            className={cn(
              "font-heading font-bold tracking-[-0.02em] text-foreground",
              compact ? "text-xl" : "text-3xl",
            )}
          >
            {item.value}
          </dt>
          <dd
            className={cn(
              "mt-0.5 text-muted-foreground",
              compact ? "text-sm" : "text-label",
            )}
          >
            {item.label}
          </dd>
        </div>
      ))}
    </dl>
  );
}

/** Any links the project has, the first one filled. Nothing while there are none. */
export function ProjectLinks({
  project,
  className = "mt-6",
}: {
  project: Project;
  className?: string;
}) {
  if (project.links.length === 0) return null;

  return (
    <div className={cn("flex flex-wrap items-center gap-3", className)}>
      {project.links.map(({ label, href }, index) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={
            index === 0
              ? "group inline-flex items-center gap-2 rounded-lg bg-brand-solid px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-brand/25 transition-colors hover:brightness-110"
              : "group inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-brand hover:text-brand"
          }
        >
          {label}
          <ArrowUpRight
            aria-hidden="true"
            className="size-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
          />
        </a>
      ))}
    </div>
  );
}
