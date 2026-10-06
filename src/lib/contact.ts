import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Kérlek, add meg a neved.").max(80, "Legfeljebb 80 karakter."),
  email: z.email("Kérlek, érvényes e-mail címet adj meg."),
  classSlug: z.enum(["anya-baba", "tancolo-evek", "egyeb"], "Válaszd ki, melyik óra érdekel."),
  message: z.string().trim().max(2000, "Legfeljebb 2000 karakter.").default(""),
  website: z.string().default(""),
});
export type ContactInput = z.infer<typeof contactSchema>;

const oneLine = (s: string) => s.replace(/[\r\n\t]+/g, " ").trim();

/** Plain-text e-mail: nincs HTML, így a bevitt szöveg nem értelmeződik; a tárgy egysoros. */
export function buildEmail(input: ContactInput, classTitle: string) {
  const subject = oneLine(`Jelentkezés: ${classTitle} – ${input.name}`).slice(0, 120);
  const text = [`Név: ${oneLine(input.name)}`, `E-mail: ${input.email}`, `Óra: ${classTitle}`, "", input.message || "(nincs üzenet)"].join("\n");
  return { subject, text };
}

/** Szerveroldali: van-e beállított Resend kulcs. */
export function isContactFormEnabled() {
  return Boolean(process.env.RESEND_API_KEY);
}
