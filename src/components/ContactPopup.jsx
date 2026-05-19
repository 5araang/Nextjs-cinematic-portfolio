"use client";

import { useEffect, useState } from "react";
import { FiX, FiMail, FiArrowLeft, FiSend, FiCheck } from "react-icons/fi";
import { IoLogoWhatsapp } from "react-icons/io";
import { useGeoDialCode } from "@/hooks/useGeoDialCode";
import { COUNTRIES } from "@/app/contact/content";

// step: "choose" | "email" | "whatsapp"
export default function ContactPopup({ isOpen, onClose }) {
  const [step, setStep]       = useState("choose");
  const [name, setName]       = useState("");
  const [phone, setPhone]     = useState("");
  const [reason, setReason]   = useState("");
  const [status, setStatus]   = useState("idle"); // idle | sending | sent | error
  const [selectedCC, setSelectedCC] = useState(COUNTRIES[0]);
  const geoCode = useGeoDialCode();
  useEffect(() => { if (geoCode) setSelectedCC(geoCode); }, [geoCode]);

  // Reset on open
  useEffect(() => {
    if (isOpen) {
      setStep("choose"); setName(""); setPhone(""); setReason(""); setStatus("idle");
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleEmail = async (e) => {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email: "", message: reason }),
      });
      setStatus(res.ok ? "sent" : "error");
    } catch { setStatus("error"); }
  };

  const handleWhatsApp = (e) => {
    e.preventDefault();
    const num = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "919999999999";
    const fullPhone = phone ? `+${selectedCC.code} ${phone}` : "(not provided)";
    const msg = encodeURIComponent(
      `Hi! My name is ${name}.\n\nMy number: ${fullPhone}\n\nReason: ${reason}`
    );
    window.open(`https://wa.me/${num}?text=${msg}`, "_blank");
    onClose();
  };

  const inputCls = "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-[#ff6b1a]/50 transition-colors duration-200 text-sm";

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-[#0a0a0a] border border-white/10 rounded-3xl p-7 md:p-10 max-w-md w-full shadow-2xl">

        {/* Close */}
        <button onClick={onClose} className="absolute top-5 right-5 text-white/30 hover:text-white transition-colors">
          <FiX size={20} />
        </button>

        {/* Back */}
        {step !== "choose" && (
          <button
            onClick={() => { setStep("choose"); setStatus("idle"); }}
            className="absolute top-5 left-5 text-white/30 hover:text-white transition-colors flex items-center gap-1.5 text-[11px] uppercase tracking-widest"
          >
            <FiArrowLeft size={13} /> Back
          </button>
        )}

        {/* ── STEP 1: Choose ── */}
        {step === "choose" && (
          <>
            <h3 className="text-2xl md:text-3xl font-black text-white tracking-tighter mb-2 mt-1">Let's Talk.</h3>
            <p className="text-white/35 text-sm mb-7 leading-relaxed">
              How would you like to reach out?
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => setStep("email")}
                className="flex items-center gap-4 bg-[#ff6b1a]/8 hover:bg-[#ff6b1a]/15 border border-[#ff6b1a]/20 p-4 rounded-2xl transition-all group text-left"
              >
                <div className="w-11 h-11 rounded-full bg-[#ff6b1a]/15 text-[#ff6b1a] flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
                  <FiMail size={18} />
                </div>
                <div>
                  <p className="text-white font-bold text-sm">Email</p>
                  <p className="text-white/35 text-xs mt-0.5">Send a message to my inbox</p>
                </div>
              </button>

              <button
                onClick={() => setStep("whatsapp")}
                className="flex items-center gap-4 bg-[#25D366]/8 hover:bg-[#25D366]/15 border border-[#25D366]/20 p-4 rounded-2xl transition-all group text-left"
              >
                <div className="w-11 h-11 rounded-full bg-[#25D366]/15 text-[#25D366] flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
                  <IoLogoWhatsapp size={20} />
                </div>
                <div>
                  <p className="text-white font-bold text-sm">WhatsApp</p>
                  <p className="text-white/35 text-xs mt-0.5">Chat directly on WhatsApp</p>
                </div>
              </button>
            </div>
          </>
        )}

        {/* ── STEP 2a: Email ── */}
        {step === "email" && (
          <>
            <div className="flex items-center gap-3 mb-6 mt-6">
              <div className="w-9 h-9 rounded-full bg-[#ff6b1a]/15 text-[#ff6b1a] flex items-center justify-center shrink-0">
                <FiMail size={15} />
              </div>
              <div>
                <h3 className="text-white font-black tracking-tight text-lg">Email Me</h3>
                <p className="text-white/30 text-xs">I'll reply within 24 hours</p>
              </div>
            </div>

            {status === "sent" ? (
              <div className="flex flex-col items-center gap-3 py-8 text-center">
                <div className="w-14 h-14 rounded-full bg-[#ff6b1a]/15 flex items-center justify-center">
                  <FiCheck size={24} className="text-[#ff6b1a]" />
                </div>
                <p className="text-white font-bold">Message sent!</p>
                <p className="text-white/35 text-sm">I'll get back to you soon.</p>
              </div>
            ) : (
              <form onSubmit={handleEmail} className="flex flex-col gap-3">
                <input suppressHydrationWarning className={inputCls} placeholder="Your name" required value={name} onChange={e => setName(e.target.value)} />
                <textarea suppressHydrationWarning className={inputCls + " resize-none"} rows={4} placeholder="What's the project about?" required value={reason} onChange={e => setReason(e.target.value)} />
                {status === "error" && <p className="text-red-400 text-xs">Something went wrong. Try again.</p>}
                <button
                  suppressHydrationWarning
                  type="submit"
                  disabled={status === "sending"}
                  className="w-full py-3.5 bg-[#ff6b1a] text-black font-bold rounded-xl text-sm uppercase tracking-widest hover:bg-white transition-colors duration-300 disabled:opacity-50 flex items-center justify-center gap-2 mt-1"
                >
                  <FiSend size={14} />
                  {status === "sending" ? "Sending…" : "Send Message"}
                </button>
              </form>
            )}
          </>
        )}

        {/* ── STEP 2b: WhatsApp ── */}
        {step === "whatsapp" && (
          <>
            <div className="flex items-center gap-3 mb-6 mt-6">
              <div className="w-9 h-9 rounded-full bg-[#25D366]/15 text-[#25D366] flex items-center justify-center shrink-0">
                <IoLogoWhatsapp size={18} />
              </div>
              <div>
                <h3 className="text-white font-black tracking-tight text-lg">WhatsApp</h3>
                <p className="text-white/30 text-xs">Opens WhatsApp with your message</p>
              </div>
            </div>

            <form onSubmit={handleWhatsApp} className="flex flex-col gap-3">
              <input suppressHydrationWarning className={inputCls} placeholder="Your name" required value={name} onChange={e => setName(e.target.value)} />
              <div className="flex gap-2 items-center">
                <button
                  type="button"
                  onClick={() => {
                    const next = COUNTRIES[(COUNTRIES.indexOf(selectedCC) + 1) % COUNTRIES.length];
                    setSelectedCC(next);
                  }}
                  className="shrink-0 flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-xl px-3 py-3 text-sm text-white/60 hover:text-white hover:bg-white/10 transition-colors"
                  title="Change country code"
                >
                  <span>{selectedCC.flag}</span>
                  <span className="text-white/40 text-xs">+{selectedCC.code}</span>
                </button>
                <input
                  suppressHydrationWarning
                  className={inputCls}
                  placeholder="Your number"
                  value={phone}
                  onChange={e => setPhone(e.target.value.replace(/\D/g, ""))}
                  type="tel"
                />
              </div>
              <textarea suppressHydrationWarning className={inputCls + " resize-none"} rows={3} placeholder="What's the project about?" required value={reason} onChange={e => setReason(e.target.value)} />
              <button
                suppressHydrationWarning
                type="submit"
                className="w-full py-3.5 bg-[#25D366] text-black font-bold rounded-xl text-sm uppercase tracking-widest hover:bg-white transition-colors duration-300 flex items-center justify-center gap-2 mt-1"
              >
                <IoLogoWhatsapp size={16} />
                Open WhatsApp
              </button>
            </form>
          </>
        )}

      </div>
    </div>
  );
}
