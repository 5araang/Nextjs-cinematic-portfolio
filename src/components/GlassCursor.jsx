"use client";
import { useEffect, useRef } from "react";

export default function GlassCursor() {
  const cursorRef = useRef(null);
  const pos   = useRef({ x: -200, y: -200 });
  const curr  = useRef({ x: -200, y: -200 });

  useEffect(() => {
    const onMove = (e) => {
      pos.current = { x: e.clientX, y: e.clientY };
    };

    const onEnter = () => {
      if (cursorRef.current) cursorRef.current.classList.add("glass-cursor--hover");
    };
    const onLeave = () => {
      if (cursorRef.current) cursorRef.current.classList.remove("glass-cursor--hover");
    };

    window.addEventListener("mousemove", onMove);

    const addHover = () => {
      document.querySelectorAll("a, button, [role='button']").forEach((el) => {
        el.addEventListener("mouseenter", onEnter);
        el.addEventListener("mouseleave", onLeave);
      });
    };
    addHover();

    const observer = new MutationObserver(addHover);
    observer.observe(document.body, { childList: true, subtree: true });

    let raf;
    const lerp = (a, b, t) => a + (b - a) * t;
    const tick = () => {
      curr.current.x = lerp(curr.current.x, pos.current.x, 0.1);
      curr.current.y = lerp(curr.current.y, pos.current.y, 0.1);
      if (cursorRef.current) {
        const size = cursorRef.current.classList.contains("glass-cursor--hover") ? 56 : 36;
        cursorRef.current.style.transform = `translate(${curr.current.x - size / 2}px, ${curr.current.y - size / 2}px)`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMove);
      observer.disconnect();
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <svg style={{ position: "fixed", width: 0, height: 0, overflow: "hidden" }} aria-hidden>
        <defs>
          <filter id="ca-filter" x="-20%" y="-20%" width="140%" height="140%">
            <feColorMatrix in="SourceGraphic" type="matrix"
              values="1 0 0 0 0.04  0 1 0 0 0  0 0 1 0 -0.04  0 0 0 1 0"
              result="shifted"
            />
            <feBlend in="SourceGraphic" in2="shifted" mode="screen" />
          </filter>
        </defs>
      </svg>

      <div
        ref={cursorRef}
        className="glass-cursor"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: 36,
          height: 36,
          borderRadius: "50%",
          backdropFilter: "blur(6px) saturate(160%) brightness(1.08)",
          WebkitBackdropFilter: "blur(6px) saturate(160%) brightness(1.08)",
          background: "rgba(255,255,255,0.07)",
          border: "1px solid rgba(255,255,255,0.22)",
          boxShadow: "inset 0 1px 1px rgba(255,255,255,0.18), 0 0 0 1px rgba(0,0,0,0.12)",
          zIndex: 9998,
          pointerEvents: "none",
          willChange: "transform",
          transition: "width 0.25s ease, height 0.25s ease",
          filter: "url(#ca-filter)",
        }}
      />
    </>
  );
}
