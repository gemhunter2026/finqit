import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Finqit.ai",
    short_name: "Finqit",
    description: "Find, secure and manage homes with Finqit.ai.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#1E5BFF",
    icons: [
      {
        src: "/finqit-app-icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any"
      },
      {
        src: "/finqit-app-icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "maskable"
      }
    ]
  };
}
