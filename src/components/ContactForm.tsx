"use client";
import { useActionState } from "react";
import { useSearchParams } from "next/navigation";
import { sendContact, type ContactState } from "@/app/actions/contact";
import { site } from "@/content/site";

const field =
  "mt-2 block w-full min-h-12 rounded-md border-2 border-felt/40 bg-white px-4 text-lg text-felt aria-[invalid=true]:border-powder-ink";

function FieldError({ id, text }: { id: string; text?: string }) {
  return text ? (
    <span id={id} className="mt-1 block font-semibold text-powder-ink">
      {text}
    </span>
  ) : null;
}

export function ContactForm() {
  const [state, action, pending] = useActionState<ContactState, FormData>(sendContact, { status: "idle" });
  const preset = useSearchParams().get("ora") ?? "";
  const err = state.fieldErrors ?? {};
  const v = state.values ?? {};

  if (state.status === "success") {
    return (
      <p role="status" className="font-display text-2xl">
        {state.message}
      </p>
    );
  }

  return (
    // key: hiba után a mezők a visszakapott értékekkel töltődnek újra
    <form key={JSON.stringify(v)} action={action} noValidate className="relative grid gap-6 text-lg">
      <label>
        Neved
        <input name="name" autoComplete="name" required defaultValue={v.name} className={field} aria-invalid={!!err.name} aria-describedby="err-name" />
        <FieldError id="err-name" text={err.name} />
      </label>
      <label>
        E-mail címed
        <input name="email" type="email" autoComplete="email" required defaultValue={v.email} className={field} aria-invalid={!!err.email} aria-describedby="err-email" />
        <FieldError id="err-email" text={err.email} />
      </label>
      <label>
        Melyik óra érdekel?
        <select name="classSlug" defaultValue={v.classSlug ?? preset} className={field} aria-invalid={!!err.classSlug} aria-describedby="err-class">
          <option value="" disabled>
            Válassz…
          </option>
          {site.classes.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.title}
            </option>
          ))}
          <option value="egyeb">Egyéb kérdés</option>
        </select>
        <FieldError id="err-class" text={err.classSlug} />
      </label>
      <label>
        Üzenet <span className="text-felt/75">(nem kötelező)</span>
        <textarea name="message" rows={4} maxLength={2000} defaultValue={v.message} className={`${field} py-3`} aria-invalid={!!err.message} aria-describedby="err-message" />
        <FieldError id="err-message" text={err.message} />
      </label>
      <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label>
          Weboldal
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      {state.status === "error" && (
        <p role="alert" className="font-semibold text-powder-ink">
          {state.message}
        </p>
      )}
      <button disabled={pending} className="min-h-12 justify-self-start rounded-[3px] bg-clay px-8 font-semibold text-felt disabled:opacity-60">
        {pending ? "Küldés…" : "Elküldöm"}
      </button>
    </form>
  );
}
