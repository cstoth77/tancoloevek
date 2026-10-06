import { revalidatePath } from "next/cache";

/**
 * Napi Vercel Cron (vercel.json) éjfél után: újragenerálja a főoldalt, hogy a lejárt egyszeri
 * időpontok a statikus HTML-ből és a JSON-LD-ből is eltűnjenek. A Vercel a CRON_SECRET-et Bearer tokenként küldi.
 */
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
    return new Response("Unauthorized", { status: 401 });
  }
  revalidatePath("/");
  return Response.json({ revalidated: true });
}
