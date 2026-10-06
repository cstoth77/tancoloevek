import { afterEach, expect, test, vi } from "vitest";
import { siteUrl } from "@/lib/site-url";

afterEach(() => vi.unstubAllEnvs());

test("NEXT_PUBLIC_SITE_URL az elsődleges", () => {
  vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://hanna.example");
  vi.stubEnv("VERCEL_PROJECT_PRODUCTION_URL", "hanna.vercel.app");
  expect(siteUrl()).toBe("https://hanna.example");
});

test("hiányában a Vercel production domain", () => {
  vi.stubEnv("NEXT_PUBLIC_SITE_URL", "");
  vi.stubEnv("VERCEL_PROJECT_PRODUCTION_URL", "hanna.vercel.app");
  expect(siteUrl()).toBe("https://hanna.vercel.app");
});

test("lokálisan localhost", () => {
  vi.stubEnv("NEXT_PUBLIC_SITE_URL", "");
  vi.stubEnv("VERCEL_PROJECT_PRODUCTION_URL", "");
  expect(siteUrl()).toBe("http://localhost:3000");
});
