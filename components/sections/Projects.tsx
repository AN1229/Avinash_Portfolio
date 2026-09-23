"use client";

import { BlurFade } from "@/components/ui/blur-fade";
import { SectionHeading } from "@/components/ui/section-heading";
import { MovingBorder } from "@/components/ui/moving-border";
import { GlowingEffect } from "@/components/ui/glowing-effect";
import { Badge } from "@/components/ui/badge";
import {
  ProjectImpact,
  ProjectLinks,
  ProjectVisual,
  type Project,
} from "./ProjectParts";
import { ProjectWheel } from "./ProjectWheel";
import { ProjectCarousel } from "./ProjectCarousel";
import { useMediaQuery } from "@/lib/use-media-query";
import { cn } from "@/lib/utils";
import { projects } from "@/lib/data";

function ProjectCardContent({
  project,
  flipped,
}: {
  project: Project;
  flipped: boolean;
}) {
  return (
    <div className="grid items-center gap-8 p-6 md:grid-cols-2 md:gap-12 md:p-10">
      <div
        className={cn(
          "relative aspect-[1.95] w-full overflow-hidden rounded-xl border border-border",
          flipped && "md:order-last",
        )}
      >
        <ProjectVisual
          project={project}
          sizes="(max-width: 768px) 90vw, 560px"
        />
      </div>

      <div>
        <span className="font-heading text-sm font-bold text-brand">
          {project.id}
        </span>

        <h3 className="mt-4 text-2xl font-bold leading-[1.1] tracking-[-0.025em] text-foreground md:text-3xl">
          {project.title}
        </h3>

        <p className="mt-2 text-meta text-muted-foreground">
          {project.context} · {project.period}
        </p>

        <p className="mt-4 text-body text-muted-foreground">
          {project.summary}
        </p>

        <ProjectImpact project={project} className="-mx-3 mt-5" />

        <div className="mt-5 flex flex-wrap gap-2">
          {project.skills.map((skill) => (
            <Badge
              key={skill}
              variant="outline"
              className="h-auto border-brand/30 px-3 py-1 text-label text-muted-foreground"
            >
              {skill}
            </Badge>
          ))}
        </div>

        <ProjectLinks project={project} />
      </div>
    </div>
  );
}

export function Projects() {
  // The ring's constraint is height, not width. The panel and the visible arc
  // have to share the viewport, which a phone can do at the compact size but
  // only above about 700px tall; a short window has room for one or the other.
  // So: the ring wherever it fits, the swipe carousel where it does not, and
  // the plain stack for anyone who asked for reduced motion — nothing pinned,
  // nothing snapping, no scroll-driven anything.
  const roomy = useMediaQuery("(min-width: 1024px)");
  const tallEnough = useMediaQuery("(min-height: 700px)");
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");

  return (
    // Unbanded, so it separates from My Journey above, which is.
    <section id="projects" className="py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-6">
        <BlurFade inView>
          <SectionHeading>Featured Projects</SectionHeading>
        </BlurFade>
      </div>

      {/* The ring is wider than the reading column — 340px of radius either side
          of centre plus half a card — so it sits outside it and manages its own
          width. Inside, a 1024px window clipped the side cards against the
          column edge. */}
      {reducedMotion ? (
        <div className="mx-auto max-w-7xl px-6">
          <ProjectList />
        </div>
      ) : roomy ? (
        <ProjectWheel />
      ) : tallEnough ? (
        <ProjectWheel compact />
      ) : (
        <div className="mx-auto max-w-7xl px-6">
          <ProjectCarousel />
        </div>
      )}
    </section>
  );
}

function ProjectList() {
  return (
    <div className="mt-14 flex flex-col gap-10">
      {projects.map((project, index) => (
        <BlurFade key={project.id} inView delay={0.1 * (index + 1)}>
          {project.featured ? (
            // The featured project keeps the travelling border, so it reads as
            // the headline piece without every other card competing with it.
            <div className="relative overflow-hidden rounded-2xl p-px">
              <div className="absolute inset-0">
                <MovingBorder duration={5000} rx="10%" ry="10%">
                  <div className="size-40 bg-[radial-gradient(var(--brand)_40%,transparent_60%)] opacity-80" />
                </MovingBorder>
              </div>
              <div className="relative rounded-2xl bg-background">
                <ProjectCardContent
                  project={project}
                  flipped={index % 2 === 1}
                />
              </div>
            </div>
          ) : (
            <div className="relative rounded-2xl border border-border bg-background">
              <GlowingEffect
                disabled={false}
                glow
                spread={40}
                proximity={80}
                borderWidth={2}
                inactiveZone={0.55}
              />
              <ProjectCardContent project={project} flipped={index % 2 === 1} />
            </div>
          )}
        </BlurFade>
      ))}
    </div>
  );
}
