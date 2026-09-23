/**
 * The chat assistant's knowledge, built from `lib/data.ts`.
 *
 * Anything the page states is derived from the data file rather than written
 * out again here, so the assistant and the page cannot disagree. What is
 * written by hand below is only what has nowhere else to live — the
 * positioning, and the roles being sought.
 */

import { education, experience, personal, projects, skills } from "@/lib/data";

/** Framing the page never says out loud, and the assistant needs to know. */
const POSITIONING = `Aspiring Product Manager, currently in the PGP at the Indian
School of Business. Came to product from engineering: a mechanical engineering degree
(ranked 1st in the cohort), a year as co-founder and design lead of Skiaverse, a
gamified talent-discovery platform that reached 5,000+ users, and a year running an
ML-driven aerospace research program.`;

const SEEKING = `Product Management roles.

The two Skiaverse projects are the same work as the Skiaverse role in the work
history, described in more depth, not separate efforts. The NephroPlus project is
part of ISB's experiential learning programme.`;

const list = (items: readonly string[]) => items.join(", ");

const experienceBlock = experience
  .map((role, index) => {
    const header = `${index + 1}. ${role.role} — ${role.company} (${role.period}, ${role.location})`;
    const summary = role.summary ? `\n- ${role.summary}` : "";
    const bullets = role.bullets.map((bullet) => `- ${bullet}`).join("\n");
    return `${header}${summary}\n${bullets}`;
  })
  .join("\n\n");

const projectsBlock = projects
  .map(
    (project, index) =>
      `${index + 1}. ${project.title} — ${project.context}, ${project.period}
   ${project.summary}
   Impact: ${list(project.impact.map((item) => `${item.value} ${item.label}`))}
   Skills: ${list(project.skills)}
   ${list(project.links.map((link) => `${link.label}: ${link.href}`)) || "No public links."}`,
  )
  .join("\n\n");

const educationBlock = education
  .map(
    (entry, index) =>
      `${index + 1}. ${entry.school} | ${entry.degree} | ${entry.period}`,
  )
  .join("\n");

const skillsBlock = [
  `Product: ${list(skills.product)}`,
  `Design: ${list(skills.design)}`,
  `Data & Analytics: ${list(skills.data)}`,
  `Tools & Growth: ${list(skills.tools)}`,
].join("\n");

export const ragContext = `
${personal.name.toUpperCase()}
Email: ${personal.email} (alternate: ${personal.altEmail})
LinkedIn: ${personal.linkedin}
Location: ${personal.location}

SUMMARY:
${POSITIONING}

${personal.about}

EDUCATION:
${educationBlock}

WORK EXPERIENCE:

${experienceBlock}

PROJECTS:

${projectsBlock}

SKILLS:
${skillsBlock}

WHAT ${personal.name.split(" ")[0].toUpperCase()} IS LOOKING FOR:
${SEEKING}
`;
