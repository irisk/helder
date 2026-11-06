import { useState } from "react";
import { useSchool } from "./SchoolContext";
import { versheid, watGeleden } from "./tijd";
import { Knop } from "./ui";

export function Collegas({ laatstBijgewerkt, onOpen, onTerug }: { laatstBijgewerkt: (kolom: string) => string | null; onOpen: (kolom: string, naam: string) => void; onTerug: () => void }) {
  const { school, kolomVan } = useSchool();
  const [gevraagd, setGevraagd] = useState<string[]>([]);
  return (
    <main className="mx-auto max-w-[880px] px-4 py-6">
      <h1 className="font-display text-[19px] font-bold tracking-tight text-ink">Collega's</h1>
      <p className="mt-1 max-w-[64ch] text-[12.5px] text-ink-faint">
        Iedereen vult zijn eigen deel in. Dat is het verschil met een gedeeld bestand: daar blijft het bijwerken bij één persoon liggen.
      </p>
      <div className="mt-4 divide-y divide-rule overflow-hidden rounded-lg border border-rule bg-cream">
        {school.docenten.map((p) => {
          const sleutel = `${p.naam}-${p.kolom}`;
          const lb = laatstBijgewerkt(p.kolom); const vs = versheid(lb);
          return (
            <div key={sleutel} className="flex items-center gap-3 px-3 py-2">
              <span className="h-6 w-6 shrink-0 rounded-full bg-cobalt-soft text-center font-mono text-[10px] leading-6 text-cobalt-deep">{p.naam.slice(0, 2)}</span>
              <span className="w-24 font-medium text-ink">{p.naam}</span>
              <span className="w-32 text-ink-soft">{kolomVan(p.kolom).naam}</span>
              <span className={`font-mono text-[10.5px] ${vs === "verouderd" ? "text-yellow" : "text-ink-faint"}`}>
                {lb ? watGeleden(lb) : "nog niets"}
              </span>
              <div className="ml-auto flex items-center gap-1.5">
                <Knop soort="stil" klein onClick={() => onOpen(p.kolom, p.naam)}>Bekijk hun scherm</Knop>
                {gevraagd.includes(sleutel)
                  ? <span className="px-2.5 font-mono text-[10.5px] text-sage-deep">gevraagd</span>
                  : <Knop soort="rand" klein onClick={() => setGevraagd((l) => [...l, sleutel])}>Vraag na</Knop>}
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-4"><Knop soort="stil" onClick={onTerug}>← Terug naar de kaart</Knop></div>
    </main>
  );
}
