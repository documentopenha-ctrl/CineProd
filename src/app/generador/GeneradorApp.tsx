"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { useVideoPrompt } from "@/generation/stores/prompt";
import { HANDOFF_PROMPT_KEY } from "@/lib/handoff";
import { OpenHiggsfieldApp } from "@/openhiggsfield/openhiggsfield-app";

export default function GeneradorApp({ fontClassName }: { fontClassName: string }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const handoff = window.localStorage.getItem(HANDOFF_PROMPT_KEY);
      if (handoff) {
        useVideoPrompt.getState().setText(handoff);
        window.localStorage.removeItem(HANDOFF_PROMPT_KEY);
      }
    } finally {
      setReady(true);
    }
  }, []);

  if (!ready) return null;

  return (
    <>
      <Link
        href="/"
        className="fixed top-3 left-3 z-[1000] rounded-full bg-black/60 px-3 py-1.5 text-xs font-medium text-white backdrop-blur hover:bg-black/80"
      >
        ← Mentor
      </Link>
      <OpenHiggsfieldApp fontClassName={fontClassName} />
    </>
  );
}
