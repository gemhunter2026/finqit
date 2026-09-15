import type { Metadata } from "next";
import { SellerListingDetailClient } from "@/components/SellerListingDetailClient";

export const metadata: Metadata = { title: "Seller listing" };

export default async function SellerListingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <div className="page-top mkt-shell"><SellerListingDetailClient id={id}/></div>;
}
