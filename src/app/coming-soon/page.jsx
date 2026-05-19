"use client";
import { useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import Cursor from "@/components/Cursor";

const Dither = dynamic(() => import("@/components/Dither"), { ssr: false });

export default function ComingSoonPage() {
  const router = useRouter();
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [emailStatus, setEmailStatus] = useState("idle");
  const [passStatus, setPassStatus]   = useState("idle");

  const handleEmail = async (e) => {
    e.preventDefault();
    setEmailStatus("sending");
    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: "Newsletter", email, message: "Signed up for launch notification." }),
      });
      setEmailStatus(res.ok ? "sent" : "error");
    } catch {
      setEmailStatus("error");
    }
  };

  const handlePassword = async (e) => {
    e.preventDefault();
    setPassStatus("checking");
    try {
      const res = await fetch("/api/settings/bypass", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        router.push("/");
        router.refresh();
      } else {
        setPassStatus("wrong");
        setTimeout(() => setPassStatus("idle"), 2500);
      }
    } catch {
      setPassStatus("wrong");
      setTimeout(() => setPassStatus("idle"), 2500);
    }
  };

  return (
    <div className="relative w-full min-h-screen overflow-hidden bg-[#080808]">

      {/* Custom cursor */}
      <Cursor />

      {/* Dither background */}
      <div className="absolute inset-0 z-0">
        <Dither
          waveColor={[1, 0.42, 0.1]}
          waveSpeed={0.04}
          waveFrequency={2.5}
          waveAmplitude={0.35}
          colorNum={5}
          pixelSize={3}
          enableMouseInteraction={true}
          mouseRadius={0.35}
        />
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 z-[1] bg-gradient-to-t from-[#080808]/95 via-[#080808]/55 to-[#080808]/25" />

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-5 py-16 text-center">

        {/* Name label */}
        <p className="text-[9px] md:text-[10px] text-[#ff6b1a] tracking-[0.6em] uppercase font-bold mb-6 md:mb-10">
          Sarang
        </p>

        {/* Heading */}
        <h1
          className="font-black tracking-tighter text-white leading-[0.88] mb-4 md:mb-6"
          style={{ fontSize: "clamp(3rem, 14vw, 9rem)" }}
        >
          Coming
          <br />
          <span className="ghost-orange">Soon.</span>
        </h1>

        {/* Subtext */}
        <p className="text-white/35 text-xs md:text-sm font-light max-w-xs md:max-w-sm mb-8 md:mb-12 leading-relaxed">
          Something cinematic is being built.
          <br />
          Leave your email to be the first to know.
        </p>

        {/* Email form */}
        {emailStatus === "sent" ? (
          <p className="text-[#ff6b1a] text-xs md:text-sm uppercase tracking-widest font-bold mb-8 md:mb-12">
            You're on the list — see you soon.
          </p>
        ) : (
          <form
            onSubmit={handleEmail}
            className="flex flex-col sm:flex-row gap-2 sm:gap-0 w-full max-w-sm md:max-w-md mb-8 md:mb-12"
          >
            <input
              type="email"
              required
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 bg-white/8 border border-white/15 sm:border-r-0 rounded-full sm:rounded-r-none sm:rounded-l-full px-5 py-3 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-[#ff6b1a]/50 transition-colors"
            />
            <button
              type="submit"
              disabled={emailStatus === "sending"}
              className="bg-[#ff6b1a] text-black font-bold px-6 py-3 rounded-full sm:rounded-l-none sm:rounded-r-full text-[10px] uppercase tracking-widest hover:bg-[#ff8c42] transition-colors disabled:opacity-60 whitespace-nowrap"
            >
              {emailStatus === "sending" ? "…" : "Notify Me"}
            </button>
          </form>
        )}

        {/* Divider */}
        <div className="w-px h-7 md:h-10 bg-white/15 mb-7 md:mb-10" />

        {/* Password bypass */}
        <form
          onSubmit={handlePassword}
          className="flex gap-0 w-full max-w-[260px] sm:max-w-xs"
        >
          <input
            type="password"
            placeholder="Access password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`flex-1 min-w-0 bg-white/5 border border-r-0 rounded-l-full px-4 py-2.5 text-xs text-white/60 placeholder:text-white/20 focus:outline-none transition-colors ${
              passStatus === "wrong"
                ? "border-red-500/40"
                : "border-white/10 focus:border-white/25"
            }`}
          />
          <button
            type="submit"
            disabled={passStatus === "checking"}
            className="shrink-0 bg-white/5 border border-white/10 text-white/40 hover:text-white hover:bg-white/10 font-medium px-4 py-2.5 rounded-r-full text-[9px] uppercase tracking-widest transition-all whitespace-nowrap"
          >
            {passStatus === "checking" ? "…" : passStatus === "wrong" ? "Wrong" : "Enter"}
          </button>
        </form>

      </div>
    </div>
  );
}
