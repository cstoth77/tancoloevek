"use client";
import Image from "next/image";
import { useReducedMotion } from "motion/react";

type Props = { mp4: string; webm: string; poster: string; alt: string };

/** Hangtalan, végtelenített háttérvideó; csökkentett mozgás esetén csak a poszterkép. */
export function LoopVideo({ mp4, webm, poster, alt }: Props) {
  const reduce = useReducedMotion();
  if (reduce) {
    return <Image src={poster} alt={alt} fill priority sizes="100vw" className="object-cover object-[70%_center]" />;
  }
  return (
    <video
      className="absolute inset-0 h-full w-full object-cover object-[70%_center]"
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      poster={poster}
      aria-label={alt}
      data-testid="hero-video"
    >
      <source src={webm} type="video/webm" />
      <source src={mp4} type="video/mp4" />
    </video>
  );
}
