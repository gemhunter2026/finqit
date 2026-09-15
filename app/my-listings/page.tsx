import type { Metadata } from "next";
import { SellerListingsClient } from "@/components/SellerListingsClient";

export const metadata: Metadata = { title: "My Listings" };

export default function MyListingsPage() {
  return <div className="page-top mkt-shell"><SellerListingsClient/></div>;
}
