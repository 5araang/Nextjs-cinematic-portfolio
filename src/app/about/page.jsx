import PageShell from "@/components/PageShell";
import AboutPage from "@/views/about";

export const metadata = {
  title:       "About — Freelance Website Developer, Video Editor & Photo Editor from India",
  description: "Meet Sarang — a 19-year-old freelance website developer, video editor, and photo editor from India. Expert in React, Next.js, GSAP, After Effects, Premiere Pro, Photoshop, and Figma. Available for hire worldwide.",
  keywords:    ["freelance web developer India", "video editor for hire", "photo editor freelance", "portfolio designer", "creative developer", "Sarang about"],
  alternates:  { canonical: "https://sarang-space.site/about" },
  openGraph: {
    title: "About Sarang — Freelance Website Developer, Video Editor & Photo Editor",
    description: "19-year-old creative developer from India specializing in cinematic websites, video editing, and visual design. Hire for freelance projects worldwide.",
  },
};

export default function Page() {
  return (
    <PageShell>
      <style>{`.bottom-blur { display: none !important; }`}</style>
      <AboutPage />
    </PageShell>
  );
}
