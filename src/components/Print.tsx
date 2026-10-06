import Image from "next/image";
import type { Img } from "@/content/site";

type Props = { img: Img; sizes: string; className?: string; tape?: string };

/** Fotó papírprintként a filcre ragasztva: fehér szegély, szögletes sarok, ragasztócsík. */
export function Print({ img, sizes, className = "", tape = "left-1/2 -translate-x-1/2 rotate-[2deg] bg-tape/85" }: Props) {
  return (
    <figure className={`relative bg-letter p-2 md:p-3 ${className}`}>
      <span aria-hidden className={`absolute -top-3 z-10 h-7 w-24 ${tape}`} />
      <div className="relative h-full w-full md:min-h-[22rem]">
        <Image src={img.src} alt={img.alt} fill sizes={sizes} className="object-cover" />
      </div>
    </figure>
  );
}
