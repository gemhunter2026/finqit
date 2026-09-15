"use client";

import { useEffect, useState } from "react";
import { HeartIcon } from "@/components/icons";
import { FINQIT_STATE_EVENT, getSavedHomes, toggleSavedHome } from "@/lib/demo-state";

export function SaveHomeButton({ slug, compact = false }: { slug: string; compact?: boolean }) {
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const sync = () => setSaved(getSavedHomes().includes(slug));
    sync();
    window.addEventListener(FINQIT_STATE_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(FINQIT_STATE_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, [slug]);

  const toggle = () => {
    const next = toggleSavedHome(slug);
    setSaved(next.includes(slug));
  };

  return <button type="button" className={compact ? `save-button ${saved ? "saved" : ""}` : `gallery-save ${saved ? "saved" : ""}`} onClick={toggle} aria-pressed={saved}>
    <HeartIcon size={20} fill={saved ? "currentColor" : "none"}/>{compact ? null : <span>{saved ? "Saved" : "Save"}</span>}
  </button>;
}
