"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";

const CircularGallery = dynamic(
  () => import("@/components/CircularGallery/CircularGallery"),
  { ssr: false }
);



function slugify(t) {
  return t.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}
function safeUrl(url) {
  if (!url) return url;
  return /^https?:\/\//i.test(url) ? url : `https://${url}`;
}

const NOISE_SVG = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

/* ─── Magnetic CTA ─── */
function MagneticCTA({ href, children }) {
  const ref = useRef(null);
  return (
    <a ref={ref} href={safeUrl(href)} target="_blank" rel="noopener noreferrer"
      onMouseMove={(e) => {
        const b = ref.current.getBoundingClientRect();
        ref.current.style.transform = `translate(${(e.clientX - b.left - b.width / 2) * 0.25}px,${(e.clientY - b.top - b.height / 2) * 0.25}px)`;
      }}
      onMouseLeave={() => { ref.current.style.transform = "translate(0,0)"; }}
      className="inline-flex items-center gap-3 px-7 py-3.5 bg-[#ff6b1a] text-black font-black rounded-xl text-[10px] uppercase tracking-[0.25em] hover:bg-[#ff8c42] will-change-transform"
      style={{ transition: "transform 0.2s cubic-bezier(.23,1,.32,1), background-color 0.3s" }}
    >
      {children}
      <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
        <path d="M3.5 9.5L9.5 3.5M9.5 3.5H5.5M9.5 3.5v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    </a>
  );
}

