"use client";

import React from "react";
import Link from "next/link";

export default function TrackedLink({ href, label, children, className, target, rel, isExternal = false }) {
  const handleClick = () => {
    try {
      fetch("/api/analytics/click", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          label: label || "Unknown Link",
          url: href,
          page: window.location.pathname
        }),
      });
    } catch (e) {
      // Ignore errors so navigation isn't blocked
    }
  };

  if (isExternal) {
    return (
      <a
        href={href}
        className={className}
        target={target}
        rel={rel}
        onClick={handleClick}
      >
        {children}
      </a>
    );
  }

  return (
    <Link
      href={href}
      className={className}
      target={target}
      rel={rel}
      onClick={handleClick}
    >
      {children}
    </Link>
  );
}
