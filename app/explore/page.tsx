import type { Metadata } from "next";
import { Suspense } from "react";
import { ExploreClient } from "@/components/ExploreClient";

export const metadata: Metadata = { title: "Explore homes" };

function ExploreFallback() {
  return <div className="mkt-shell" style={{padding:"80px 0"}}><div className="empty-state"><h3>Loading marketplace…</h3><p>Preparing your filters and current search.</p></div></div>;
}

export default function ExplorePage() {
  return <div className="page-top"><Suspense fallback={<ExploreFallback/>}><ExploreClient /></Suspense></div>;
}
