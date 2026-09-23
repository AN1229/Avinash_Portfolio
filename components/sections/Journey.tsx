import Image from "next/image";
import {
  FlaskConical,
  GraduationCap,
  PenTool,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import { BlurFade } from "@/components/ui/blur-fade";
import { SectionHeading } from "@/components/ui/section-heading";
import { NumberTicker } from "@/components/ui/number-ticker";
import { LinkedinIcon } from "@/components/icons";
import { cn } from "@/lib/utils";
import { journey, personal, stats } from "@/lib/data";

const stepIcons: Record<(typeof journey)[number]["icon"], LucideIcon> = {
  engineer: Wrench,
  founder: PenTool,
  researcher: FlaskConical,
  isb: GraduationCap,
};

/** The portrait, or the initials in its place until one is added. */
function Portrait() {
  if (personal.photo) {
    return (
      <Image
        src={personal.photo}
        alt={personal.name}
        fill
        sizes="288px"
        className="object-cover"
      />
    );
  }

  const initials = personal.name
    .split(" ")
    .map((word) => word[0])
    .join("");

  return (
    <div className="flex size-full items-center justify-center bg-[radial-gradient(circle_at_30%_20%,var(--brand-glow),transparent_70%)]">
      <span className="font-display text-8xl text-foreground/80">
        {initials}
      </span>
    </div>
  );
}

export function Journey() {
  return (
    // Banded: the tint runs the full width of the window, so the section
    // carries the background and an inner wrapper holds the reading column.
    <section
      id="journey"
      className="border-y border-border bg-surface py-16 md:py-24"
    >
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid items-center gap-12 md:grid-cols-5 md:gap-16">
          <BlurFade inView className="md:col-span-2">
            {/* Capped and centred on a phone, so the portrait does not take a
                whole screen before a word of text. */}
            <div className="relative mx-auto max-w-56 md:max-w-72">
              {/* Offset frame behind the portrait, so it reads as placed rather
                  than as one more bordered box. */}
              <div className="absolute -bottom-4 -left-4 hidden size-full rounded-2xl border border-brand/25 md:block" />
              <div className="relative aspect-4/5 w-full overflow-hidden rounded-2xl border border-border bg-background">
                <Portrait />
              </div>
            </div>
          </BlurFade>

          <div className="md:col-span-3">
            <BlurFade inView>
              <SectionHeading>My Journey</SectionHeading>
            </BlurFade>

            <BlurFade inView delay={0.1}>
              <ul className="mt-6 flex flex-wrap gap-2">
                {personal.taglines.map((tagline) => (
                  <li
                    key={tagline}
                    className="rounded-full border border-brand/30 px-3 py-1.5 text-meta text-muted-foreground"
                  >
                    {tagline}
                  </li>
                ))}
              </ul>
            </BlurFade>

            <BlurFade inView delay={0.2}>
              <div className="mt-8 space-y-5 text-body text-muted-foreground">
                {personal.about.split("\n\n").map((paragraph) => (
                  <p key={paragraph.slice(0, 20)}>{paragraph}</p>
                ))}
              </div>
            </BlurFade>

            {personal.linkedin && (
              <BlurFade inView delay={0.3}>
                <a
                  href={personal.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 inline-flex items-center gap-1.5 text-meta font-medium text-brand transition-colors hover:text-brand-hover"
                >
                  <LinkedinIcon className="size-4" />
                  Connect on LinkedIn
                </a>
              </BlurFade>
            )}
          </div>
        </div>

        {/* The path, oldest first. A rule joins the markers so the steps read as
            one route rather than four cards; it is horizontal on a wide screen
            and vertical on a phone. The current step is the one lit. */}
        <ol className="mt-16 grid gap-8 md:grid-cols-4 md:gap-6">
          {journey.map((step, index) => {
            const Icon = stepIcons[step.icon];
            const current = index === journey.length - 1;

            return (
              <li key={step.title} className="relative">
                {/* A segment from this marker to the next, so the line stops at
                    the last step. It spans the gap between items too: 2rem
                    below on a phone, 1.5rem across on a wide screen. */}
                {!current && (
                  <span
                    aria-hidden="true"
                    className="absolute left-5 top-10 h-[calc(100%-0.5rem)] w-px bg-gradient-to-b from-border to-brand/50 md:left-10 md:top-5 md:h-px md:w-[calc(100%-1rem)] md:bg-gradient-to-r"
                  />
                )}
                <BlurFade
                  inView
                  delay={0.1 * index}
                  className="flex gap-4 md:flex-col"
                >
                  <span
                    className={cn(
                      "relative z-10 flex size-10 shrink-0 items-center justify-center rounded-full border bg-background",
                      current
                        ? "border-brand text-brand shadow-[0_0_18px_-2px_var(--brand)]"
                        : "border-border text-muted-foreground",
                    )}
                  >
                    <Icon className="size-[18px]" />
                  </span>
                  <div>
                    <p
                      className={cn(
                        "font-heading text-meta font-semibold",
                        current ? "text-brand" : "text-muted-foreground",
                      )}
                    >
                      {step.period}
                    </p>
                    <h3 className="mt-1 text-xl font-semibold tracking-[-0.01em] text-foreground md:text-2xl">
                      {step.title}
                    </h3>
                    <p className="mt-1.5 text-body text-muted-foreground">
                      {step.detail}
                    </p>
                  </div>
                </BlurFade>
              </li>
            );
          })}
        </ol>

        {/* Numbers read as a headline row split by rules, rather than more
            bordered cards. */}
        <BlurFade inView delay={0.2}>
          <dl className="mt-16 grid grid-cols-3 border-y border-border py-8">
            {stats.map((stat, index) => (
              <div
                key={stat.label}
                className={cn(
                  "px-2 md:px-8",
                  index > 0 && "border-l border-border",
                )}
              >
                <dt className="whitespace-nowrap font-heading text-2xl font-bold tracking-[-0.02em] text-foreground sm:text-3xl md:text-4xl">
                  <NumberTicker value={stat.value} />
                  {stat.suffix}
                </dt>
                <dd className="mt-2 text-meta text-muted-foreground">
                  {stat.label}
                </dd>
              </div>
            ))}
          </dl>
        </BlurFade>
      </div>
    </section>
  );
}
