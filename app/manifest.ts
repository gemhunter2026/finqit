import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Finqit.ai",
    short_name: "Finqit",
    description: "Find, secure and manage homes with Finqit.ai.",
    start_url: "/",
    display: "standalone",
    background_color: "#f8fbff",
    theme_color: "#3d9cff",
    icons: [
      {
        src: "/finqit-mark.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any"
      },
      {
        src: "/finqit-mark.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "maskable"
      }
    ]
  };
}
