"use client";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SECTION, COUNTRIES as COUNTRY_LIST } from "@/app/contact/content";

gsap.registerPlugin(ScrollTrigger);

const boxInput =
  "contact-field w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-[#ff6b1a]/60 transition-colors duration-300 text-sm";

export default function Contact({ standalone = false }) {
  const ref = useRef(null);
  const [form, setForm] = useState({ name: '', contact: '', reason: '' });
  const [contactType, setContactType] = useState('email'); // 'email' | 'phone'
  const [selectedCC, setSelectedCC] = useState(COUNTRY_LIST[0]); // default India
  const [showCCPicker, setShowCCPicker] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [status, setStatus] = useState('idle');

  // Determine if the contact field looks like an email or a phone
  const handleContactChange = (e) => {
    const val = e.target.value;
    setForm({ ...form, contact: val });
    // If it has @ it's email, else treat as email too unless user picks phone tab
    setContactType((val.includes('@') || !val) ? 'email' : 'email');
  };

  const handlePhoneChange = (e) => {
    const val = e.target.value.replace(/\D/g, ''); // digits only
    setPhoneNumber(val);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (contactType === 'phone') {
      const fullNumber = selectedCC.code + phoneNumber;
      const myNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '919999999999';
      const msg = encodeURIComponent(
        `Hi Sarang! My name is ${form.name}.\n\nReason: ${form.reason}\n\nMy number: +${fullNumber}`
      );
      window.open(`https://wa.me/${myNumber}?text=${msg}`, '_blank');
      return;
    }

    setStatus('sending');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.name, email: form.contact, message: form.reason }),
      });
      setStatus(res.ok ? 'sent' : 'error');
      if (res.ok) { setForm({ name: '', contact: '', reason: '' }); setPhoneNumber(''); }
    } catch {
      setStatus('error');
    }
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (standalone) {
        gsap.from(".contact-label", { y: 25, opacity: 0, duration: 0.5, delay: 0.4 });
        gsap.from(".contact-h",     { y: 70, opacity: 0, duration: 0.9, ease: "power4.out", delay: 0.6 });
        gsap.from(".contact-field", { y: 35, opacity: 0, stagger: 0.12, duration: 0.65, delay: 0.8 });
        gsap.from(".contact-btn",   { y: 20, opacity: 0, duration: 0.5, delay: 1.2 });
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

      tl.from(".contact-label", { y: 14, opacity: 0, duration: 0.3, ease: "power3.out" })
        .from(".contact-h",     { y: 35, opacity: 0, duration: 0.4, ease: "power4.out" }, 0.05)
        .from(".contact-divider", { scaleY: 0, opacity: 0, duration: 0.5, ease: "power3.out" }, 0.1)
        .from(".contact-field", { y: 25, opacity: 0, stagger: 0.08, duration: 0.35, ease: "power3.out" }, 0.18)
        .from(".contact-btn",   { y: 15, opacity: 0, duration: 0.3, ease: "power2.out" }, 0.45);

      setTimeout(() => ScrollTrigger.refresh(), 300);
    }, ref);
    return () => ctx.revert();
  }, [standalone]);

  return (
    <section
      id="contact-section"
      ref={ref}
      className="relative min-h-screen flex flex-col justify-center px-10 md:px-20 pt-24 md:pt-20 pb-24"
    >
      <p className="contact-label text-[10px] text-[#ff6b1a] tracking-[0.5em] uppercase mb-12 font-medium">
        {SECTION.label}
      </p>

      <div className="flex flex-col md:flex-row items-stretch gap-0 w-full max-w-7xl min-h-[65vh]">

        {/* LEFT — Form */}
        <div className="w-full md:w-[42%] pr-0 md:pr-12">
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-5"
            aria-label="Contact form"
          >
            {/* Name */}
            <div className="flex flex-col gap-1.5">
              <span className="text-[10px] text-white/30 tracking-[0.3em] uppercase">Name</span>
              <input
                suppressHydrationWarning
                className={boxInput}
                type="text"
                placeholder="Your full name"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>

            {/* Toggle: Email or Phone */}
            <div className="flex gap-2">
              <button
                suppressHydrationWarning
                type="button"
                onClick={() => setContactType('email')}
                className={`flex-1 py-2 rounded-lg text-[10px] tracking-[0.2em] uppercase font-medium transition-all duration-200 ${
                  contactType === 'email'
                    ? 'bg-[#ff6b1a] text-black'
                    : 'bg-white/5 text-white/30 hover:bg-white/10'
                }`}
              >
                Email
              </button>
              <button
                suppressHydrationWarning
                type="button"
                onClick={() => setContactType('phone')}
                className={`flex-1 py-2 rounded-lg text-[10px] tracking-[0.2em] uppercase font-medium transition-all duration-200 ${
                  contactType === 'phone'
                    ? 'bg-[#25D366] text-black'
                    : 'bg-white/5 text-white/30 hover:bg-white/10'
                }`}
              >
                WhatsApp
              </button>
            </div>

            {/* Email Field */}
            {contactType === 'email' && (
              <div className="flex flex-col gap-1.5">
                <span className="text-[10px] text-white/30 tracking-[0.3em] uppercase">Email</span>
                <input
                  suppressHydrationWarning
                  className={boxInput}
                  type="email"
                  placeholder="email@example.com"
                  required
                  value={form.contact}
                  onChange={handleContactChange}
                />
              </div>
            )}

            {/* Phone Field with Country Code Picker */}
            {contactType === 'phone' && (
              <div className="flex flex-col gap-1.5">
                <span className="text-[10px] text-[#25D366]/60 tracking-[0.3em] uppercase">Phone (WhatsApp)</span>
                <div className="flex gap-2">
                  {/* Country code picker */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setShowCCPicker(!showCCPicker)}
                      className="flex items-center gap-1.5 h-full bg-white/5 border border-white/10 rounded-xl px-3 py-3 text-sm text-white hover:border-[#25D366]/40 transition-colors duration-200 whitespace-nowrap"
                    >
                      <span>{selectedCC.flag}</span>
                      <span className="text-white/60">+{selectedCC.code}</span>
                      <span className="text-white/30 text-xs">›</span>
                    </button>
                    {showCCPicker && (
                      <div className="absolute z-50 top-full left-0 mt-1 w-56 bg-[#111] border border-white/10 rounded-xl overflow-y-auto max-h-56 shadow-2xl custom-scroll">
                        {COUNTRY_LIST.map((c) => (
                          <button
                            key={c.code + c.name}
                            type="button"
                            onClick={() => { setSelectedCC(c); setShowCCPicker(false); }}
                            className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-sm hover:bg-white/5 transition-colors text-left ${
                              selectedCC.code === c.code && selectedCC.name === c.name ? 'text-[#25D366]' : 'text-white/70'
                            }`}
                          >
                            <span>{c.flag}</span>
                            <span className="flex-1">{c.name}</span>
                            <span className="text-white/30 text-xs">+{c.code}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  {/* Phone number input */}
                  <input
                    suppressHydrationWarning
                    className={boxInput}
                    type="tel"
                    placeholder="98765 43210"
                    required={contactType === 'phone'}
                    value={phoneNumber}
                    onChange={handlePhoneChange}
                  />
                </div>
              </div>
            )}

            {/* Reason */}
            <div className="flex flex-col gap-1.5">
              <span className="text-[10px] text-white/30 tracking-[0.3em] uppercase">Reason</span>
              <textarea
                suppressHydrationWarning
                className={boxInput + " resize-none"}
                rows={4}
                placeholder="Tell me what you're working on…"
                required
                value={form.reason}
                onChange={(e) => setForm({ ...form, reason: e.target.value })}
              />
            </div>

            {status === 'error' && (
              <p className="text-red-400 text-sm">Something went wrong. Please try again.</p>
            )}

            {status === 'sent' ? (
              <p className="contact-btn text-[#ff6b1a] text-sm uppercase tracking-widest font-bold">
                Message sent — I'll be in touch!
              </p>
            ) : (
              <button
                suppressHydrationWarning
                type="submit"
                disabled={status === 'sending'}
                className={`contact-btn w-full font-bold py-4 rounded-full text-sm uppercase tracking-widest transition-colors duration-300 disabled:opacity-60 disabled:cursor-not-allowed ${
                  contactType === 'phone'
                    ? 'bg-[#25D366] text-black hover:bg-[#1ebe5d]'
                    : 'bg-[#ff6b1a] text-black hover:bg-[#ff8c42]'
                }`}
              >
                {status === 'sending' ? 'Sending…' : contactType === 'phone' ? 'Open WhatsApp →' : 'Send Message'}
              </button>
            )}
          </form>
        </div>

        {/* DIVIDER */}
        <div className="contact-divider hidden md:block w-px self-stretch bg-white/10 mx-8 origin-top" />

        {/* RIGHT — heading pinned to BOTTOM-RIGHT */}
        <div className="w-full md:w-[58%] pl-0 md:pl-6 mt-16 md:mt-0 flex flex-col justify-end text-right">
          <h2
            className="contact-h font-black tracking-tighter leading-[0.88]"
            style={{ fontSize: "clamp(2.6rem, 5.5vw, 6.5rem)" }}
          >
            <span className="block text-white">Let's build</span>
            <span className="block text-white">something</span>
            <span className="block ghost-orange">cool.</span>
          </h2>
          <p className="contact-label mt-6 text-white/20 text-sm font-light leading-relaxed text-right">
            Got a project in mind?<br />Drop your details and I'll get back to you.
          </p>
        </div>

      </div>
    </section>
  );
}
