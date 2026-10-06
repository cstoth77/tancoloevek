"use client";
import { motion, useReducedMotion } from "motion/react";

/** A betűtábla mozdulata: a karakterek egyenként csúsznak a horonyba, amikor láthatóvá válnak. */
export function SlotText({ text }: { text: string }) {
  const reduce = useReducedMotion();
  if (reduce) return <>{text}</>;
  let i = 0;
  return (
    <>
      <span className="sr-only">{text}</span>
      <span aria-hidden>
        {text.split(" ").map((word, w) => (
          <span key={w} className="inline-block whitespace-nowrap">
            {[...word].map((ch) => {
              const delay = i++ * 0.035;
              return (
                <motion.span
                  key={delay}
                  className="inline-block"
                  initial={{ y: "0.5em", opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true, margin: "-10% 0px" }}
                  transition={{ delay, duration: 0.28, ease: "easeOut" }}
                >
                  {ch}
                </motion.span>
              );
            })}
            {" "}
          </span>
        ))}
      </span>
    </>
  );
}
