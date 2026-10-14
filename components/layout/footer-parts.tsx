"use client";

import { useState, useSyncExternalStore } from "react";
import { Check, Copy } from "lucide-react";

// The two interactive bits of the footer, split out so SiteFooter itself can
// stay a server component.

/** Copies the address and says so for a moment. */
export function CopyEmailButton({
  email,
  label,
  doneLabel,
}: {
  email: string;
  label: string;
  doneLabel: string;
}) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard can be refused (permissions, insecure origin); the address
      // is still right there as a mailto link.
    }
  };

  return (
    <button
      type="button"
      onClick={copy}
      aria-live="polite"
      className="inline-flex items-center gap-2 rounded-full border border-white/40 px-4 py-2 font-mono text-[12px] tracking-[0.04em] uppercase transition-colors hover:bg-white hover:text-accent"
    >
      {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
      {copied ? doneLabel : label}
    </button>
  );
}

const TIME_ZONE = "Asia/Taipei";

const subscribeToMinute = (onChange: () => void) => {
  const id = window.setInterval(onChange, 15_000);
  return () => window.clearInterval(id);
};

const taipeiTime = () =>
  new Intl.DateTimeFormat("en-GB", {
    timeZone: TIME_ZONE,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date());

/**
 * The time in Taipei right now, ticking. The server renders a placeholder:
 * a prerendered page would otherwise show whatever time it was built at.
 */
export function TaipeiClock() {
  const time = useSyncExternalStore(subscribeToMinute, taipeiTime, () => null);
  return (
    <span className="tabular-nums">
      {time ?? "--:--"} <span className="opacity-60">GMT+8</span>
    </span>
  );
}
