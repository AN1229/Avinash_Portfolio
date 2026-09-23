export const personal = {
  name: "Avinash Patnala",
  role: "Product Manager",
  /** The hero's one-liner, and the description in search results and link previews. */
  pitch: "I've designed it, built it and grown it. Now I want to own it.",
  /** Short credentials shown as chips under the hero's title. */
  highlights: ["ISB PGP '27", "Taparia Scholar", "Ex-Founder"],
  /** Shown on the site: the main address, then the alternate. */
  email: "avinash_patnala_pgp2027@isb.edu",
  altEmail: "avinashpatnala01@gmail.com",
  /**
   * Where the contact form delivers. It has to be the address the Resend
   * account was opened with: until a domain is verified in Resend, its shared
   * sender can only deliver to that one inbox.
   */
  formInbox: "avinashpatnala01@gmail.com",
  // Every LinkedIn link on the site is hidden while this is empty.
  linkedin: "https://www.linkedin.com/in/avinash-patnala-9256a4224/",
  /**
   * A fixed path, so updating the résumé is only ever overwriting this file —
   * no code change, nothing to break. The name a visitor's browser saves it
   * under comes from `resumeFilename` on the download link instead.
   */
  resumeUrl: "/Avinash_Product_Resume.pdf",
  resumeFilename: "Avinash_Patnala_Resume.pdf",
  location: "Hyderabad, India",
  // A path under public/, matching the file name's case exactly — the live
  // server is case-sensitive. Empty shows an "AP" monogram instead.
  photo: "/Avinash_Pic.JPG",
  /**
   * No date in here on purpose. "Graduating May 2026" was true when it was
   * written and false by August, and it renders in three places at once —
   * Contact, the Open Graph card and the assistant's context — so a date here
   * goes stale everywhere at the same time.
   */
  seeking: "Open to Product Management roles",
  /** Focus areas, shown as chips at the top of My Journey. */
  taglines: ["Product Strategy", "UI/UX Design", "Go-to-Market & Growth"],
  /** My Journey's bio. Paragraphs are separated by a blank line. */
  about: `I started as a mechanical engineer and graduated top of my class. Then I
co-founded Skiaverse, a gamified talent-discovery platform, and led its design,
taking it from an idea to 5,000+ students across 3 campuses.

After that I spent a year as a researcher, running an aerospace program where
every decision had to be backed by data.

Now at ISB, I'm bringing those together: design sense, a builder's bias and
analytical rigour, aimed at product management.`,
};

/** The headline numbers under My Journey. */
export const stats = [
  { value: 5000, suffix: "+", label: "Users reached" },
  { value: 150, suffix: "%", label: "MoM user growth" },
  { value: 100, suffix: "+", label: "UI screens designed" },
];

/** The path in My Journey, oldest first. The last step is the current one. */
export const journey = [
  {
    period: "2019 – 2023",
    title: "Engineer",
    detail:
      "B.Tech in Mechanical Engineering. Ranked 1st in the cohort, Gold Medal.",
    icon: "engineer",
  },
  {
    period: "2023 – 2024",
    title: "Founder & Design Lead",
    detail:
      "Co-founded Skiaverse and led its design, from idea to 5,000+ users.",
    icon: "founder",
  },
  {
    period: "2024 – 2025",
    title: "Researcher",
    detail: "Ran an ML-driven wing-optimization program presented to DRDO.",
    icon: "researcher",
  },
  {
    period: "2026 – now",
    title: "ISB",
    detail: "PGP in Strategy & Leadership, aiming for product management.",
    icon: "isb",
  },
] as const;

/** Skills, in four groups. Names with a logo in lib/tech-logos.ts show it. */
export const skills = {
  product: [
    "Product Strategy",
    "Product Roadmap",
    "GTM Strategy",
    "Prioritization",
    "Primary Research",
    "Experimentation",
    "A/B Testing",
  ],
  design: [
    "Figma",
    "UI/UX Design",
    "Wireframing & Prototyping",
    "User Research",
  ],
  data: [
    "Python",
    "SQL",
    "Excel",
    "Power BI",
    "Tableau",
    "Machine Learning",
    "Predictive Modelling",
  ],
  tools: [
    "JIRA",
    "Meta Business Suite",
    "Instagram Ads",
    "Discord Community",
    "HPC / Cluster Computing",
  ],
};

