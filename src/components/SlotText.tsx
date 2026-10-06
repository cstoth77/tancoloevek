import type { CSSProperties } from "react";

/**
 * A betűtábla mozdulata: a karakterek egyenként csúsznak a horonyba, ahogy a sor a képbe gördül.
 * Tisztán CSS (scroll-driven animáció, globals.css: .slot-char) – JS nélkül és támogatás híján a szöveg egyszerűen látszik.
 */
export function SlotText({ text }: { text: string }) {
  let i = 0;
  return (
    <>
      <span className="sr-only">{text}</span>
      <span aria-hidden>
        {text.split(" ").map((word, w) => (
          <span key={w} className="inline-block whitespace-nowrap">
            {[...word].map((ch) => {
              const n = i++;
              return (
                <span key={n} className="slot-char inline-block" style={{ "--i": n } as CSSProperties}>
                  {ch}
                </span>
              );
            })}
            {" "}
          </span>
        ))}
      </span>
    </>
  );
}
