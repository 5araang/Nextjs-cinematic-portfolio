<div align="center">

# 🎬 Sarang — Premium Open-Source Cinematic Developer Portfolio

### A 100% free, open-source Next.js developer portfolio engineered with cinematic scroll-driven video, GSAP micro-animations, and a unified administrative CMS dashboard.

**Built with Next.js 16 (App Router) · React 19 · GSAP 3 · Tailwind CSS 4 · Supabase · Resend**

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-sarang--space.site-ff6b1a?style=for-the-badge)](https://sarang-space.site)
[![License: MIT](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![Deploy with Vercel](https://img.shields.io/badge/Deploy_with-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/new/clone?repository-url=https://github.com/Saarangggg/nextjs-cinematic-portfolio)

</div>

---

## ✨ Why Sarang?

Sarang is not another standard grid portfolio. It is designed to be an immersive digital signature for developers, designers, and video editors:

*   **🎥 Scroll-Driven Video Scrubbing:** Frame-accurate video playback tied directly to user scrolling speeds.
*   **✨ Buttery Smooth GSAP Animations:** Fully responsive scroll-triggered layouts and magnetic interaction effects rendering at 120fps.
*   **📱 Unified & Collapsible Admin Dashboard:** Persists a collapsed icon-only sidebar on desktop (`localStorage`) and slides open a blur overlay drawer on mobile.
*   **📊 Native Dashboard Analytics:** Keep track of total visitors, link click counts, page loads, and active user analytics without third-party scripts.
*   **💬 Interactive Blog & CMS:** Fully featured markdown blog post manager with admin-repliable threaded user comments.
*   **✉️ Seamless Contact Routing:** Custom contact form utilizing Resend for immediate email notification updates.
*   **🔐 Launch Protection:** An optional Coming Soon splash screen with password bypass validation logic.

---

## 🛠️ Step-by-Step Installation

The technical installation details, database schema setup, and configuration guidelines have been split into a dedicated document. 

### 👉 **[Read the INSTALL.md Setup Guide](INSTALL.md)**

*   🔧 **[Local Development Setup](INSTALL.md#-local-installation)** (Cloning, dependencies, commands)
*   🗄️ **[Database Table Script](INSTALL.md#-database-setup-supabase)** (Supabase SQL copy/paste code)
*   ⚙️ **[Environment Variables Config](INSTALL.md#-environment-variables-envlocal)** (Detailed parameter list)
*   🌍 **[Production Deployment Instructions](INSTALL.md#-production-deployments)** (Vercel deployment)

---

## 🎨 Content & Theme Customization

You can fully customize the portfolio theme, text contents, and color accents in a few quick steps:

### 1. Changing the Accent Theme Color
The primary theme accent color throughout the portfolio is orange (`#ff6b1a`). You can alter this globally in one place:
*   Open [src/app/globals.css](file:///c:/Users/Asus/Downloads/sarang/src/app/globals.css) and edit the `--orange` CSS variable:
    ```css
    :root {
      --orange: #ff6b1a; /* Swap this hex code with your chosen accent color */
    }
    ```
*   Search for instances of `#ff6b1a` or `text-[#ff6b1a]` inside individual component files to customize theme tags.

### 2. Modifying Content & Copy Files
To change bio, timelines, and form fields without touching Next.js components:
*   **Biography & Timeline:** Edit [src/app/about/content.js](file:///c:/Users/Asus/Downloads/sarang/src/app/about/content.js) to configure bio copy, skill chips, and timeline items.
*   **Offline Projects:** Edit [src/app/work/content.js](file:///c:/Users/Asus/Downloads/sarang/src/app/work/content.js) to alter static fallback items when the database is offline.
*   **Contact Info:** Edit [src/app/contact/content.js](file:///c:/Users/Asus/Downloads/sarang/src/app/contact/content.js) to manage the inquiries list and social handles.

---

## 🤖 SEO & AI Agent Compatibility

This portfolio implements A++++++ SEO schemas and metadata to ensure maximum crawlability:

*   **AI Chatbot Friendly (`/llms.txt`):** Includes a machine-readable summary file at `/llms.txt` designed to feed LLM agents (Gemini, Claude, ChatGPT) instant details about your bio and projects.
*   **Open Graph & JSON-LD:** Structured search schemas (Person, SoftwareSourceCode) are automatically injected into the head of your pages.
*   **Dynamic XML Sitemaps:** Sitemaps (`/sitemap.xml`) are re-generated on builds to index new portfolio pieces and articles.

---

## 📄 MIT License

This portfolio template is **100% Free and Open-Source** under the **MIT License**. You can customize, distribute, and commercially deploy this repository without restriction.

---

<div align="center">

**[Live Demo](https://sarang-space.site)** · **[Setup Guide](INSTALL.md)** · **[Report Bug](https://github.com/Saarangggg/nextjs-cinematic-portfolio/issues)**

</div>
