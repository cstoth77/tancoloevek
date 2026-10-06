"use client";
import Image from "next/image";
import { useEffect, useState, useSyncExternalStore } from "react";

type Props = { mp4: string; webm: string; poster: string; alt: string };

const QUERY = "(prefers-reduced-motion: reduce)";
function useReducedMotion() {
  return useSyncExternalStore(
    (cb) => {
      const mq = window.matchMedia(QUERY);
      mq.addEventListener("change", cb);
      return () => mq.removeEventListener("change", cb);
    },
    () => window.matchMedia(QUERY).matches,
    () => false,
  );
}

/** Mindig a poszterkép rajzolódik ki először; a videó csak az oldal betöltése után, üresjáratban indul. Csökkentett mozgásnál nincs videó. */
export function LoopVideo({ mp4, webm, poster, alt }: Props) {
  const reduce = useReducedMotion();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (reduce) return;
    const start = () => ("requestIdleCallback" in window ? requestIdleCallback(() => setReady(true)) : setTimeout(() => setReady(true), 200));
    if (document.readyState === "complete") start();
    else window.addEventListener("load", start, { once: true });
    return () => window.removeEventListener("load", start);
  }, [reduce]);

  return (
    <>
      <Image src={poster} alt={alt} fill priority sizes="100vw" className="object-cover object-[70%_center]" />
      {ready && !reduce && (
        <video
          className="absolute inset-0 h-full w-full object-cover object-[70%_center]"
          autoPlay
          muted
          loop
          playsInline
          poster={poster}
          aria-hidden
          data-testid="hero-video"
        >
          <source src={webm} type="video/webm" />
          <source src={mp4} type="video/mp4" />
        </video>
      )}
    </>
  );
}
