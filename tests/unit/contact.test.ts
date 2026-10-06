import { beforeEach, describe, expect, test, vi } from "vitest";
import { buildEmail, contactSchema, isContactFormEnabled } from "@/lib/contact";

const valid = { name: "Kiss Éva", email: "eva@example.com", classSlug: "tancolo-evek", message: "Szia!", website: "" };

describe("contactSchema", () => {
  test("érvényes bevitel", () => expect(contactSchema.safeParse(valid).success).toBe(true));
  test("rossz e-mail", () => expect(contactSchema.safeParse({ ...valid, email: "x" }).success).toBe(false));
  test("túl rövid név", () => expect(contactSchema.safeParse({ ...valid, name: "K" }).success).toBe(false));
  test("2000 karakternél hosszabb üzenet elutasítva", () =>
    expect(contactSchema.safeParse({ ...valid, message: "a".repeat(2001) }).success).toBe(false));
  test("ismeretlen óra elutasítva", () =>
    expect(contactSchema.safeParse({ ...valid, classSlug: "salsa" }).success).toBe(false));
  test("üzenet nélkül is érvényes", () => {
    const withoutMessage: Partial<typeof valid> = { ...valid };
    delete withoutMessage.message;
    expect(contactSchema.safeParse(withoutMessage).success).toBe(true);
  });
});

describe("buildEmail", () => {
  test("egysoros, vágott tárgy, plain text törzs", () => {
    const e = buildEmail({ ...valid, classSlug: "tancolo-evek", name: "Évi\r\nBcc: x@y.z" + "a".repeat(200) }, "Táncoló Évek");
    expect(e.subject).not.toMatch(/[\r\n]/);
    expect(e.subject.length).toBeLessThanOrEqual(120);
    expect(e.text).toContain("Táncoló Évek");
    expect(e.text).toContain("eva@example.com");
  });
  test("HTML nem értelmeződik (szövegként marad)", () => {
    const e = buildEmail({ ...valid, classSlug: "tancolo-evek", message: "<script>alert(1)</script>" }, "Táncoló Évek");
    expect(e.text).toContain("<script>alert(1)</script>");
  });
});

describe("isContactFormEnabled", () => {
  beforeEach(() => vi.unstubAllEnvs());
  test("kulcs nélkül kikapcsolt", () => {
    vi.stubEnv("RESEND_API_KEY", "");
    expect(isContactFormEnabled()).toBe(false);
  });
  test("kulccsal bekapcsolt", () => {
    vi.stubEnv("RESEND_API_KEY", "re_test");
    expect(isContactFormEnabled()).toBe(true);
  });
});

describe("sendContact", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.unstubAllEnvs();
    vi.doUnmock("resend");
  });

  const fd = (o: Record<string, string>) => {
    const f = new FormData();
    Object.entries(o).forEach(([k, v]) => f.set(k, v));
    return f;
  };

  test("kulcs nélkül barátságos hiba, nem dob", async () => {
    vi.stubEnv("RESEND_API_KEY", "");
    const { sendContact } = await import("@/app/actions/contact");
    const r = await sendContact({ status: "idle" }, fd(valid));
    expect(r.status).toBe("error");
    expect(r.message).toMatch(/tancoloevek@gmail.com/);
  });

  test("honeypot kitöltve: siker, de nincs küldés", async () => {
    vi.stubEnv("RESEND_API_KEY", "re_test");
    const send = vi.fn();
    vi.doMock("resend", () => ({ Resend: class { emails = { send }; } }));
    const { sendContact } = await import("@/app/actions/contact");
    const r = await sendContact({ status: "idle" }, fd({ ...valid, website: "spam.example" }));
    expect(r.status).toBe("success");
    expect(send).not.toHaveBeenCalled();
  });

  test("validációs hiba mezőnként, a beírt értékek megmaradnak", async () => {
    vi.stubEnv("RESEND_API_KEY", "re_test");
    const { sendContact } = await import("@/app/actions/contact");
    const r = await sendContact({ status: "idle" }, fd({ ...valid, email: "rossz" }));
    expect(r.status).toBe("error");
    expect(r.fieldErrors?.email).toBeDefined();
    expect(r.values?.name).toBe("Kiss Éva");
    expect(r.values?.message).toBe("Szia!");
  });

  test("sikeres küldés Resenddel, reply-to a látogató", async () => {
    vi.stubEnv("RESEND_API_KEY", "re_test");
    vi.stubEnv("CONTACT_TO_EMAIL", "hanna@example.com");
    const send = vi.fn().mockResolvedValue({ data: { id: "1" }, error: null });
    vi.doMock("resend", () => ({ Resend: class { emails = { send }; } }));
    const { sendContact } = await import("@/app/actions/contact");
    const r = await sendContact({ status: "idle" }, fd(valid));
    expect(r.status).toBe("success");
    expect(send).toHaveBeenCalledWith(expect.objectContaining({ to: "hanna@example.com", replyTo: "eva@example.com" }));
  });

  test("Resend hiba esetén fallback üzenet", async () => {
    vi.stubEnv("RESEND_API_KEY", "re_test");
    const send = vi.fn().mockResolvedValue({ data: null, error: { message: "boom" } });
    vi.doMock("resend", () => ({ Resend: class { emails = { send }; } }));
    const { sendContact } = await import("@/app/actions/contact");
    const r = await sendContact({ status: "idle" }, fd(valid));
    expect(r.status).toBe("error");
    expect(r.message).toMatch(/tancoloevek@gmail.com/);
  });
});
