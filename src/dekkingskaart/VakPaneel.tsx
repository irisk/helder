import { useState } from "react";
import { ActiviteitFormulier } from "./ActiviteitFormulier";
import { useSchool } from "./SchoolContext";
import { watGeleden } from "./tijd";
import type { Activiteit, ActiviteitVelden, Kolom, Nagelopen } from "./types";
import { Code, herkomst, Keuze, Knop, LijstRegel } from "./ui";

/* Hier gebeurt het lezen, toevoegen en bewerken van één vak. */

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
  const [formulier, setFormulier] = useState(false);
  const [wie, setWie] = useState<string | null>(null);
  const docenten = [...new Set(regels.filter((a) => a.bron === "docent").map((a) => a.docent ?? a.door))];
  const getoond = regels.filter((a) => (!viaCode || a.codes.includes(viaCode)) && (!wie || a.bron === "methode" || (a.docent ?? a.door) === wie));
  const details = (a: Activiteit) => `${[
    a.bron === "docent" ? "Eigen les" : "",
    a.codes.map(titelVan).join(", "),
    a.jaar === null ? `${school.jaarLabel} niet bekend` : jaarTekst(a.jaar),
    a.duur ?? "",
  ].filter(Boolean).join(", ")}. ${herkomst(a)}`;
  const sluitFormulier = () => { setBezig(null); setFormulier(false); };
  return (
    <div className="fixed inset-0 z-30 flex justify-end bg-overlay" onClick={onSluit}>
      <aside className="flex h-full w-full max-w-paneel flex-col border-l border-line bg-surface" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start justify-between gap-3 border-b border-line px-4 py-3">
          <div>
            <h2 className="text-kop">{kolom.naam}</h2>
            <div className="text-klein text-ink-soft">
              {bevestigd ? `Bevestigd door ${bevestigd.door}, ${watGeleden(bevestigd.op)}` : laatst ? `Bijgewerkt ${watGeleden(laatst)}` : "Nog niets ingevuld"}
            </div>
          </div>
          <Knop soort="stil" onClick={onSluit}>Sluiten</Knop>
        </div>

        <div className="flex-1 overflow-y-auto">
          {viaCode && (
            <div className="flex items-center gap-2 border-b border-line-soft bg-action-soft px-4 py-1.5">
              <Code code={viaCode} />
              <span className="font-semibold">{titelVan(viaCode)}</span>
              <span className="ml-auto"><Knop soort="stil" onClick={() => setViaCode(null)}>Toon alles</Knop></span>
            </div>
          )}
          {docenten.length > 1 && (
            <div className="flex flex-wrap items-center gap-2 border-b border-line-soft px-4 py-2.5">
              {[null, ...docenten].map((n) => <Keuze key={n ?? "iedereen"} aan={wie === n} onClick={() => setWie(n)}>{n ?? "Iedereen"}</Keuze>)}
            </div>
          )}
          <div className="divide-y divide-line-soft">
            {getoond.length === 0 && <p className="px-4 py-6 text-ink-soft">{regels.length ? "Hier staat nog niets over." : "Nog niets ingevuld."}</p>}
            {getoond.map((a) => {
              const uit = open === a.id;
              return (
                <LijstRegel key={a.id} a={a} details={details(a)} acties={<>
                  {a.toelichting && <Knop soort="stil" onClick={() => setOpen(uit ? null : a.id)}>{uit ? "Minder" : "Meer"}</Knop>}
                  {a.bron === "docent" && <>
                    <Knop soort="stil" onClick={() => { setBezig(a); setFormulier(true); }}>Bewerken</Knop>
                    <Knop soort="stil" onClick={() => { verwijder(a.id); if (bezig?.id === a.id) sluitFormulier(); }}>Verwijderen</Knop>
                  </>}
                </>}>
                  {uit && a.toelichting && <p className="mt-2 text-ink-soft">{a.toelichting}</p>}
                </LijstRegel>
              );
            })}
          </div>

          <div className="border-t border-line-soft px-4 py-4">
            {formulier ? (
              <ActiviteitFormulier
                key={bezig?.id ?? "nieuw"}
                kop={bezig ? "Les bewerken" : "Les toevoegen"}
                begin={bezig ?? undefined} bewerken={!!bezig}
                naam={naam} kolomId={kolom.id} toonCodes
                onOpslaan={(v) => { if (bezig) bewerk(bezig.id, v); else voegToe(kolom.id, v); sluitFormulier(); }}
                onAnnuleer={sluitFormulier}
              />
            ) : (
              <Knop onClick={() => setFormulier(true)}>Les toevoegen</Knop>
            )}
          </div>
        </div>
      </aside>
    </div>
  );
}
