"use client";

import { useState } from "react";

export default function CopyLinkButton({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);

  async function handleClick() {
    try {
      const full = url.startsWith("http") ? url : `${window.location.origin}${url}`;
      await navigator.clipboard.writeText(full);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API may be unavailable; fail silently, user can still
      // select the URL from a share page manually.
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className="text-sm text-emerald-700 hover:underline touch-manipulation"
    >
      {copied ? "Copied!" : "Copy branded link"}
    </button>
  );
}
