import { useState } from "react";
import { ActiviteitFormulier } from "./ActiviteitFormulier";
import { useSchool } from "./SchoolContext";
import { watGeleden } from "./tijd";
import type { Activiteit, ActiviteitVelden, Kolom, Nagelopen } from "./types";
import { Code, herkomst, Knop, Merk } from "./ui";

/* Hier gebeurt het toevoegen en bewerken. */

export function VakPaneel({ kolom, regels, laatst, bevestigd, viaCode, naam, onSluit, setViaCode, voegToe, bewerk, verwijder }: {
  kolom: Kolom; regels: Activiteit[]; laatst: string | null; bevestigd?: Nagelopen; viaCode: string | null; naam: string; onSluit: () => void;
  setViaCode: (c: string | null) => void;
  voegToe: (kolom: string, v: ActiviteitVelden) => void;
  bewerk: (id: string, v: ActiviteitVelden) => void;
  verwijder: (id: string) => void;
}) {
  const { titelVan, jaarTekst, school } = useSchool();
  const [open, setOpen] = useState<string | null>(null);
  const [bezig, setBezig] = useState<Activiteit | null>(null);
  const [wie, setWie] = useState<string | null>(null);
  const raakt = (a: Activiteit) => !viaCode || a.codes.includes(viaCode);
  const docenten = [...new Set(regels.filter((a) => a.bron === "docent").map((a) => a.docent ?? a.door))];
  const getoond = regels.filter((a) => !wie || a.bron === "methode" || (a.docent ?? a.door) === wie);
  return (
    <div className="fixed inset-0 z-30 flex justify-end bg-ink/20" onClick={onSluit}>
      <aside className="flex h-full w-full max-w-[520px] flex-col border-l border-rule bg-cream" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between border-b border-rule px-4 py-2.5">
          <div>
            <h2 className="font-display text-[16px] font-bold tracking-tight text-ink">{kolom.naam}</h2>
            <span className="font-mono text-[10.5px] text-ink-faint">
              {laatst ? `bijgewerkt ${watGeleden(laatst)}` : "nog niets ingevuld"}{bevestigd ? `, bevestigd door ${bevestigd.door}, ${watGeleden(bevestigd.op)}` : ""}
            </span>
          </div>
          <Knop soort="stil" klein onClick={onSluit}>Sluiten</Knop>
        </div>

        {viaCode && (
          <div className="flex items-center gap-2 border-b border-rule bg-cobalt-soft/40 px-4 py-1.5">
            <Code code={viaCode} />
            <span className="text-[12.5px] font-medium text-ink">{titelVan(viaCode)}</span>
            <button onClick={() => setViaCode(null)} className="ml-auto text-[12px] text-cobalt-deep hover:underline">toon alles</button>
          </div>
        )}

        <div className="flex-1 overflow-y-auto">
          {docenten.length > 1 && (
            <div className="flex flex-wrap items-center gap-1 border-b border-rule px-4 py-1.5">
              {[null, ...docenten].map((n) => (
                <button key={n ?? "iedereen"} onClick={() => setWie(n)} aria-pressed={wie === n}
                  className={`rounded-md px-2 py-0.5 text-[12px] ${wie === n ? "bg-cobalt-soft text-cobalt-deep" : "text-ink-soft hover:text-ink"}`}>{n ?? "Iedereen"}</button>
              ))}
            </div>
          )}
          <div className="divide-y divide-rule/70">
            {regels.length === 0 && <p className="px-4 py-6 text-ink-faint">Nog niets. Voeg hieronder toe wat je hier doet.</p>}
            {getoond.map((a) => {
              const relevant = raakt(a) && a.antwoord?.waarde !== "nee"; const uit = open === a.id;
              return (
              <div key={a.id} className={`group px-4 py-2 transition ${relevant ? "" : "opacity-35"}`}>
                <div className="flex items-start gap-2.5">
                  <span className="mt-1 shrink-0"><Merk methode={a.bron === "methode"} docent={a.bron === "docent"} /></span>
                  <button onClick={() => setOpen(uit ? null : a.id)} className="min-w-0 flex-1 text-left">
                    <div className="text-ink">{a.titel}</div>
                    <div className="mt-0.5 flex flex-wrap items-center gap-x-2 font-mono text-[10.5px] text-ink-faint">
                      {a.codes.map((c) => (
                        <span key={c} title={titelVan(c)} className={viaCode === c ? "rounded bg-cobalt-soft px-1 text-cobalt-deep" : ""}>{c}</span>
                      ))}
                      {a.bron === "docent" && <span>· eigen les</span>}
                      <span>· {a.jaar === null ? `${school.jaarLabel} niet bekend` : jaarTekst(a.jaar)}</span>
                      {a.duur && <span>· {a.duur}</span>}
                      <span>· {herkomst(a)}</span>
                      {a.toelichting && <span className="text-cobalt">· {uit ? "minder" : "meer"}</span>}
                    </div>
                  </button>
                  {a.bron === "docent" && (
                    <div className="flex shrink-0 gap-2 opacity-0 transition focus-within:opacity-100 group-hover:opacity-100">
                      <button onClick={() => setBezig(a)} className="text-[12px] text-ink-faint hover:text-cobalt">bewerk</button>
                      <button onClick={() => { verwijder(a.id); if (bezig?.id === a.id) setBezig(null); }} className="text-[12px] text-ink-faint hover:text-coral">verwijder</button>
                    </div>
                  )}
                </div>
                {uit && a.toelichting && (
                  <div className="ml-[22px] mt-1.5 border-l-2 border-rule pl-2.5">
                    <p className="text-[12.5px] leading-relaxed text-ink-soft">{a.toelichting}</p>
                    <div className="mt-1.5 flex flex-wrap gap-1">
                      {a.codes.map((c) => (
                        <span key={c} className="rounded border border-rule bg-offwhite px-1.5 py-0.5 text-[11px] text-ink-soft">
                          <span className="font-mono text-[9.5px] text-ink-faint">{c}</span> {titelVan(c)}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );})}
          </div>
        </div>

        <div className="border-t border-rule bg-offwhite px-4 py-3">
          {/* key: bij een ander record begint het formulier opnieuw met dat record */}
          <ActiviteitFormulier
            key={bezig?.id ?? "nieuw"}
            kop={bezig ? "bewerken" : "les toevoegen"}
            begin={bezig ?? undefined} bewerken={!!bezig}
            naam={naam} kolomId={kolom.id} toonCodes
            onOpslaan={(v) => { if (bezig) { bewerk(bezig.id, v); setBezig(null); } else voegToe(kolom.id, v); }}
            onAnnuleer={bezig ? () => setBezig(null) : undefined}
          />
        </div>
      </aside>
    </div>
  );
}
