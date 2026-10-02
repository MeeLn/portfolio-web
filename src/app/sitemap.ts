import type { MetadataRoute } from "next";
import { projects } from "@/data/projects";
export default function sitemap(): MetadataRoute.Sitemap {
  const site = process.env.NEXT_PUBLIC_SITE_URL;
  if (!site) return [];
  const base = site.replace(/\/$/, "");
  return [
    { url: base, lastModified: new Date() },
    ...projects.map(({ slug }) => ({
      url: `${base}/projects/${slug}`,
      lastModified: new Date(),
    })),
  ];
}
