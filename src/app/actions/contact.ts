"use server";
import { Resend } from "resend";
import { buildEmail, contactSchema, type ContactInput } from "@/lib/contact";
import { site } from "@/content/site";

type Field = keyof ContactInput;

export type ContactState = {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: Partial<Record<Field, string>>;
  /** A beírt értékek visszaadása, hogy hiba esetén ne vesszen el a kitöltés. */
  values?: Partial<Record<Field, string>>;
};

const FALLBACK = `Most nem sikerült elküldeni. Írj közvetlenül: ${site.contact.email}`;
const SUCCESS = "Köszönöm, hamarosan jelentkezem!";

export async function sendContact(_prev: ContactState, formData: FormData): Promise<ContactState> {
  const raw = Object.fromEntries(formData) as Record<string, string>;
  const values = { name: raw.name, email: raw.email, classSlug: raw.classSlug, message: raw.message };
  const parsed = contactSchema.safeParse(raw);
  if (!parsed.success) {
    const fieldErrors: ContactState["fieldErrors"] = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] as Field;
      fieldErrors[key] ??= issue.message;
    }
    return { status: "error", message: "Kérlek, javítsd a jelölt mezőket.", fieldErrors, values };
  }
  if (parsed.data.website) return { status: "success", message: SUCCESS };

  const key = process.env.RESEND_API_KEY;
  if (!key) return { status: "error", message: FALLBACK, values };

  const title = site.classes.find((c) => c.slug === parsed.data.classSlug)?.title ?? "Általános érdeklődés";
  const { subject, text } = buildEmail(parsed.data, title);
  try {
    const { error } = await new Resend(key).emails.send({
      from: "Weboldal <onboarding@resend.dev>",
      to: process.env.CONTACT_TO_EMAIL || site.contact.email,
      replyTo: parsed.data.email,
      subject,
      text,
    });
    if (error) return { status: "error", message: FALLBACK, values };
  } catch {
    return { status: "error", message: FALLBACK, values };
  }
  return { status: "success", message: SUCCESS };
}
