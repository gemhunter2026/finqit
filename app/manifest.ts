import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Finqit.ai",
    short_name: "Finqit",
    description: "Find, reserve and manage homes with Finqit.ai.",
    start_url: "/",
    display: "standalone",
    background_color: "#f8fbff",
    theme_color: "#4aa8ff",
    icons: []
  };
}
