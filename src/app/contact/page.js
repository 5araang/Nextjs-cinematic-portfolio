import PageShell from "@/components/PageShell";
import ContactPage from "@/views/contact";

export const metadata = {
  title:       "Contact — Hire a Portfolio Designer, Website Developer, Video Editor or Photo Editor",
  description: "Get in touch with Sarang to hire a freelance portfolio designer, website developer, video editor, or photo editor. Available for projects worldwide. Fast response, competitive pricing.",
  keywords:    ["hire website developer", "hire video editor", "hire photo editor", "hire portfolio designer", "freelance contact", "get quote website design"],
  alternates:  { canonical: "https://sarang-space.site/contact" },
  openGraph: {
    title: "Hire Sarang — Portfolio Designer, Website Developer, Video Editor & Photo Editor",
    description: "Contact Sarang for freelance website development, video editing, photo editing, and portfolio design projects. Available worldwide.",
  },
};

export default function Page() {
  return (
    <PageShell>
      <ContactPage />
    </PageShell>
  );
}
