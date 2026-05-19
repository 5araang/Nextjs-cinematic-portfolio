/**
 * SeoContent — Hidden semantic HTML for search engines & AI crawlers.
 * 
 * This component renders keyword-rich, structured text that search engines
 * and AI bots can crawl, even when the visual content is animated/JS-driven.
 * It's visually hidden but fully accessible to screen readers and crawlers.
 */
export default function SeoContent() {
  return (
    <div
      className="sr-only"
      aria-hidden="false"
      itemScope
      itemType="https://schema.org/Person"
    >
      {/* Force rebuild */}
      <h1 itemProp="name">Sarang — Next.js Developer, Shopify Expert, Graphic Designer & Video Editor</h1>
      
      <p itemProp="description">
        Creative developer and designer specializing in Next.js websites, Shopify stores, branding, cinematic video editing, motion graphics, and premium digital experiences. 
        I build modern high-performance websites. I design cinematic digital experiences. Custom Shopify and Next.js development.
        Premium branding and visual storytelling. Fast, SEO optimized responsive websites. Creative developer for fashion and luxury brands. 
        Professional video editing and motion graphics. Modern portfolio and business website solutions.
      </p>

      <p itemProp="jobTitle">Next.js Developer & Shopify Expert</p>

      <section aria-label="Services">
        <h2>Services — Hire Sarang</h2>
        
        <article>
          <h3>Portfolio Design & Website Development</h3>
          <p>
            Looking for a Website Developer in Kerala or a Web Designer in Calicut? Sarang creates cinematic, interactive portfolio 
            websites, landing pages, Shopify e-commerce stores, and full-stack web applications. Technologies include 
            React, Next.js, GSAP, Three.js, WebGL, Tailwind CSS, Node.js, Express, and Supabase.
          </p>
        </article>

        <article>
          <h3>Video Editing & Motion Design</h3>
          <p>
            Need a freelance Video Editor in Kerala? Sarang creates cinematic trailers, social media reels, promotional videos,
            YouTube content, motion graphics, and animated visual effects using After Effects, Premiere Pro, 
            DaVinci Resolve, and CapCut. Over 75 videos edited.
          </p>
        </article>

        <article>
          <h3>Photo Editing & Graphic Design</h3>
          <p>
            Hire a Graphic Designer in India. Sarang provides professional photo retouching, brand identity 
            design, poster design, social media graphics, and creative visual concepts using Photoshop, Lightroom, 
            Figma, and Illustrator. Over 500 photo edits completed.
          </p>
        </article>

        <article>
          <h3>Shopify Development</h3>
          <p>
            Custom Shopify themes with Liquid, e-commerce store setup, and storefront optimization for online businesses. Shopify Developer Kerala.
          </p>
        </article>

        <article>
          <h3>Flutter App Development</h3>
          <p>
            Cross-platform mobile app development for iOS and Android using Flutter and Dart.
          </p>
        </article>
      </section>

      <section aria-label="Portfolio Statistics">
        <h2>Portfolio Statistics</h2>
        <ul>
          <li>6+ websites designed and developed</li>
          <li>75+ videos professionally edited</li>
          <li>500+ photo edits and visual concepts created</li>
          <li>Freelancing since 2020</li>
        </ul>
      </section>

      <section aria-label="Technical Skills">
        <h2>Technical Skills</h2>
        <p itemProp="knowsAbout">
          React, Next.js, JavaScript, TypeScript, HTML5, CSS3, Tailwind CSS, GSAP, Framer Motion, Three.js, WebGL,
          Node.js, Express, Prisma, Flutter, Dart, Shopify Liquid, Python, Java, C++, PHP, Go, Rust, Swift, Kotlin,
          MongoDB, PostgreSQL, MySQL, Redis, Supabase, Postman, Git, Docker, Vercel, Netlify,
          After Effects, Premiere Pro, DaVinci Resolve, CapCut, Photoshop, Lightroom, Figma, Illustrator
        </p>
      </section>

      <section aria-label="About Sarang — Creative Website Developer & Designer">
        <h2>Sarang – Creative Website Developer & Designer</h2>
        <p>
          Sarang is a creative website developer and digital designer from Kerala, India, focused on building modern digital experiences, cinematic visuals, branding systems, Shopify stores, and high-quality poster designs. With a strong passion for creativity and technology, Sarang combines visual storytelling with modern web development to create unique online experiences that feel premium, immersive, and visually powerful.
        </p>
        
        <h3>Skills and Expertise:</h3>
        <ul>
          <li>Website Development</li>
          <li>Frontend Development</li>
          <li>Shopify Development</li>
          <li>Ecommerce Design</li>
          <li>UI/UX Design</li>
          <li>Graphic Design</li>
          <li>Poster Design</li>
          <li>Branding Design</li>
          <li>Motion Graphics</li>
          <li>Video Editing</li>
          <li>Cinematic Visual Design</li>
          <li>Digital Storytelling</li>
          <li>Responsive Web Design</li>
          <li>Modern Landing Pages</li>
          <li>Creative Direction</li>
          <li>Social Media Design</li>
          <li>Luxury Brand Visuals</li>
          <li>Portfolio Website Design</li>
          <li>Modern Typography</li>
          <li>Creative Development</li>
        </ul>
        
        <p>
          Sarang continues to develop modern digital experiences focused on creativity, performance, storytelling, and visual identity. His goal is to create meaningful digital work that combines design, technology, and emotional impact into a single creative experience.
        </p>
      </section>

      <section aria-label="Contact">
        <h2>Hire Sarang — Contact Information</h2>
        <p>
          <span itemProp="url">https://sarang-space.site</span> |
          <span itemProp="email">sarangwalle[at]gmail.com</span> |
          Available for freelance projects worldwide
        </p>
      </section>
    </div>
  );
}
