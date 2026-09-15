import type { Metadata } from "next";
import { MyFinqitDashboard } from "@/components/MyFinqitDashboard";

export const metadata: Metadata = { title: "My Finqit" };

export default function MyFinqitPage() {
  return <div className="page-top mkt-shell"><MyFinqitDashboard/></div>;
}
