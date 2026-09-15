import type { Metadata } from "next";
import { SavedHomesClient } from "@/components/SavedHomesClient";

export const metadata: Metadata = { title: "Saved homes" };

export default function SavedHomesPage() {
  return <div className="page-top mkt-shell"><SavedHomesClient/></div>;
}
