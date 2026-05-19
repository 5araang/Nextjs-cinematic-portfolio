"use client";
import { useEffect, useRef } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

import dynamic from "next/dynamic";
import Cursor from "../components/Cursor";
import Navbar from "../components/Navbar";
const VideoScrub = dynamic(() => import("../components/VideoScrub"), { ssr: false });
import Hero from "../components/Hero";
import About from "../components/About";
import Work from "../components/Work";
import Contact from "../components/Contact";
import Footer from "../components/Footer";
import SeoContent from "../components/SeoContent";

export default function Home() {
  const blurWrapRef = useRef(null);
  const footerRef   = useRef(null);

  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.1, // More responsive, less lag
      smoothWheel: true,
      wheelMultiplier: 1, // Normal scroll speed
    });

    lenis.on("scroll", () => {
      ScrollTrigger.update();
      if (blurWrapRef.current && footerRef.current) {
        const footerTop = footerRef.current.getBoundingClientRect().top;
        const vh = window.innerHeight;
        // opacity = 1 while footer is below viewport, fades as footer enters
        const opacity = footerTop >= vh ? 1 : Math.max(0, footerTop / vh);
        blurWrapRef.current.style.opacity = opacity;
      }

    });

    const tick = (time) => { lenis.raf(time * 1000); };
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
      gsap.ticker.remove(tick);
    };
  }, []);

  return (
    <main>
      {/* SEO-crawlable structured content (visually hidden) - Forced HMR refresh */}
      <SeoContent />

      {/* grain */}
      <div className="grain-overlay" />

      {/* difference cursor */}
      <Cursor />

      {/* sticky scrubbed video — lives behind everything */}
      <VideoScrub />

      {/* scroll progress indicator */}

      {/* fixed nav */}
      <Navbar />

      {/* bottom blur — fixed to viewport, fades when footer arrives */}
      <div ref={blurWrapRef} className="bottom-blur" />

      {/* scrollable sections */}
      <div className="relative z-10">
        <Hero />
        <About />
        <Work />
        <Contact />
        <div ref={footerRef}><Footer /></div>
      </div>
    </main>
  );
}
