/**
 * The pieces every project layout shares — the wheel, the phone carousel and
 * the reduced-motion list — so a project reads the same whichever one a
 * visitor gets.
 */

import type { ReactElement } from "react";
import Image from "next/image";
import {
  ArrowUpRight,
  Building2,
  HeartPulse,
  Maximize2,
  Trophy,
  type LucideIcon,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import type { projects } from "@/lib/data";

export type Project = (typeof projects)[number];

const visualIcons: Record<string, LucideIcon> = {
  trophy: Trophy,
  building: Building2,
  pulse: HeartPulse,
};

/**
 * The project's picture: its image when it has one, fitted whole inside the
 * frame, otherwise a drawn panel —
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
        // Fitted, not cropped: the whole picture shows, whatever its shape.
        className={cn("object-contain", className)}
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

/**
 * The corner chip that says a picture opens larger. Decoration only: whatever
 * it sits in is the thing that is clicked.
 */
export function ExpandHint({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute right-3 top-3 flex items-center gap-1.5 rounded-full border border-border bg-background/80 px-2.5 py-1 text-label text-foreground backdrop-blur-sm",
        className,
      )}
    >
      <Maximize2 className="size-3.5" />
      View
    </span>
  );
}

/**
 * The project's image at full size. A card is far too small to read a
 * screenshot strip in, so this is where it is actually read.
 *
 * Its own width and height are not known here — images are set by path in
 * `lib/data.ts` — so it is sized by CSS and keeps whatever shape the file has.
 * On a phone the strip scrolls sideways rather than shrinking past legibility.
 */
export function ProjectImageDialog({
  project,
  open,
  onOpenChange,
  trigger,
}: {
  project: Project;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: ReactElement;
}) {
  if (!project.image) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger render={trigger} />}
      <DialogContent className="gap-3 p-3 sm:max-w-[min(1600px,calc(100%-4rem))]">
        <DialogTitle className="py-1.5 pl-1 pr-10">{project.title}</DialogTitle>
        <div className="overflow-x-auto rounded-lg">
          <Image
            src={project.image}
            alt={`${project.title}: screens`}
            width={0}
            height={0}
            sizes="(max-width: 640px) 960px, 100vw"
            className="h-auto w-full min-w-[960px] sm:min-w-0"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}

/**
 * A picture frame's click target: covers the frame and opens the image.
 * Renders nothing for a project without an image.
 */
export function ProjectVisualZoom({ project }: { project: Project }) {
  if (!project.image) return null;

  return (
    <ProjectImageDialog
      project={project}
      trigger={
        <button
          type="button"
          aria-label={`View ${project.title} image full size`}
          className="absolute inset-0 cursor-zoom-in outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand"
        >
          <ExpandHint />
        </button>
      }
    />
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
