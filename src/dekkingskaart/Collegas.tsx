import { useState } from "react";
import { useSchool } from "./SchoolContext";
import type { Nagelopen } from "./types";
import { Datum, Knop } from "./ui";

export function Collegas({ laatstBijgewerkt, nagelopen, onOpen, onTerug }: { laatstBijgewerkt: (kolom: string) => string | null; nagelopen: Record<string, Nagelopen>; onOpen: (kolom: string, naam: string) => void; onTerug: () => void }) {
  const { school, kolomVan } = useSchool();
  const [gevraagd, setGevraagd] = useState<string[]>([]);
  return (
    <main className="mx-auto max-w-smal px-6 py-6">
      <h1 className="text-titel">Collega's</h1>
      <div className="mt-4 divide-y divide-line-soft rounded-kaart border border-line bg-surface">
        {school.docenten.map((p) => {
          const sleutel = `${p.naam}-${p.kolom}`;
          const lb = laatstBijgewerkt(p.kolom); const n = nagelopen[p.kolom];
          // De laatste van de twee, met het woord erbij.
          const isBevestigd = !!n && (!lb || n.op >= lb);
          const datum = isBevestigd ? n!.op : lb;
          return (
            <div key={sleutel} className="flex flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3">
              {/* Zelfde opbouw als een lijstregel: titel, details eronder, acties rechts */}
              <div className="min-w-0 flex-1 basis-[240px]">
                <div className="font-semibold">{p.naam}</div>
                <div className="flex flex-wrap items-center gap-x-2 text-klein text-ink-soft">
                  <span>{kolomVan(p.kolom).naam}</span>
                  <Datum iso={datum} woord={isBevestigd ? "Bevestigd" : "Bijgewerkt"} leeg="Nog niets ingevuld" />
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <Knop soort="stil" onClick={() => onOpen(p.kolom, p.naam)}>Bekijk hun scherm</Knop>
                {gevraagd.includes(sleutel)
                  ? <span className="px-[18px] text-ink-soft">Gevraagd</span>
                  : <Knop soort="tweede" onClick={() => setGevraagd((l) => [...l, sleutel])}>Vraag na</Knop>}
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-4"><Knop soort="stil" onClick={onTerug}>Terug naar de kaart</Knop></div>
    </main>
  );
}
