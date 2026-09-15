import type { Metadata, Viewport } from "next";
import "./globals.css";
import "./marketplace.css";
import { Header } from "@/components/Header";
import { MobileNav } from "@/components/MobileNav";

export const metadata: Metadata = {
  metadataBase: new URL("https://finqit.ai"),
  title: {
    default: "Finqit.ai — Find it before it’s gone",
    template: "%s | Finqit.ai"
  },
  description: "A smarter way to find, reserve and manage homes. Instant apartment reservations, smart buying agents and AI-powered communities.",
  applicationName: "Finqit.ai",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Finqit"
  },
  formatDetection: { telephone: false },
  openGraph: {
    title: "Finqit.ai — Find it before it’s gone",
    description: "Instant apartment reservations, smart buying agents and AI-powered communities.",
    type: "website",
    siteName: "Finqit.ai"
  },
  twitter: {
    card: "summary_large_image",
    title: "Finqit.ai — Find it before it’s gone",
    description: "A smarter way to find, reserve and manage homes."
  }
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#ffffff",
  viewportFit: "cover"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <Header />
        <main>{children}</main>
        <MobileNav />
      </body>
    </html>
  );
}
