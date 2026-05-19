"use client";
import { motion } from "motion/react";
import { useEffect, useRef, useState, useMemo } from "react";

const buildKeyframes = (from, steps) => {
  const keys = new Set([...Object.keys(from), ...steps.flatMap((s) => Object.keys(s))]);
  const keyframes = {};
  keys.forEach((k) => {
    keyframes[k] = [from[k], ...steps.map((s) => s[k])];
  });
  return keyframes;
};

const BlurText = ({
  text = "",
  delay = 200,
  className = "",
  animateBy = "words",
  direction = "top",
  threshold = 0.1,
  rootMargin = "0px",
  animationFrom,
  animationTo,
  easing = (t) => t,
  onAnimationComplete,
  stepDuration = 0.35,
  animateOnMount = false,
}) => {
  const elements = useMemo(() => {
    if (animateBy !== "words") {
      return text.split("").map(char => ({ word: char, punctuation: "", isItalic: false }));
    }
    let inItalic = false;
    return text.split(" ").map((word) => {
      let currentItalic = inItalic;
      let cleanWord = word;
      let punctuation = "";

      if (cleanWord.startsWith("*")) {
        cleanWord = cleanWord.slice(1);
        inItalic = true;
        currentItalic = true;
      }

      const trailingMatch = cleanWord.match(/^(.*?)\*([.,\/#!$%\^&\*;:{}=\-_`~()]*)$/);
      if (trailingMatch) {
        cleanWord = trailingMatch[1];
        punctuation = trailingMatch[2];
        inItalic = false;
      }

      return {
        word: cleanWord,
        punctuation,
        isItalic: currentItalic,
      };
    });
  }, [text, animateBy]);

  const [inView, setInView] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (animateOnMount) {
      setInView(true);
      return;
    }
    if (!ref.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.unobserve(ref.current);
        }
      },
      { threshold, rootMargin }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold, rootMargin, animateOnMount]);

  const defaultFrom = useMemo(
    () =>
      direction === "top"
         ? { filter: "blur(10px)", opacity: 0, y: -50 }
         : { filter: "blur(10px)", opacity: 0, y: 50 },
    [direction]
  );

  const defaultTo = useMemo(
    () => [
      { filter: "blur(5px)", opacity: 0.5, y: direction === "top" ? 5 : -5 },
      { filter: "blur(0px)", opacity: 1, y: 0 },
    ],
    [direction]
  );

  const fromSnapshot = animationFrom ?? defaultFrom;
  const toSnapshots = animationTo ?? defaultTo;
  const stepCount = toSnapshots.length + 1;
  const totalDuration = stepDuration * (stepCount - 1);
  const times = Array.from({ length: stepCount }, (_, i) =>
    stepCount === 1 ? 0 : i / (stepCount - 1)
  );

  return (
    <p ref={ref} className={className}>
      {elements.map((segment, index) => {
        const animateKeyframes = buildKeyframes(fromSnapshot, toSnapshots);
        const spanTransition = {
          duration: totalDuration,
          times,
          delay: (index * delay) / 1000,
          ease: easing,
        };

        return (
          <motion.span
            key={index}
            style={{ display: "inline-block" }}
            initial={fromSnapshot}
            animate={inView ? animateKeyframes : fromSnapshot}
            transition={spanTransition}
            onAnimationComplete={
              index === elements.length - 1 ? onAnimationComplete : undefined
            }
          >
            {segment.isItalic ? (
              <span className="font-serif italic text-white/90">{segment.word}</span>
            ) : (
              segment.word
            )}
            {segment.punctuation}&nbsp;
          </motion.span>
        );
      })}
    </p>
  );
};

export default BlurText;
