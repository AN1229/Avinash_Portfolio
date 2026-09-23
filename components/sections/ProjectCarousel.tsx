"use client";

/**
 * The phone's answer to the wheel: one project per screen, swiped through.
 *
 * The ring does not shrink to this width. A card wide enough to show its picture
 * needs a radius that would fill the viewport twice over, and the
 * hover that lets a desktop visitor look around the ring does not exist on
 * touch — the neighbouring cards become decoration you cannot reach. A snap
 * carousel keeps what the wheel is for, one project at a time and image-first,
 * on the gesture a phone already has.
 *
 * The scrolling itself is CSS scroll-snap, so it is native, momentum-correct
 * and free. The only JavaScript is an observer that keeps the dots in step.
 */

import { useEffect, useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import {
  ProjectImpact,
  ProjectLinks,
  ProjectVisual,
  type Project,
} from "./ProjectParts";
import { useMediaQuery } from "@/lib/use-media-query";
import { cn } from "@/lib/utils";
import { projects } from "@/lib/data";

export function ProjectCarousel() {
  const railRef = useRef<HTMLUListElement>(null);
  const itemsRef = useRef<(HTMLLIElement | null)[]>([]);
  const [active, setActive] = useState(0);
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");

  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;

    // Measured against the rail rather than the viewport, so this stays right
    // whatever the section's own scroll position is.
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const index = itemsRef.current.indexOf(entry.target as HTMLLIElement);
          if (index !== -1) setActive(index);
        }
      },
      { root: rail, threshold: 0.6 },
    );

    for (const item of itemsRef.current) {
      if (item) observer.observe(item);
    }
    return () => observer.disconnect();
  }, []);

  const goTo = (index: number) => {
    itemsRef.current[index]?.scrollIntoView({
      behavior: reducedMotion ? "auto" : "smooth",
      inline: "center",
      block: "nearest",
    });
  };

  return (
    <div className="mt-12">
      <ul
        ref={railRef}
        className="-mx-6 flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {projects.map((project, index) => (
          <li
            key={project.id}
            ref={(node) => {
              itemsRef.current[index] = node;
            }}
            className="w-[85vw] max-w-md shrink-0 snap-center"
          >
            <Card project={project} />
          </li>
        ))}
      </ul>

      <div className="mt-6 flex items-center justify-center gap-2">
        {projects.map((project, index) => (
          <button
            key={project.id}
            type="button"
            onClick={() => goTo(index)}
            aria-label={`Go to ${project.title}`}
            aria-current={index === active}
            className={cn(
              "h-1.5 rounded-full transition-all duration-300",
              index === active ? "w-6 bg-brand" : "w-1.5 bg-border",
            )}
          />
        ))}
      </div>
    </div>
  );
}

function Card({ project }: { project: Project }) {
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-background">
      <div className="relative aspect-[1.95] w-full overflow-hidden border-b border-border">
        <ProjectVisual
          project={project}
          sizes="(max-width: 480px) 90vw, 448px"
        />
      </div>

      <div className="flex flex-1 flex-col p-5">
        <span className="font-heading text-sm font-bold text-brand">
          {project.id}
        </span>

        <h3 className="mt-3 text-xl font-bold leading-tight tracking-[-0.02em] text-foreground">
          {project.title}
        </h3>

        <p className="mt-1.5 text-label text-muted-foreground">
          {project.context} · {project.period}
        </p>

        <p className="mt-3 text-body text-muted-foreground">
          {project.summary}
        </p>

        <div className="mt-4 flex flex-wrap gap-1.5">
          {project.skills.map((skill) => (
            <Badge
              key={skill}
              variant="outline"
              className="h-auto border-brand/30 px-2.5 py-1 text-label text-muted-foreground"
            >
              {skill}
            </Badge>
          ))}
        </div>

        {/* Pushed to the bottom so cards of differing text length still line
            their numbers up as you swipe past. */}
        <ProjectImpact
          project={project}
          compact
          className="-mx-2 mt-auto pt-5"
        />

        <ProjectLinks project={project} className="mt-4" />
      </div>
    </article>
  );
}