type ProjectLink = { label: string; href: string };

/**
 * Featured Projects, in running order. `id` is the position on the page — the
 * wheel shows it as "01 / 03" — so renumber when reordering.
 *
 * `image` is optional: while it is empty the card draws `visual` instead, an
 * icon and a keyword on a brand-tinted panel. Drop a screenshot or deck cover
 * in public/projects/ and set its path to replace it. `links` render as buttons
 * (the first one filled) and are left out entirely while the list is empty.
 */
export const projects = [
  {
    id: "01",
    title: "Skiaverse: Gamified Talent Discovery",
    context: "Skiaverse · Co-Founder & Design Lead",
    period: "2023 – 2024",
    summary:
      "Students had no engaging way to show their talent. After surveying 500+ of them, I repositioned Skiaverse around gamification and led the design of 100+ screens.",
    impact: [
      { value: "5K+", label: "users in 3 months" },
      { value: "150%", label: "MoM acquisition" },
      { value: "800+", label: "peak daily users" },
    ],
    skills: ["Product Strategy", "UI/UX Design", "Primary Research", "Figma"],
    visual: { icon: "trophy", keyword: "0 → 1" },
    image: "",
    links: [] as ProjectLink[],
    featured: true,
  },
  {
    id: "02",
    title: "Skiaverse ERM: A B2B Wedge into Universities",
    context: "Skiaverse · Go-to-Market",
    period: "2023 – 2024",
    summary:
      "Universities ran accreditation, approvals and club budgets by hand. We entered through that one workflow, then grew through campus ambassadors instead of paid ads.",
    impact: [
      { value: "2", label: "institutions onboarded" },
      { value: "~15%", label: "adoption across 30 clubs" },
      { value: "+20%", label: "adoption at zero CAC" },
    ],
    skills: ["GTM Strategy", "B2B", "Pilot Design", "Prioritization"],
    visual: { icon: "building", keyword: "B2B" },
    image: "",
    links: [] as ProjectLink[],
    featured: false,
  },
  {
    id: "03",
    title: "NephroPlus: Predicting Patient Churn",
    context: "ISB Experiential Learning · NephroPlus, Philippines",
    period: "2026 – Ongoing",
    summary:
      "NephroPlus runs a 2,880-patient dialysis network across 52 centres. I'm building a churn-prediction model that flags at-risk patients early, so centres can step in.",
    impact: [
      { value: "4×", label: "lift over baseline" },
      { value: "2,880", label: "patients covered" },
      { value: "52", label: "centres" },
    ],
    skills: ["Predictive Modelling", "Python", "Data Analysis", "Healthcare"],
    visual: { icon: "pulse", keyword: "4×" },
    image: "",
    links: [] as ProjectLink[],
    featured: false,
  },
];

type ExperienceRole = {
  role: string;
  company: string;
  /** Square-ish marks read best in the timeline's tile. Omit for initials. */
  logo?: { src: string; width: number; height: number };
  period: string;
  location: string;
  /** One line under the header, in italics: what the role was, in brief. */
  summary?: string;
  bullets: string[];
  links?: { label: string; href: string }[];
};