/* ─── Fullscreen Showcase ─── */
function ProjectShowcase({ items, startIdx, onClose }) {
  const [idx, setIdx] = useState(startIdx);
  const [dir, setDir] = useState(1);
  const locked = useRef(false);
  const touchY = useRef(0);
  const imgRef = useRef(null);
  const router = useRouter();
  const current = items[idx];

  const go = useCallback((next) => {
    if (next < 0 || next >= items.length || locked.current || next === idx) return;
    locked.current = true;
    setDir(next > idx ? 1 : -1);
    setIdx(next);
    setTimeout(() => { locked.current = false; }, 700);
  }, [items, idx]);

  useEffect(() => {
    const onWheel = (e) => { e.preventDefault(); if (!locked.current) { if (e.deltaY > 25) go(idx + 1); else if (e.deltaY < -25) go(idx - 1); } };
    const onTS = (e) => { touchY.current = e.touches[0].clientY; };
    const onTE = (e) => { const d = touchY.current - e.changedTouches[0].clientY; if (Math.abs(d) > 40) go(d > 0 ? idx + 1 : idx - 1); };
    const onKey = (e) => {
      if (e.key === "ArrowDown" || e.key === "j") go(idx + 1);
      else if (e.key === "ArrowUp" || e.key === "k") go(idx - 1);
      else if (e.key === "Escape") onClose();
    };
    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchstart", onTS, { passive: true });
    window.addEventListener("touchend", onTE, { passive: true });
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTS);
      window.removeEventListener("touchend", onTE);
      window.removeEventListener("keydown", onKey);
    };
  }, [go, idx, onClose]);

  const slideV = {
    enter: (d) => ({ y: d > 0 ? "8%" : "-8%", opacity: 0 }),
    center: { y: "0%", opacity: 1 },
    exit: (d) => ({ y: d > 0 ? "-8%" : "8%", opacity: 0 }),
  };
  const imageV = { enter: { scale: 1.12, opacity: 0 }, center: { scale: 1.02, opacity: 1 }, exit: { scale: 0.95, opacity: 0 } };
  const spring = { type: "tween", duration: 0.65, ease: [0.76, 0, 0.24, 1] };

  if (!current) return null;

  return (
    <motion.div className="fixed inset-0 z-[100] bg-[#060606] overflow-hidden select-none"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>

      {/* Noise */}
      <div className="pointer-events-none fixed inset-0 z-[110] opacity-[0.03] mix-blend-overlay"
        style={{ backgroundImage: NOISE_SVG, backgroundRepeat: "repeat" }} />
      {/* Vignette */}
      <div className="pointer-events-none fixed inset-0 z-[105]"
        style={{ background: "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.45) 100%)" }} />

      <AnimatePresence mode="wait" custom={dir}>
        <motion.div key={idx} className="absolute inset-0 flex flex-col md:flex-row"
          initial="enter" animate="center" exit="exit" custom={dir}>

          {/* Image */}
          <motion.div className="relative w-full md:w-[56%] h-[42vh] md:h-full shrink-0 overflow-hidden cursor-crosshair"
            variants={imageV} transition={{ ...spring, duration: 0.75 }}
            onMouseMove={(e) => {
              if (!imgRef.current) return;
              const r = imgRef.current.getBoundingClientRect();
              imgRef.current.style.transform = `scale(1.06) translate(${((e.clientX - r.left) / r.width - 0.5) * 12}px,${((e.clientY - r.top) / r.height - 0.5) * 8}px)`;
            }}
            onMouseLeave={() => { if (imgRef.current) imgRef.current.style.transform = "scale(1.02) translate(0,0)"; }}
          >
            {current.image ? (
              (current.image.includes('.mp4') || current.image.includes('.webm') || current.image.includes('.mov')) ? (
                <video ref={imgRef} src={current.image} className="w-full h-full object-cover will-change-transform" style={{ transform: "scale(1.02)", transition: "transform 0.4s cubic-bezier(.23,1,.32,1)" }} muted loop playsInline autoPlay />
              ) : (
                <img ref={imgRef} src={current.image} alt={current.text} className="w-full h-full object-cover will-change-transform" style={{ transform: "scale(1.02)", transition: "transform 0.4s cubic-bezier(.23,1,.32,1)" }} />
              )
            ) : (
              <div className="w-full h-full bg-white/[0.03]" />
            )}
            <div className="absolute inset-0 hidden md:block" style={{ background: "linear-gradient(90deg, transparent 55%, #060606 100%)" }} />
            <div className="absolute inset-0 md:hidden" style={{ background: "linear-gradient(180deg, transparent 40%, #060606 100%)" }} />
          </motion.div>

          {/* Details */}
          <motion.div className="flex-1 flex flex-col justify-center px-8 md:px-16 py-6 md:py-0 relative z-10"
            variants={slideV} custom={dir} transition={spring}>

            <motion.div className="flex items-center gap-3 mb-8"
              initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
              <span className="text-[#ff6b1a] font-mono text-xs font-black tracking-[0.3em]">{String(idx + 1).padStart(2, "0")}</span>
              <div className="w-10 h-px bg-white/10" />
              <span className="text-white/20 font-mono text-xs tracking-[0.3em]">{String(items.length).padStart(2, "0")}</span>
            </motion.div>

            <motion.span className="inline-block self-start px-3.5 py-1 rounded-full text-[8px] font-black uppercase tracking-[0.4em] mb-5 border"
              style={{ background: "rgba(255,107,26,0.08)", borderColor: "rgba(255,107,26,0.15)", color: "#ff6b1a" }}
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
              {current.category}
            </motion.span>

            <motion.h1 className="font-black text-white leading-[0.95] tracking-[-0.04em] mb-5"
              style={{ fontSize: "clamp(2rem, 4.5vw, 4.2rem)" }}
              initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6, ease: [0.76, 0, 0.24, 1] }}>
              {current.text}
            </motion.h1>

            {current.description && (
              <motion.p className="text-[13px] text-white/35 font-light leading-[1.8] mb-8 max-w-sm"
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
                {current.description}
              </motion.p>
            )}

            {current.tech && (
              <motion.div className="flex flex-wrap gap-1.5 mb-8"
                initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }}>
                {current.tech.split("·").map((t, i) => (
                  <span key={i} className="px-3 py-1.5 bg-white/[0.03] border border-white/[0.06] rounded-lg text-[9px] text-white/30 tracking-[0.15em] uppercase">
                    {t.trim()}
                  </span>
                ))}
              </motion.div>
            )}

            <motion.div className="flex flex-wrap items-center gap-3" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
              {current.id && (
                <button
                  onClick={() => { onClose(); router.push(`/project/${current.id}`); }}
                  className="inline-flex items-center gap-2 px-5 py-2.5 border border-white/15 text-white/60 hover:text-white hover:border-white/40 rounded-full text-[9px] uppercase tracking-[0.3em] font-bold transition-all duration-200"
                >
                  Full Details
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2 8L8 2M8 2H4M8 2v4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>
                </button>
              )}
              {current.link && <MagneticCTA href={current.link}>View Live</MagneticCTA>}
            </motion.div>

            <motion.p className="mt-auto pt-6 text-[8px] text-white/10 tracking-[0.5em] uppercase"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
              {current.category} Collection · {items.length} works
            </motion.p>
          </motion.div>
        </motion.div>
      </AnimatePresence>

      {/* Side dots */}
      <div className="fixed right-5 md:right-8 top-1/2 -translate-y-1/2 z-[120] flex flex-col items-center gap-3">
        <button onClick={() => go(idx - 1)} disabled={idx === 0}
          className={`p-2 rounded-full border backdrop-blur-sm transition-all duration-300 ${idx === 0 ? "border-white/[0.04] text-white/[0.08] cursor-default" : "border-white/10 text-white/30 hover:text-white hover:bg-white/5"}`}>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2.5 7.5l3.5-3.5 3.5 3.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
        <div className="flex flex-col gap-[6px] py-2">
          {items.map((_, i) => (
            <button key={i} onClick={() => go(i)} title={items[i]?.text} className="flex items-center justify-center">
              <motion.div className="rounded-full"
                animate={{ width: i === idx ? 6 : 4, height: i === idx ? 18 : 4, backgroundColor: i === idx ? "#ff6b1a" : "rgba(255,255,255,0.12)" }}
                transition={{ duration: 0.35, ease: [0.76, 0, 0.24, 1] }} />
            </button>
          ))}
        </div>
        <button onClick={() => go(idx + 1)} disabled={idx === items.length - 1}
          className={`p-2 rounded-full border backdrop-blur-sm transition-all duration-300 ${idx === items.length - 1 ? "border-white/[0.04] text-white/[0.08] cursor-default" : "border-white/10 text-white/30 hover:text-white hover:bg-white/5"}`}>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2.5 4.5l3.5 3.5 3.5-3.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
      </div>

      {/* Close */}
      <button onClick={onClose}
        className="fixed top-6 left-6 md:left-auto md:right-20 z-[120] flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 text-white/30 hover:text-white hover:bg-white/5 text-[9px] tracking-[0.4em] uppercase transition-all backdrop-blur-sm">
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
          <path d="M1.5 1.5l7 7M8.5 1.5l-7 7" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
        </svg>
        Close
      </button>

      <div className="fixed bottom-5 right-24 z-[120] hidden md:flex items-center gap-3">
        <span className="text-[7px] text-white/10 tracking-[0.4em] uppercase">↑↓ Navigate</span>
        <div className="w-px h-2.5 bg-white/[0.06]" />
        <span className="text-[7px] text-white/10 tracking-[0.4em] uppercase">ESC Close</span>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════
   MAIN PROJECTS PAGE — CircularGallery + Showcase
   ═══════════════════════════════════════════════ */
