import { writeFile } from "node:fs/promises";

const fallback = "https://talent-iq-360-landing-page.vercel.app";
const raw = (process.env.VITE_SITE_URL || process.env.SITE_URL || fallback).trim();
let origin = fallback;
try {
  const url = new URL(raw);
  if (url.protocol === "https:" || url.protocol === "http:") origin = url.origin;
} catch {
  origin = fallback;
}

const pages = ["/", "/auth"];
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map((path) => `  <url><loc>${origin}${path}</loc></url>`).join("\n")}
</urlset>
`;

const robots = `User-agent: *
Allow: /

Sitemap: ${origin}/sitemap.xml
`;

const root = new URL("../public/", import.meta.url);
await writeFile(new URL("sitemap.xml", root), sitemap);
await writeFile(new URL("robots.txt", root), robots);
