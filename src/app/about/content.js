// ─────────────────────────────────────────────
//  ABOUT SECTION — edit everything here
// ─────────────────────────────────────────────

import {
  SiReact, SiNextdotjs, SiJavascript, SiTailwindcss,
  SiFlutter, SiShopify, SiPython, SiCplusplus,
  SiDavinciresolve, SiFigma,
  SiHtml5, SiCss, SiTypescript, SiPhp, SiGo, SiRust, SiSwift, SiKotlin,
  SiGit, SiDocker, SiNodedotjs, SiExpress, SiMongodb, SiPostgresql, SiMysql, SiRedis,
  SiVercel, SiNetlify, SiPostman,
} from "react-icons/si";
import { FaJava } from "react-icons/fa";
import {
  TbCut, TbSql, TbPhoto,
  TbBrandAdobeAfterEffect, TbBrandAdobePremier,
  TbBrandAdobePhotoshop, TbBrandAdobeIllustrator,
} from "react-icons/tb";

export const SECTION = {
  label: "About Me",
};

export const HEADING = {
  line1: "Crafting",
  line2: "the",
  line3: "invisible.",   // ghost (outline) style
};

// *word* = highlighted/bold in BlurText
export const BIO = [
  "I'm *19* and currently studying *Cybersecurity*, but most of my time is spent creating things on the internet that feel *immersive*, *cinematic*, and *alive*. I love building *portfolio* *websites*, smooth *UI* *interactions*, motion visuals, and creative edits that blend *storytelling* with technology — crafting a *feeling* through motion, atmosphere, and detail.",
];

export const RESUME_URL = "/resume.pdf";

export const TECH = [
  { name: "React",          icon: SiReact },
  { name: "Next.js",        icon: SiNextdotjs },
  { name: "JavaScript",     icon: SiJavascript },
  { name: "TypeScript",     icon: SiTypescript },
  { name: "HTML5",          icon: SiHtml5 },
  { name: "CSS3",           icon: SiCss },
  { name: "Tailwind CSS",   icon: SiTailwindcss },
  { name: "Node.js",        icon: SiNodedotjs },
  { name: "Express",        icon: SiExpress },
  { name: "Flutter",        icon: SiFlutter },
  { name: "Shopify Liquid", icon: SiShopify },
  { name: "Python",         icon: SiPython },
  { name: "Java",           icon: FaJava },
  { name: "C++",            icon: SiCplusplus },
  { name: "PHP",            icon: SiPhp },
  { name: "Go",             icon: SiGo },
  { name: "Rust",           icon: SiRust },
  { name: "Swift",          icon: SiSwift },
  { name: "Kotlin",         icon: SiKotlin },
  { name: "SQL",            icon: TbSql },
  { name: "MongoDB",        icon: SiMongodb },
  { name: "PostgreSQL",     icon: SiPostgresql },
  { name: "MySQL",          icon: SiMysql },
  { name: "Redis",          icon: SiRedis },
  { name: "Git",            icon: SiGit },
  { name: "Docker",         icon: SiDocker },
  { name: "Vercel",         icon: SiVercel },
  { name: "Netlify",        icon: SiNetlify },
  { name: "Postman",        icon: SiPostman },
];

export const CREATIVE = [
  { name: "After Effects",   icon: TbBrandAdobeAfterEffect },
  { name: "Premiere Pro",    icon: TbBrandAdobePremier },
  { name: "DaVinci Resolve", icon: SiDavinciresolve },
  { name: "CapCut",          icon: TbCut },
  { name: "Photoshop",       icon: TbBrandAdobePhotoshop },
  { name: "Lightroom",       icon: TbPhoto },
  { name: "Figma",           icon: SiFigma },
  { name: "Illustrator",     icon: TbBrandAdobeIllustrator },
];

export const EXPERIENCE = [
  { role: "Freelance Developer",                       period: "2024 – Present" },
  { role: "Freelance Video Editor",                    period: "2022 – Present" },
  { role: "Freelance Photo Editor & Graphic Designer", period: "2020 – Present" },
];