export default function ProjectsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [items, setItems] = useState(null);
  const [allFull, setAllFull] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const catParam = searchParams.get("cat");
  // Normalize mapping: "website" -> "WEBSITE", "design" -> "DESIGNS", "video" -> "VIDEOS"
  const getInitialCategory = () => {
    if (!catParam) return "ALL";
    const c = catParam.toLowerCase();
    if (c.includes("web") || c.includes("site")) return "WEBSITE";
    if (c.includes("design") || c.includes("poster") || c.includes("photo") || c.includes("pic")) return "DESIGNS";
    if (c.includes("video") || c.includes("motion") || c.includes("film") || c.includes("edit")) return "VIDEOS";
    return "ALL";
  };
  
  const [activeCategory, setActiveCategory] = useState(getInitialCategory());

  useEffect(() => {
    fetch("/api/works")
      .then((r) => r.ok ? r.json() : [])
      .then((data) => {
        if (data && data.length > 0) {
          const normalizeCategory = (cat) => {
            const c = (cat || "").toLowerCase();
            if (c.includes("web") || c.includes("site")) return "Website";
            if (c.includes("design") || c.includes("poster") || c.includes("ui") || c.includes("graphic")) return "Designs";
            if (c.includes("photo") || c.includes("image") || c.includes("pic")) return "Photos";
            if (c.includes("video") || c.includes("motion") || c.includes("film") || c.includes("edit")) return "Videos";
            return cat || "Website";
          };
          const mapped = data.map((p) => ({
            id: p.id,
            image: p.image_url || `https://picsum.photos/seed/${p.id}/800/600?grayscale`,
            text: p.title,
            category: normalizeCategory(p.category),
            description: p.description,
            tech: p.tech,
            link: p.link,
          }));
          setAllFull(mapped);
        } else {
          setAllFull([]);
        }
      })
      .catch(() => {
        setAllFull([]);
      });
  }, []);

  const [spinRequest, setSpinRequest] = useState({ index: 0, timestamp: 0 });
  const [filteredFull, setFilteredFull] = useState(null);

  // Rebuild gallery items whenever allFull or activeCategory changes
  useEffect(() => {
    if (!allFull) return;
    const filtered = activeCategory === "ALL"
      ? allFull
      : allFull.filter(p => (p.category || "").toLowerCase() === activeCategory.toLowerCase());
    const display = filtered;
    setFilteredFull(display);
    setItems(display.map(p => ({ image: p.image, text: p.text })));
    setSpinRequest({ index: 0, timestamp: Date.now() });
  }, [allFull, activeCategory]);

  const handleCategoryClick = (cat) => {
    setActiveCategory(cat);
  };

  const handleItemClick = useCallback((idx) => {
    const pool = filteredFull || allFull;
    if (!pool || !pool[idx]) return;
    const item = pool[idx];
    if (item.id) {
      router.push(`/project/${item.id}`);
    }
  }, [filteredFull, allFull, router]);

  const categories = ["ALL", "WEBSITE", "DESIGNS", "PHOTOS", "VIDEOS"];

  return (
    <>
      <section className="relative w-full overflow-hidden" style={{ height: "100svh" }}>
        {/* Gallery */}
        <div className="absolute inset-0">
          {items !== null && items.length > 0 ? (
            <CircularGallery
              key={activeCategory}
              items={items}
              bend={3}
              textColor="gradient"
              borderRadius={0.05}
              font="500 40px 'Inter', sans-serif"
              scrollSpeed={2}
              scrollEase={0.05}
              onItemClick={handleItemClick}
              activeIndex={0}
              spinTimestamp={spinRequest.timestamp}
            />
          ) : items !== null && items.length === 0 ? (
            <div className="flex items-center justify-center w-full h-full text-white/30 text-xs tracking-[0.3em] uppercase">
              No projects found in this category.
            </div>
          ) : null}
        </div>

        {/* Top fade */}
        <div className="absolute inset-x-0 top-0 h-80 bg-gradient-to-b from-[#080808] via-[#080808]/70 to-transparent pointer-events-none z-10" />

        {/* Heading — desktop only */}
        <div className="hidden md:block absolute top-0 left-0 px-6 md:px-20 pt-24 md:pt-28 pointer-events-none z-20">
          <p className="font-sans text-[10px] text-[#ff6b1a] tracking-[0.5em] uppercase mb-2 md:mb-3 font-medium">
            Creative
          </p>
          <h1
            className="font-sans font-black tracking-tighter text-white leading-none"
            style={{ fontSize: "clamp(2rem, 8vw, 8rem)" }}
          >
            Archive.
          </h1>
        </div>

        {/* Mobile: section title in top nav area */}
        <div className="md:hidden absolute top-0 left-0 right-0 px-6 pt-20 pointer-events-none z-20 flex items-center justify-between">
          <div>
            <p className="text-[9px] text-[#ff6b1a] tracking-[0.4em] uppercase font-medium">Creative</p>
            <p className="text-white font-black tracking-tighter text-2xl leading-none">
              {activeCategory === "ALL" ? "Archive." : activeCategory.charAt(0) + activeCategory.slice(1).toLowerCase()}
            </p>
          </div>
        </div>

        {/* Filters — desktop: top right | mobile: bottom bar */}
        <div className="hidden md:flex absolute top-[8.5rem] right-20 z-30 gap-6 items-center pointer-events-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryClick(cat)}
              className={`text-[11px] uppercase tracking-[0.2em] font-bold transition-all duration-300 relative ${activeCategory === cat ? "text-[#ff6b1a]" : "text-white/40 hover:text-white"}`}
            >
              {cat}
              {activeCategory === cat && (
                <motion.div layoutId="activeFilter" className="absolute -bottom-2 left-0 right-0 h-0.5 bg-[#ff6b1a]" />
              )}
            </button>
          ))}
        </div>

        {/* Mobile filters — bottom */}
        <div className="md:hidden absolute bottom-[6vh] left-0 right-0 z-30 flex justify-center gap-4 px-4 pointer-events-auto">
          <div className="flex items-center gap-3 bg-black/60 backdrop-blur-md border border-white/10 rounded-full px-5 py-2.5">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategoryClick(cat)}
                className={`text-[9px] uppercase tracking-[0.15em] font-bold transition-all duration-200 relative ${
                  activeCategory === cat ? "text-[#ff6b1a]" : "text-white/35 hover:text-white"
                }`}
              >
                {cat}
                {activeCategory === cat && (
                  <motion.div layoutId="activeFilterMobile" className="absolute -bottom-1.5 left-0 right-0 h-[1.5px] bg-[#ff6b1a]" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Simple Drag / Swipe Indicator — desktop only */}
        <div className="absolute bottom-[3vh] left-1/2 -translate-x-1/2 pointer-events-none z-20 hidden md:flex items-center gap-4 opacity-100">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" className="opacity-70">
            <path d="M19 12H5M5 12L12 19M5 12L12 5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>

          <div className="w-14 h-6 rounded-full border border-white/50 flex items-center justify-center relative bg-black/40 backdrop-blur-md">
            <motion.div
              animate={{ x: [-8, 8, -8] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              className="w-1.5 h-1.5 bg-[#ff6b1a] rounded-full"
            />
          </div>

          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" className="opacity-70">
            <path d="M5 12H19M19 12L12 19M19 12L12 5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </section>


    </>
  );
}
