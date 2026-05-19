// ─────────────────────────────────────────────
//  CONTACT SECTION — edit everything here
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
  label: "Get In Touch",
};

// Add / remove countries as needed. code = dial prefix (no +).
export const COUNTRIES = [
  { code: "91",  name: "India",         flag: "🇮🇳" },
  { code: "1",   name: "US / Canada",   flag: "🇺🇸" },
  { code: "44",  name: "UK",            flag: "🇬🇧" },
  { code: "971", name: "UAE",           flag: "🇦🇪" },
  { code: "966", name: "Saudi Arabia",  flag: "🇸🇦" },
  { code: "974", name: "Qatar",         flag: "🇶🇦" },
  { code: "92",  name: "Pakistan",      flag: "🇵🇰" },
  { code: "880", name: "Bangladesh",    flag: "🇧🇩" },
  { code: "94",  name: "Sri Lanka",     flag: "🇱🇰" },
  { code: "60",  name: "Malaysia",      flag: "🇲🇾" },
  { code: "65",  name: "Singapore",     flag: "🇸🇬" },
  { code: "61",  name: "Australia",     flag: "🇦🇺" },
  { code: "49",  name: "Germany",       flag: "🇩🇪" },
  { code: "33",  name: "France",        flag: "🇫🇷" },
  { code: "39",  name: "Italy",         flag: "🇮🇹" },
  { code: "34",  name: "Spain",         flag: "🇪🇸" },
  { code: "55",  name: "Brazil",        flag: "🇧🇷" },
  { code: "81",  name: "Japan",         flag: "🇯🇵" },
  { code: "82",  name: "South Korea",   flag: "🇰🇷" },
  { code: "86",  name: "China",         flag: "🇨🇳" },
  { code: "7",   name: "Russia",        flag: "🇷🇺" },
];

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
