"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import BlurText from "./BlurText";

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const ref = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".hero-label", { y: 20, opacity: 0, duration: 0.8, ease: "power3.out", delay: 0.4 });
      gsap.from(".hero-line",  { y: 90, opacity: 0, stagger: 0.1, duration: 1.1, ease: "power4.out", delay: 0.6 });
      
      // Premium staggered letter effect for the main name
      gsap.from(".hero-letter", { 
        y: 100, 
        opacity: 0, 
        rotateX: -40,
        stagger: 0.06, 
        duration: 1.2, 
        ease: "power4.out", 
        delay: 0.7 
      });

      gsap.from(".hero-sub",   { y: 30, opacity: 0, duration: 0.9, ease: "power3.out", delay: 1.4 });

      gsap.to(ref.current, {
        scrollTrigger: {
          trigger: ref.current,
          start: "bottom 60%",
          end:   "bottom 10%",
          scrub: 1.2,
        },
        opacity: 0,
        y: -50,
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={ref}
      className="relative min-h-[135vh] flex flex-col justify-center px-10 md:px-24 overflow-hidden"
    >
      <div className="relative z-10 max-w-5xl">
        <p className="hero-label text-[10px] md:text-xs text-[#ff6b1a] tracking-[0.2em] uppercase font-bold mb-6">
          Digital Experience Designer
        </p>

        <h1
          className="font-black tracking-tighter leading-[0.75] mb-12 flex flex-col relative z-10 hero-clamp-text"
        >
          <span className="hero-line block ghost z-0">Hey, I'm</span>
          <span className="block text-white -mt-2 md:-mt-6 z-10 hero-perspective">
            {"Sarang.".split("").map((char, index) => (
              <span key={index} className="hero-letter inline-block">
                {char === " " ? "\u00A0" : char}
              </span>
            ))}
          </span>
        </h1>

        <div className="max-w-lg hero-sub flex flex-col gap-6">
          <BlurText
            text="I create *immersive* digital experiences that blend design, motion, and technology into something visually *memorable* and smooth to use. My work focuses on building websites and visuals with strong *atmosphere*, *detail*, and *storytelling*."
            delay={30}
            animateBy="words"
            direction="bottom"
            stepDuration={0.22}
            className="text-base md:text-[17px] text-white/60 font-medium leading-[1.6]"
          />
          <BlurText
            text="I mainly work with React, Shopify, Flutter, editing, and visual design, combining development with *cinematic* styling and *modern* user experiences."
            delay={22}
            animateBy="words"
            direction="bottom"
            stepDuration={0.2}
            className="text-xs md:text-sm text-white/40 font-light leading-relaxed"
          />
          <BlurText
            text="So far, I’ve completed *6* *websites*, edited *75+* *videos*, and created *500+* *photo* *edits* and visual concepts. Currently, I’m focusing on a *job* *app* and a *billing* *app* while continuing to explore *creative* *development* and *interactive* *design*."
            delay={15}
            animateBy="words"
            direction="bottom"
            stepDuration={0.18}
            className="text-xs md:text-sm text-white/30 font-light leading-relaxed"
          />

          <p className="mt-8 text-[10px] text-white/40 tracking-[0.4em] uppercase font-medium">
            Explore ↓
          </p>
        </div>
      </div>

    </section>
  );
}
