import { afterEach, expect, test, vi } from "vitest";

vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));
afterEach(() => vi.unstubAllEnvs());

const req = (auth?: string) => new Request("http://x/api/revalidate", { headers: auth ? { authorization: auth } : {} });

test("CRON_SECRET nélkül vagy rossz tokennel 401, nincs revalidate", async () => {
  const { revalidatePath } = await import("next/cache");
  const { GET } = await import("@/app/api/revalidate/route");
  vi.stubEnv("CRON_SECRET", "s3cret");
  expect((await GET(req())).status).toBe(401);
  expect((await GET(req("Bearer rossz"))).status).toBe(401);
  vi.stubEnv("CRON_SECRET", "");
  expect((await GET(req("Bearer "))).status).toBe(401);
  expect(revalidatePath).not.toHaveBeenCalled();
});

test("helyes tokennel újragenerálja a főoldalt", async () => {
  const { revalidatePath } = await import("next/cache");
  const { GET } = await import("@/app/api/revalidate/route");
  vi.stubEnv("CRON_SECRET", "s3cret");
  const res = await GET(req("Bearer s3cret"));
  expect(res.status).toBe(200);
  expect(revalidatePath).toHaveBeenCalledWith("/");
});
