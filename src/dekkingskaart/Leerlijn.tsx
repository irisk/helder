import { useState } from "react";
import { ActiviteitFormulier } from "./ActiviteitFormulier";
import { useSchool } from "./SchoolContext";
import type { Activiteit, ActiviteitVelden } from "./types";
import { Code, Keuzelijst, Knop, LesKaart } from "./ui";

/* De leerlijn: wat is afgesproken, per onderdeel en per jaar. Dezelfde records als de kaart.
   Dit scherm zegt wat er is afgesproken, nooit of een kerndoel gedekt is.
   De school bepaalt zelf wat in de leerlijn hoort. */

type Open = { jaar: number | null; code?: string; bezig?: Activiteit };

export function Leerlijn({ alles, naam, voegToe, bewerk }: {
  alles: Activiteit[]; naam: string;
  voegToe: (kolom: string, v: ActiviteitVelden) => void;
  bewerk: (id: string, v: ActiviteitVelden) => void;
}) {
  const { school, onderdelen, jaarTekst } = useSchool();
  const [open, setOpen] = useState<Open | null>(null);
  const [kolom, setKolom] = useState(school.kolommen[0].id);
  const lijn = alles.filter((a) => a.inLeerlijn && a.antwoord?.waarde !== "nee");
  const onbekend = lijn.some((a) => a.jaar === null);
  const kolommen: (number | null)[] = [...school.jaren, ...(onbekend ? [null] : [])];
  const rij = { gridTemplateColumns: `260px repeat(${kolommen.length}, minmax(210px, 1fr))` };
  return (
    <main className="mx-auto max-w-[1400px] px-6 py-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-titel">Leerlijn</h1>
          <p className="mt-0.5 text-ink-soft">Wat jullie hebben afgesproken, per onderdeel en per {school.jaarLabel}.</p>
        </div>
        <Knop onClick={() => setOpen({ jaar: null })}>Les toevoegen</Knop>
      </div>
      <div className="overflow-x-auto rounded-kaart border border-line bg-surface">
        <div style={{ minWidth: 260 + kolommen.length * 210 }}>
          <div className="grid border-b border-line-strong" style={rij}>
            <div className="sticky left-0 z-10 flex items-end bg-surface px-4 py-3 font-semibold">Onderdeel</div>
            {kolommen.map((j) => <div key={j ?? "onbekend"} className="border-l border-line-soft px-3 py-3 font-semibold capitalize">{j === null ? `${school.jaarLabel} niet bekend` : jaarTekst(j)}</div>)}
          </div>
          {onderdelen.map((o) => (
            <div key={o.code} className="grid border-b border-line-soft last:border-0" style={rij}>
              <div className="sticky left-0 z-10 flex items-baseline gap-2.5 bg-surface px-4 py-3"><Code code={o.code} /><span>{o.titel}</span></div>
              {kolommen.map((j) => {
                const lessen = lijn.filter((a) => a.codes.includes(o.code) && a.jaar === j);
                return (
                  <div key={j ?? "onbekend"} className="flex min-h-11 flex-col gap-1.5 border-l border-line-soft p-2">
                    {lessen.map((a) => <LesKaart key={a.id} a={a} onKlik={a.bron === "docent" ? () => { setKolom(a.kolom); setOpen({ jaar: j, code: o.code, bezig: a }); } : undefined} />)}
                    {j !== null && lessen.length === 0 && (
                      <button onClick={() => setOpen({ jaar: j, code: o.code })} aria-label={`Les toevoegen: ${o.titel}, ${jaarTekst(j)}`}
                        className="flex-1 rounded-veld px-2 text-left font-semibold text-action opacity-0 transition hover:opacity-100 focus:opacity-100">
                        Les toevoegen
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-overlay p-4" onClick={() => setOpen(null)}>
          <div role="dialog" aria-modal="true" aria-label={open.bezig ? "Les bewerken" : "Les toevoegen"} className="max-h-full w-full max-w-[600px] overflow-y-auto rounded-kaart border border-line bg-surface p-5" onClick={(e) => e.stopPropagation()}>
            <div className="-mb-9 -mt-1 flex justify-end"><Knop soort="stil" onClick={() => setOpen(null)}>Sluiten</Knop></div>
            <ActiviteitFormulier
              key={`${open.bezig?.id ?? "nieuw"}-${open.code}-${open.jaar}`}
              kop={open.bezig ? "Les bewerken" : "Les toevoegen"}
              boven={open.bezig ? undefined : (
                <Keuzelijst label={school.kolomLabel === "vakgebied" ? "Vakgebied" : "Vak"} value={kolom} onChange={setKolom}
                  opties={school.kolommen.map((k) => ({ waarde: k.id, tekst: k.naam }))} />
              )}
              begin={open.bezig ?? { jaar: open.jaar, codes: open.code ? [open.code] : [], inLeerlijn: true, status: "gepland" }}
              bewerken={!!open.bezig}
              naam={naam} kolomId={kolom} toonCodes
              onOpslaan={(v) => { if (open.bezig) bewerk(open.bezig.id, v); else voegToe(kolom, v); setOpen(null); }}
              onAnnuleer={() => setOpen(null)}
            />
          </div>
        </div>
      )}
    </main>
  );
}
