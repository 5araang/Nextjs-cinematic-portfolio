"use client";
import { useEffect, useState } from "react";
import { COUNTRIES } from "@/app/contact/content";

// Silently detects country dial code from IP — no prompt shown to user.
export function useGeoDialCode() {
  const [dialCode, setDialCode] = useState(null);

  useEffect(() => {
    fetch("https://ipapi.co/json/", { cache: "force-cache" })
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (!data?.country_calling_code) return;
        const code = data.country_calling_code.replace("+", "");
        const match = COUNTRIES.find(c => c.code === code);
        if (match) setDialCode(match);
      })
      .catch(() => {});
  }, []);

  return dialCode;
}
