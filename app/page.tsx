import { Navbar } from "@/components/sections/Navbar";
import { Hero } from "@/components/sections/Hero";
import { Journey } from "@/components/sections/Journey";
import { Skills } from "@/components/sections/Skills";
import { Projects } from "@/components/sections/Projects";
import { Experience } from "@/components/sections/Experience";
// Achievements is built but switched off for now. Uncomment this import and
// <Achievements /> below, and its entries in Navbar.tsx and CommandPalette.tsx.
// import { Achievements } from "@/components/sections/Achievements";
import { Education } from "@/components/sections/Education";
import { Contact } from "@/components/sections/Contact";
import { Footer } from "@/components/sections/Footer";
// Chat assistant switched off for now. Uncomment this and <ChatWidget /> below
// (and "Open AI Chat" in CommandPalette.tsx) to bring it back.
// import { ChatWidget } from "@/components/ai-widget/ChatWidget";
import { CommandPalette } from "@/components/command-palette/CommandPalette";
import { ScrollProgress } from "@/components/ui/scroll-progress";

export default function Home() {
  return (
    <>
      <ScrollProgress />
      <Navbar />
      <main>
        <Hero />
        <Journey />
        <Projects />
        <Experience />
        {/* <Achievements /> */}
        <Education />
        <Skills />
        <Contact />
      </main>
      <Footer />
      {/* <ChatWidget /> */}
      <CommandPalette />
    </>
  );
}
