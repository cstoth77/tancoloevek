"use client";
import { useSyncExternalStore } from "react";
import { budapestDay } from "./schedule";

const noop = () => () => {};

/**
 * A látogató budapesti „ma”-ja. Hidratáláskor a szerveren számolt napot adja (nincs eltérés),
 * utána a kliens óráját — így a cache-ből érkező, elavult HTML-ben sem marad lejárt időpont.
 */
export function useBudapestToday(serverToday: string): string {
  return useSyncExternalStore(noop, () => budapestDay(new Date()), () => serverToday);
}
