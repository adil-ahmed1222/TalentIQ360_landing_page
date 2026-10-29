const FALLBACK_SITE_URL = "https://talent-iq-360-landing-page.vercel.app";

export function publicSiteUrl() {
  const configured = import.meta.env.VITE_SITE_URL?.trim();
  return (configured || FALLBACK_SITE_URL).replace(/\/$/, "");
}
