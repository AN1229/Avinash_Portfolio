import { BlurFade } from "@/components/ui/blur-fade";
import { SectionHeading } from "@/components/ui/section-heading";
import { MovingBorder } from "@/components/ui/moving-border";
import { Award } from "lucide-react";
import { education } from "@/lib/data";

/**
 * Two degrees, in cards that carry a travelling brand light around their edge —
 * the same treatment the featured project uses, at a slower pace so the two
 * sections do not compete.
 *
 * The border is drawn on a one-pixel outer element with the card floated on
 * top, rather than as an animated border on the card itself: an animated border
 * width would relayout its contents on every frame.
 */
export function Education() {
  return (
    <section id="education" className="mx-auto max-w-7xl px-6 py-16 md:py-24">
      <BlurFade inView>
        <SectionHeading>Education</SectionHeading>
      </BlurFade>

      <BlurFade inView delay={0.1}>
        {/* Full width and stacked, so each degree is one wide row rather than
            a tall column. */}
        <div className="mt-10 flex flex-col gap-5">
          {education.map((entry, index) => (
            <div
              key={entry.school}
              className="relative overflow-hidden rounded-2xl p-px"
            >
              <div className="absolute inset-0">
                {/* Different durations, so the two are never lit at the same
                    point on their edge. */}
                <MovingBorder
                  duration={index === 0 ? 7000 : 8200}
                  rx="12%"
                  ry="12%"
                >
                  <div className="size-32 bg-[radial-gradient(var(--brand)_40%,transparent_60%)] opacity-70" />
                </MovingBorder>
              </div>

              <div className="relative flex flex-col gap-5 rounded-2xl border border-border bg-surface p-6 sm:flex-row sm:items-start sm:justify-between sm:gap-8 md:px-8">
                <div className="min-w-0">
                  <h3 className="text-xl font-semibold tracking-[-0.02em] text-foreground md:text-2xl">
                    {entry.degree}
                  </h3>

                  <p className="mt-1.5 text-body text-muted-foreground">
                    <span className="font-semibold text-foreground">
                      {entry.school}
                    </span>
                    {entry.location && ` · ${entry.location}`}
                  </p>

                  {entry.focus && (
                    <p className="mt-1 text-body text-muted-foreground">
                      {entry.focus}
                    </p>
                  )}

                  {entry.honours.length > 0 && (
                    <ul className="mt-4 space-y-2">
                      {entry.honours.map((honour) => (
                        <li
                          key={honour}
                          className="flex items-start gap-2.5 text-body text-foreground/85"
                        >
                          <Award className="mt-[0.35em] size-[1em] shrink-0 text-brand" />
                          {honour}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* The dates, right-aligned and rule-separated on a wide card so
                    they read at a glance against a long degree title. */}
                <p className="shrink-0 whitespace-nowrap font-heading text-lg font-semibold text-brand sm:border-l sm:border-border sm:pl-8 sm:text-right md:text-xl">
                  {entry.period}
                </p>
              </div>
            </div>
          ))}
        </div>
      </BlurFade>
    </section>
  );
}
