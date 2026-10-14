import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";
// A preview deployokon a Vercel visszajelző eszköztára (vercel.live) is betöltődik.
const vercelLive = process.env.VERCEL_ENV === "preview" ? " https://vercel.live" : "";

/**
 * Nonce nélküli CSP: az oldal statikus marad (a nonce dinamikus renderelést kényszerítene),
 * ezért a Next.js inline szkriptjei miatt kell a 'unsafe-inline'. A betűk a next/font miatt helyiek,
 * külső keretként csak a Google Maps beágyazás tölthető be.
 */
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}${vercelLive}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' blob: data:",
  "media-src 'self'",
  "font-src 'self'",
  `connect-src 'self'${vercelLive}`,
  `frame-src https://www.google.com https://maps.google.com${vercelLive}`,
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()" },
];

const nextConfig: NextConfig = {
  async headers() {
    return [{ source: "/(.*)", headers: securityHeaders }];
  },
};

export default nextConfig;
