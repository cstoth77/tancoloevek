"use client";
import Image from "next/image";
import { useRef } from "react";
import type { Img } from "@/content/site";

/** Natív <dialog>: Esc, fókuszcsapda és háttér-inertség a böngészőtől. */
export function PosterLightbox({ poster, label }: { poster: Img; label: string }) {
  const ref = useRef<HTMLDialogElement>(null);
  return (
    <>
      <button type="button" onClick={() => ref.current?.showModal()} className="inline-flex min-h-11 items-center underline underline-offset-4">
        {label}
      </button>
      <dialog
        ref={ref}
        aria-label={poster.alt}
        onClick={(e) => {
          if (e.target === ref.current) ref.current?.close();
        }}
        className="m-auto max-h-[94svh] max-w-[min(92vw,640px)] bg-transparent p-0 backdrop:bg-felt/85"
      >
        <Image src={poster.src} alt={poster.alt} width={poster.width} height={poster.height} sizes="640px" className="h-auto max-h-[84svh] w-auto rounded-[4px]" />
        <form method="dialog" className="mt-3 text-right">
          <button className="min-h-11 rounded-full bg-letter px-6 font-semibold text-felt">Bezárás</button>
        </form>
      </dialog>
    </>
  );
}
