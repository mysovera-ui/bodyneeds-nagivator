"use client";

export default function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="text-sm text-neutral-600 border border-neutral-300 rounded-lg px-3 py-1.5 hover:bg-neutral-100 touch-manipulation"
    >
      Print / Save as PDF
    </button>
  );
}
