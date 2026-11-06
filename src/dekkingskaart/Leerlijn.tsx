import { useState } from "react";
import { ActiviteitFormulier } from "./ActiviteitFormulier";
import { useSchool } from "./SchoolContext";
import type { Activiteit, ActiviteitVelden } from "./types";
import { Code, Knop, Merk, StatusTeken } from "./ui";

/* De leerlijn: wat is afgesproken, per onderdeel en per jaar. Dezelfde records als de kaart.
   Dit scherm zegt wat er is afgesproken, nooit of een kerndoel gedekt is.
   De school bepaalt zelf wat in de leerlijn hoort. */

function LesKaart({ a, onKlik }: { a: Activiteit; onKlik?: () => void }) {
  const { kolomVan } = useSchool();
  const kolom = kolomVan(a.kolom);
  const Tag = onKlik ? "button" : "div";
  return (
    <Tag onClick={onKlik} className={`flex w-full overflow-hidden rounded-md border border-rule bg-cream text-left ${onKlik ? "transition hover:border-cobalt" : ""}`}>
      <span title={kolom.naam} className="flex w-11 shrink-0 items-center justify-center bg-wash font-mono text-[10.5px] font-medium text-ink">{kolom.afk}</span>
      <span className="block min-w-0 flex-1 px-2 py-1.5">
        <span className="block text-[12.5px] leading-snug text-ink">{a.titel}</span>
        <span className="mt-1 flex items-center gap-2">
          <Merk methode={a.bron === "methode"} docent={a.bron === "docent"} />
          {a.status && <StatusTeken status={a.status} />}
        </span>
      </span>
    </Tag>
  );
}

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
  const rij = { gridTemplateColumns: `240px repeat(${kolommen.length}, minmax(170px, 1fr))` };
  return (
    <main className="mx-auto max-w-[1400px] px-4 py-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-[19px] font-bold tracking-tight text-ink">Leerlijn</h1>
          <p className="mt-0.5 text-[12.5px] text-ink-faint">Wat jullie hebben afgesproken, per onderdeel en per {school.jaarLabel}.</p>
        </div>
        <Knop klein onClick={() => setOpen({ jaar: null })}>Les toevoegen</Knop>
      </div>
      <div className="mt-4 overflow-x-auto rounded-lg border border-rule bg-cream">
        <div style={{ minWidth: 240 + kolommen.length * 170 }}>
          <div className="grid border-b border-rule" style={rij}>
            <div className="sticky left-0 z-10 bg-cream" />
            {kolommen.map((j) => <div key={j ?? "onbekend"} className="border-l border-rule/60 px-3 py-2 font-medium capitalize text-ink">{j === null ? `${school.jaarLabel} niet bekend` : jaarTekst(j)}</div>)}
          </div>
          {onderdelen.map((o) => (
            <div key={o.code} className="grid border-b border-rule/60 last:border-0" style={rij}>
              <div className="sticky left-0 z-10 flex items-baseline gap-2 bg-cream px-3 py-2"><Code code={o.code} /><span className="text-ink">{o.titel}</span></div>
              {kolommen.map((j) => {
                const lessen = lijn.filter((a) => a.codes.includes(o.code) && a.jaar === j);
                return (
                  <div key={j ?? "onbekend"} className="space-y-1 border-l border-rule/60 p-1.5">
                    {lessen.map((a) => <LesKaart key={a.id} a={a} onKlik={a.bron === "docent" ? () => { setKolom(a.kolom); setOpen({ jaar: j, code: o.code, bezig: a }); } : undefined} />)}
                    {j !== null && lessen.length === 0 && (
                      <button onClick={() => setOpen({ jaar: j, code: o.code })} aria-label={`Les toevoegen: ${o.titel}, ${j === null ? "" : jaarTekst(j)}`}
                        className="w-full rounded px-1 py-0.5 text-left text-[12px] text-cobalt opacity-0 transition hover:opacity-100 focus:opacity-100">
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
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-ink/20 p-4" onClick={() => setOpen(null)}>
          <div role="dialog" aria-modal="true" className="max-h-full w-full max-w-[560px] overflow-y-auto rounded-lg border border-rule bg-offwhite p-4" onClick={(e) => e.stopPropagation()}>
            {!open.bezig && (
              <label className="mb-3 flex items-center gap-2 text-[12.5px] text-ink-faint">
                Bij welk {school.kolomLabel === "vakgebied" ? "vakgebied" : "vak"}?
                <select value={kolom} onChange={(e) => setKolom(e.target.value)} className="rounded-md border border-rule bg-cream px-2 py-1 text-[12.5px] text-ink outline-none focus:border-cobalt">
                  {school.kolommen.map((k) => <option key={k.id} value={k.id}>{k.naam}</option>)}
                </select>
              </label>
            )}
            <ActiviteitFormulier
              key={`${open.bezig?.id ?? "nieuw"}-${open.code}-${open.jaar}`}
              kop={open.bezig ? "les bewerken" : "les toevoegen"}
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