/** Work Experience, newest first. Every bullet shows, so keep them to the best 3–4. */
export const experience: ExperienceRole[] = [
  {
    role: "Junior Research Fellow",
    company: "Mahindra University",
    logo: { src: "/logos/MU_logo.jpeg", width: 400, height: 400 },
    period: "Jun 2024 – Oct 2025",
    location: "Hyderabad, India",
    summary:
      "Ran a 12-month wing-optimization program, generating NASA-validated data for a 95%-accurate ML pipeline.",
    bullets: [
      "Reached 95% ML accuracy against a ~60% baseline, about 5× better than the best CFD algorithm, on a GPU-accelerated aerodynamic model.",
      "Built 3 automation tools that cut deliverable cycle time by 25% (24 to 18 hours), and automated file conversion across 7 formats to cut data-prep time by ~80%.",
      "Owned a program usually staffed by 3, reporting daily to the Dean of R&D and supporting 5+ formal reviews with DRDO, Government of India.",
    ],
  },
  {
    role: "Co-Founder & Design Lead",
    company: "Skiaverse Private Limited",
    logo: { src: "/logos/Skia_logo.png", width: 136, height: 140 },
    period: "Jun 2023 – Jun 2024",
    location: "Hyderabad, India",
    summary:
      "Founded and scaled a gamified talent-discovery platform with a 9-member core team, reaching 5,000+ users across 3 campuses.",
    bullets: [
      "Led a 3-member design team through 100+ UI/UX screens across 4 core product modules and the website, shortening time to launch.",
      "Grew to 5,000+ users in 3 months at 150% month-on-month acquisition, after repositioning the product around a gamified model tested with 500+ respondents.",
      "Took peak daily users to 800+ with gamified campus competitions, and held a 200+ floor between events through a 40+ member Discord community.",
      "Ranked Top 3 of 75+ startups at AIC Pre-Incubation, winning ₹2.5L in AWS credits and an 18-month incubation.",
    ],
  },
  {
    role: "Program Management Intern",
    company: "Thermo Fisher Scientific",
    logo: { src: "/logos/thermo-fisher.svg", width: 200, height: 45 },
    period: "Jan 2023 – Jul 2023",
    location: "Hyderabad, India",
    bullets: [
      "Automated manual risk reporting in project tracking, taking turnaround from 4 hours to under a minute at 99.6% process efficiency.",
      "Made project reviews 60% faster across 30+ projects for a 6-member team by introducing a standard PMO workflow checklist.",
      "Tracked 15+ risks and dependencies, enabling faster cross-functional phase-gate decisions.",
    ],
  },
];

/**
 * Education, newest first. The period shows on the right of each card;
 * `honours` list under the degree, and are left out while the list is empty.
 */
export const education = [
  {
    school: "Indian School of Business",
    degree: "Post Graduate Programme (PGP)",
    focus: "Intended majors: Strategy & Leadership",
    location: "",
    period: "Apr 2026 – Present",
    honours: [] as string[],
  },
  {
    school: "Mahindra Ecole Centrale",
    degree: "B.Tech in Mechanical Engineering",
    focus: "",
    location: "Hyderabad, India",
    period: "Jun 2019 – May 2023",
    honours: [
      "Scholar of Excellence (Gold Medal): ranked 1st in the cohort across all four years",
      "Merit Scholarship (top 5%): 25% tuition waiver for 3 consecutive years",
    ],
  },
];

/**
 * Competitions and awards. The section is switched off in app/page.tsx for now;
 * uncomment it there to show these. `rank` is the big number on each card.
 */
export const achievements = [
  {
    rank: "2 / 3.2K",
    title: "National Runner-Up",
    event: "Mentos × IIM Bangalore",
    detail:
      "Built an AI student-success venture planned to scale from 3 to 60 campuses at a 28% margin.",
  },
  {
    rank: "10 / 2K+",
    title: "International Finalist",
    event: "IIM Ahmedabad STRAITS'26",
    detail:
      "Countered Strait of Hormuz risk with a sovereign bypass strategy, protecting 40% of EBITDA.",
  },
  {
    rank: "5 / 850+",
    title: "Taparia Scholar",
    event: "Indian School of Business",
    detail:
      "100% tuition waiver (₹25.6 lakh) for pre-MBA academic and professional excellence.",
  },
  {
    rank: "Rank 1",
    title: "Gold Medal",
    event: "Mahindra Ecole Centrale",
    detail:
      "Scholar of Excellence Award for leading the cohort across all four undergraduate years.",
  },
  {
    rank: "50 / 4K",
    title: "National Semi-Finalist",
    event: "L&T Techgium",
    detail:
      "Designed an SUV-sized mobile living space at an estimated ₹4.05 lakh retrofit cost.",
  },
  {
    rank: "8 / 750",
    title: "Campus Finalist",
    event: "Babson Challenge '22",
    detail:
      "Designed an agri-fintech model linking investors and farmers, targeting a 20% ROI.",
  },
];
