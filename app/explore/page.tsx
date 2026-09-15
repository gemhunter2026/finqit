import type { Metadata } from "next";
import { ExploreClient } from "@/components/ExploreClient";

export const metadata: Metadata = { title: "Explore homes" };

export default function ExplorePage() {
  return <div className="page-top"><ExploreClient /></div>;
}
