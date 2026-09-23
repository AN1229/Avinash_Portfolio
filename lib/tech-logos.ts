/**
 * Maps a skill name from `lib/data.ts` to its logo under `public/logos/tech`.
 *
 * Logos keep their brand colours: a recruiter recognises the Figma mark or the
 * Python yellow long before they read the label, which is the whole reason for
 * showing marks instead of text. This is a deliberate exception to the
 * single-accent rule — brand marks are not page accent.
 *
 * Skills with no brand behind them (Product Strategy, SQL, A/B Testing) are
 * absent on purpose and show as text alone.
 */
export const techLogos: Record<string, string> = {
  Figma: "figma",
  Python: "python",
  Excel: "microsoftexcel",
  "Power BI": "powerbi",
  Tableau: "tableau",
  JIRA: "jira",
  "Meta Business Suite": "meta",
  "Instagram Ads": "instagram",
  "Discord Community": "discord",
};

/**
 * Brands whose registered colour is black or near-black. Drawn as an image each
 * would be a black blob on the dark background, so list their file names here
 * and they render as CSS masks instead, taking the current text colour. None of
 * the current logos need it.
 */
const monochromeLogos = new Set<string>([]);

export type TechLogo = { src: string; mono: boolean };

export function logoFor(skill: string): TechLogo | undefined {
  const slug = techLogos[skill];
  if (!slug) return undefined;
  return { src: `/logos/tech/${slug}.svg`, mono: monochromeLogos.has(slug) };
}
