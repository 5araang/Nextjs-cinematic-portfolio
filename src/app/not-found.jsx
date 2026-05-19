import Link from "next/link";

export const metadata = {
  title:       "404 — Page Not Found",
  description: "The page you're looking for doesn't exist.",
  robots:      { index: false, follow: false },
};

export default function NotFound() {
  return (
    <main
      className="min-h-screen flex flex-col justify-center items-center bg-[#080808] px-10"
      aria-labelledby="not-found-heading"
    >
      <p className="text-[11px] text-[#ff6b1a] tracking-[0.45em] uppercase mb-6 font-medium">
        404
      </p>

      <h1
        id="not-found-heading"
        className="font-black text-white tracking-tighter leading-[0.88] text-center mb-8"
        style={{ fontSize: "clamp(4rem, 14vw, 10rem)" }}
      >
        Lost<br />
        <span className="text-white/15">in space</span>
      </h1>

      <p className="text-white/40 text-sm mb-12 text-center max-w-xs leading-relaxed">
        This page doesn't exist. Head back and keep exploring.
      </p>

      <Link
        href="/"
        className="flex items-center gap-3 px-8 py-3 border border-[#ff6b1a]/50 text-[#ff6b1a] text-[11px] uppercase tracking-[0.32em] rounded-full hover:bg-[#ff6b1a] hover:text-black transition-all duration-500 group"
      >
        <svg
          width="14" height="14" viewBox="0 0 14 14" fill="none"
          aria-hidden="true"
          className="transition-transform duration-300 group-hover:-translate-x-1"
        >
          <path d="M9 11L4 7l5-4" stroke="currentColor" strokeWidth="1.5"
            strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Back to home
      </Link>
    </main>
  );
}
