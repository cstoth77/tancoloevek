/** Szekciócím betűtábla-csíkon: a koncepció a hero után is végigmegy az oldalon. */
export function BoardHeading({ id, children, className = "" }: { id: string; children: string; className?: string }) {
  return (
    <div className={`letterboard inline-block max-w-full border-4 border-[#a39a8f] px-5 py-2 md:px-7 md:py-3 ${className}`}>
      <h2 id={id} className="board-type text-[clamp(1.7rem,5.5vw,3.4rem)] font-bold uppercase leading-[1.25] [overflow-wrap:anywhere]">
        {children}
      </h2>
    </div>
  );
}
