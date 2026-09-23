import { BlurFade } from "@/components/ui/blur-fade";
import { SectionHeading } from "@/components/ui/section-heading";
import { achievements } from "@/lib/data";

/**
 * Competitions and awards, one card each. The ranking leads, large, because
 * "2 of 3,200" says more at a glance than the name of the competition does.
 */
export function Achievements() {
  return (
    <section
      id="achievements"
      className="mx-auto max-w-7xl px-6 py-16 md:py-24"
    >
      <BlurFade inView>
        <SectionHeading>Achievements</SectionHeading>
      </BlurFade>

      <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {achievements.map((item, index) => (
          <li key={item.title + item.event}>
            <BlurFade inView delay={0.05 * index} className="h-full">
              <article className="flex h-full flex-col rounded-2xl border border-border bg-surface p-6 transition-colors hover:border-brand/40">
                <p className="font-heading text-3xl font-bold tracking-[-0.02em] text-brand">
                  {item.rank}
                </p>
                <h3 className="mt-4 text-xl font-semibold tracking-[-0.01em] text-foreground">
                  {item.title}
                </h3>
                <p className="mt-0.5 text-meta font-medium text-muted-foreground">
                  {item.event}
                </p>
                <p className="mt-3 text-body text-muted-foreground">
                  {item.detail}
                </p>
              </article>
            </BlurFade>
          </li>
        ))}
      </ul>
    </section>
  );
}
