"use client";
import { useEffect, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import BlurText from "@/components/BlurText";
import ProfileCard from "@/components/ProfileCard";
import { SECTION, HEADING, BIO, RESUME_URL, TECH, CREATIVE, EXPERIENCE } from "@/app/about/content";

export default function AboutPage() {
  const ref = useRef(null);
  const router = useRouter();

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".ap-label", { y: 20, opacity: 0, duration: 0.5, delay: 0.3 });
      gsap.from(".ap-h", { y: 55, opacity: 0, duration: 0.8, ease: "power4.out", delay: 0.5 });
      gsap.from(".ap-bio", { y: 25, opacity: 0, duration: 0.6, delay: 0.7 });
      gsap.from(".ap-skill", { x: -10, opacity: 0, stagger: 0.04, duration: 0.4, delay: 0.9 });
      gsap.from(".ap-img", { scale: 1.04, opacity: 0, duration: 1.4, ease: "power3.out", delay: 0.1 });
      gsap.from(".ap-card", { scale: 0.95, opacity: 0, duration: 1.2, ease: "power4.out", delay: 0.2 });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={ref} className="relative w-full min-h-dvh overflow-hidden">

      {/* Background image */}
      <div className="ap-img absolute inset-0 z-0 opacity-20">
        <Image
          src="/photo/about me.webp"
          alt="Sarang"
          fill
          className="object-cover object-center filter blur-md"
          priority
        />
        {/* Mobile: heavy bottom dark overlay so text is readable */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-[#080808]/80 to-[#080808]/30 md:hidden" />
        {/* Desktop: side gradient */}
        <div className="hidden md:block absolute inset-0 bg-gradient-to-l from-[#080808] via-[#080808]/90 to-transparent" />
        <div className="hidden md:block absolute inset-0 bg-gradient-to-t from-[#080808] via-transparent to-[#080808]/60" />
      </div>

      {/* ── MOBILE LAYOUT ── */}
      <div className="md:hidden relative z-10 flex flex-col justify-end min-h-dvh px-5 pt-24 pb-8">
        <p className="ap-label text-[9px] text-[#ff6b1a] tracking-[0.45em] uppercase mb-3 font-medium">
          {SECTION.label}
        </p>
        <h1 className="ap-h font-black tracking-tighter leading-[0.88] mb-4 text-[2.6rem]">
          <span className="block text-white">{HEADING.line1}</span>
          <span className="block text-white">{HEADING.line2}</span>
          <span className="block ghost">{HEADING.line3}</span>
        </h1>

        <div className="ap-card flex justify-center my-6">
          <ProfileCard
            name="Sarang"
            title="Creative Developer & Designer"
            handle="sarang"
            status="Available for Projects"
            contactText="Hire Me"
            avatarUrl="/photo/Sarang.png"
            miniAvatarUrl="/photo/Sarang.png"
            showUserInfo={true}
            enableTilt={false}
            enableMobileTilt={false}
            onContactClick={() => router.push("/contact")}
          />
        </div>

        {BIO.map((text, i) => (
          <p key={i} className="ap-bio text-[13px] text-white/50 mb-3 font-light leading-relaxed">
            {text}
          </p>
        ))}

        <a
          href={RESUME_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="ap-bio self-start inline-flex items-center gap-2 px-5 py-2.5 border border-[#ff6b1a]/30 text-[#ff6b1a] text-[10px] font-bold uppercase tracking-widest rounded-full hover:bg-[#ff6b1a] hover:text-black transition-colors duration-300 mb-7"
        >
          View Resume
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
        </a>

        {/* Skills horizontal scroll */}
        <div className="space-y-4">
          <div>
            <p className="text-[8px] tracking-[0.4em] uppercase mb-2 text-white/30">Tech I Work With</p>
            <div className="flex gap-1.5 overflow-x-auto pb-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              {TECH.map((s) => (
                <span key={s.name} className="ap-skill shrink-0 px-2.5 py-1 flex items-center gap-1 bg-white/90 rounded-full text-[8px] text-black tracking-wide uppercase font-medium">
                  <s.icon className="w-2 h-2" />{s.name}
                </span>
              ))}
            </div>
          </div>
          <div>
            <p className="text-[8px] tracking-[0.4em] uppercase mb-2 text-white/30">Creative Tools</p>
            <div className="flex gap-1.5 overflow-x-auto pb-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              {CREATIVE.map((s) => (
                <span key={s.name} className="ap-skill shrink-0 px-2.5 py-1 flex items-center gap-1 bg-white/90 rounded-full text-[8px] text-black tracking-wide uppercase font-medium">
                  <s.icon className="w-2 h-2" />{s.name}
                </span>
              ))}
            </div>
          </div>
          <div>
            <p className="text-[8px] tracking-[0.4em] uppercase mb-2 text-white/30">Experience</p>
            <div className="flex flex-col gap-2">
              {EXPERIENCE.map((exp, i) => (
                <div key={i} className="ap-skill">
                  <p className="text-white/80 text-[12px] font-medium leading-tight">{exp.role}</p>
                  <p className="text-white/30 text-[8px] tracking-widest uppercase">{exp.period}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── DESKTOP LAYOUT ── */}
      <div className="hidden md:grid md:grid-cols-2 relative z-10 w-full max-w-7xl mx-auto px-16 lg:px-24 pt-28 pb-48 items-center gap-12 lg:gap-20">
        {/* Left: 3D Profile Card */}
        <div className="ap-card flex justify-center items-center">
          <ProfileCard
            name="Sarang"
            title="Creative Developer & Designer"
            handle="sarang"
            status="Available for Projects"
            contactText="Hire Me"
            avatarUrl="/photo/Sarang.png"
            miniAvatarUrl="/photo/Sarang.png"
            showUserInfo={true}
            enableTilt={true}
            enableMobileTilt={false}
            onContactClick={() => router.push("/contact")}
          />
        </div>

        {/* Right: Text Info */}
        <div className="flex flex-col items-start text-left">
          <p className="ap-label text-[10px] text-[#ff6b1a] tracking-[0.5em] uppercase mb-4 font-medium">
            {SECTION.label}
          </p>
          <h1 className="ap-h font-black tracking-tighter leading-[0.88] mb-6" style={{ fontSize: "clamp(2.2rem, 4.5vw, 4.5rem)" }}>
            <span className="block text-white">{HEADING.line1}</span>
            <span className="block text-white">{HEADING.line2}</span>
            <span className="block ghost">{HEADING.line3}</span>
          </h1>
          {BIO.map((text, i) => (
            <BlurText key={i} text={text} delay={20} animateBy="words" direction="bottom" stepDuration={0.18}
              className="ap-bio text-xs md:text-sm text-white/45 max-w-md mb-4 font-light leading-relaxed text-left"
            />
          ))}
          <a href={RESUME_URL} target="_blank" rel="noopener noreferrer"
            className="ap-bio inline-flex items-center gap-2 px-5 py-2.5 border border-[#ff6b1a]/30 text-[#ff6b1a] text-[10px] font-bold uppercase tracking-widest rounded-full hover:bg-[#ff6b1a] hover:text-black transition-colors duration-300 mt-2"
          >
            View Resume
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
          </a>
        </div>
      </div>

      {/* SKILLS — desktop bottom */}
      <div className="hidden md:block absolute z-20 bottom-0 left-0 w-full lg:w-[62%] px-14 lg:px-16 pb-10">
        <div className="flex flex-col lg:flex-row lg:items-end gap-3 lg:gap-6">
          <div className="flex-1 min-w-0">
            <p className="ap-bio text-[8px] tracking-[0.4em] uppercase mb-1.5 text-white/35">Tech I Work With</p>
            <div className="flex gap-1 flex-wrap">
              {TECH.map((s) => (
                <span key={s.name} className="ap-skill px-2 py-0.5 flex items-center gap-0.5 bg-white/90 rounded-full text-[7px] text-black tracking-wider uppercase">
                  <s.icon className="w-1.5 h-1.5" />{s.name}
                </span>
              ))}
            </div>
          </div>
          <div className="lg:w-[180px] lg:min-w-[180px]">
            <p className="ap-bio text-[8px] tracking-[0.4em] uppercase mb-1.5 text-white/35">Creative Tools</p>
            <div className="flex gap-1 flex-wrap">
              {CREATIVE.map((s) => (
                <span key={s.name} className="ap-skill px-2 py-0.5 flex items-center gap-0.5 bg-white/90 rounded-full text-[7px] text-black tracking-wider uppercase">
                  <s.icon className="w-1.5 h-1.5" />{s.name}
                </span>
              ))}
            </div>
          </div>
          <div className="lg:w-auto lg:min-w-[180px]">
            <p className="ap-bio text-[8px] tracking-[0.4em] uppercase mb-1.5 text-white/35">Experience</p>
            <div className="flex flex-col gap-1">
              {EXPERIENCE.map((exp, i) => (
                <div key={i} className="ap-skill">
                  <p className="text-white/75 text-[11px] font-medium leading-tight">{exp.role}</p>
                  <p className="text-white/30 text-[8px] tracking-widest uppercase">{exp.period}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

    </section>
  );
}