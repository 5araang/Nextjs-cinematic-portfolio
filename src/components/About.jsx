"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import BlurText from "./BlurText";
import { SECTION, HEADING, BIO, RESUME_URL, TECH, CREATIVE, EXPERIENCE } from "@/app/about/content";

gsap.registerPlugin(ScrollTrigger);

export default function About({ standalone = false }) {
  const ref = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (standalone) {
        gsap.from(".about-label", { y: 25, opacity: 0, duration: 0.6, delay: 0.4 });
        gsap.from(".about-h", { y: 70, opacity: 0, duration: 0.9, ease: "power4.out", delay: 0.6 });
        gsap.from(".about-p", { y: 40, opacity: 0, duration: 0.7, delay: 0.8 });
        gsap.from(".about-skill", { x: -20, opacity: 0, stagger: 0.08, duration: 0.5, delay: 1.0 });
        gsap.from(".about-img", { scale: 0.9, opacity: 0, duration: 1.2, ease: "power3.out", delay: 0.8 });
        return;
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: ref.current,
          start: "top bottom",
          toggleActions: "play none none none",
          once: true,
        },
      });

      tl.from(".about-label", { y: 14, opacity: 0, duration: 0.3, ease: "power3.out" })
        .from(".about-h", { y: 35, opacity: 0, duration: 0.4, ease: "power4.out" }, 0.05)
        .from(".about-p", { y: 20, opacity: 0, duration: 0.35, ease: "power3.out" }, 0.15)
        .from(".about-skill", { x: -10, opacity: 0, stagger: 0.03, duration: 0.25, ease: "power2.out" }, 0.22);

      gsap.to(ref.current, {
        scrollTrigger: {
          trigger: ref.current,
          start: "bottom 80%",
          end: "bottom 15%",
          scrub: 1.2,
        },
        opacity: 0,
        y: -45,
      });

      setTimeout(() => ScrollTrigger.refresh(), 300);
    }, ref);
    return () => ctx.revert();
  }, [standalone]);

  return (
    <section
      id="about-section"
      ref={ref}
      className={`relative w-full min-h-screen px-10 md:px-20 ${standalone ? "" : "z-20"}`}
    >
      {standalone && (
        <div className="about-img absolute inset-0 z-0">
          <Image
            src="/photo/about me.webp"
            alt="Sarang"
            fill
            className="object-cover object-center"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-l from-[#080808] via-[#080808]/80 to-[#080808]/10" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-transparent to-[#080808]/60" />
        </div>
      )}

      <div className="relative z-10 w-full min-h-screen flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-20 py-32">

        {/* Left Bio */}
        <div className={`w-full lg:w-[55%] max-w-2xl flex flex-col ${standalone ? "ml-auto lg:pr-10 text-right items-end" : "mr-auto text-left items-start"}`}>
          <p className="about-label text-[10px] text-[#ff6b1a] tracking-[0.5em] uppercase mb-6 font-medium">
            {SECTION.label}
          </p>

          <h2
            className="about-h font-black tracking-tighter leading-[0.88] mb-8"
            style={{ fontSize: "clamp(2.5rem, 7vw, 6.5rem)" }}
          >
            <span className="block text-white">{HEADING.line1}</span>
            <span className="block text-white">{HEADING.line2}</span>
            <span className="block ghost">{HEADING.line3}</span>
          </h2>

          {BIO.map((text, i) => (
            <BlurText
              key={i}
              text={text}
              delay={25}
              animateBy="words"
              direction="bottom"
              stepDuration={0.22}
              className={`about-p text-sm md:text-base text-white/50 max-w-lg ${i < BIO.length - 1 ? "mb-6" : "mb-4"} font-light leading-relaxed ${standalone ? "text-right" : ""}`}
            />
          ))}

          <div className={`about-p mt-6 ${standalone ? "flex justify-end" : "flex justify-start"}`}>
            <a
              href={RESUME_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 border border-[#ff6b1a]/30 text-[#ff6b1a] text-xs font-bold uppercase tracking-widest rounded-full hover:bg-[#ff6b1a] hover:text-black transition-colors duration-300"
            >
              View Resume
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </a>
          </div>
        </div>

        {/* Right Skills & Experience */}
        <div className={`w-full lg:w-[40%] max-w-md mt-10 lg:mt-0 flex flex-col ${standalone ? "mr-auto lg:items-start lg:text-left" : "ml-auto items-end text-right"}`}>
          <div className="about-p w-12 h-px bg-white/15 mb-8 lg:mb-10" />

          <div className="flex flex-col gap-10 w-full">
            <div className="w-full">
              <p className={`about-p text-[10px] tracking-[0.4em] uppercase mb-6 ${standalone ? "text-left" : "text-right"}`}>
                <span className="border-b border-white/30 pb-2 inline-block text-white/50">Tech I Work With</span>
              </p>
              <div className={`flex gap-2 flex-wrap ${standalone ? "justify-start" : "justify-end"}`}>
                {TECH.map((s) => (
                  <span key={s.name} className="group about-skill px-4 py-2 flex items-center gap-2 border border-white/12 rounded-full text-[10px] text-white/35 tracking-widest uppercase transition-colors duration-300 hover:bg-white hover:text-[#ff6b1a] hover:border-white cursor-default">
                    <s.icon className="w-3 h-3 transition-all duration-300 fill-transparent stroke-current stroke-[1.5px] group-hover:fill-current group-hover:stroke-transparent" />
                    {s.name}
                  </span>
                ))}
              </div>
            </div>

            <div className="w-full">
              <p className={`about-p text-[10px] tracking-[0.4em] uppercase mb-6 ${standalone ? "text-left" : "text-right"}`}>
                <span className="border-b border-white/30 pb-2 inline-block text-white/50">Creative Tools</span>
              </p>
              <div className={`flex gap-2 flex-wrap ${standalone ? "justify-start" : "justify-end"}`}>
                {CREATIVE.map((s) => (
                  <span key={s.name} className="group about-skill px-4 py-2 flex items-center gap-2 border border-white/12 rounded-full text-[10px] text-white/35 tracking-widest uppercase transition-colors duration-300 hover:bg-white hover:text-[#ff6b1a] hover:border-white cursor-default">
                    <s.icon className="w-3 h-3 transition-all duration-300 fill-transparent stroke-current stroke-[1.5px] group-hover:fill-current group-hover:stroke-transparent" />
                    {s.name}
                  </span>
                ))}
              </div>
            </div>

            <div className="w-full">
              <p className={`about-p text-[10px] tracking-[0.4em] uppercase mb-6 ${standalone ? "text-left" : "text-right"}`}>
                <span className="border-b border-white/30 pb-2 inline-block text-white/50">Experience</span>
              </p>
              <div className={`flex flex-col gap-4 mt-2 ${standalone ? "items-start" : "items-end"}`}>
                {EXPERIENCE.map((exp, i) => (
                  <div key={i} className="about-skill">
                    <p className="text-white/80 text-sm font-medium">{exp.role}</p>
                    <p className="text-white/40 text-[10px] tracking-widest uppercase mt-1">{exp.period}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
