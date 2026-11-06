import { Fragment, useState } from "react";
import { useSchool } from "./SchoolContext";
import { watGeleden } from "./tijd";
import type { Activiteit, ActiviteitVelden, Nagelopen, Onderdeel } from "./types";
import { Boek, Code, Datum, herkomst, Keuze, Merk, Persoon } from "./ui";
import { VakPaneel } from "./VakPaneel";

const KOLOM_BREEDTE = 112;
const LABEL_BREEDTE = 320;

function Cel({ regels, schaduw, label, onKlik, onHover, onWeg }: {
  regels: Activiteit[]; schaduw: boolean; label: string;
  onKlik: () => void; onHover: (e: { currentTarget: HTMLElement }) => void; onWeg: () => void;
}) {
  const methode = regels.some((a) => a.bron === "methode");
  const docent = regels.some((a) => a.bron === "docent");
  return (
    <button onClick={onKlik} onMouseEnter={onHover} onMouseLeave={onWeg} onFocus={onHover} onBlur={onWeg} aria-label={label}
      className={`flex min-h-11 items-center justify-center gap-1 transition hover:bg-action-soft ${schaduw ? "bg-shade" : ""}`}>
      {regels.length > 0 && <Merk methode={methode} docent={docent} />}
      {regels.length > 1 && <span className="text-klein tabular-nums text-ink-soft">{regels.length}</span>}
    </button>
  );
}

export function Kaart({ alles, laatstBijgewerkt, nagelopen, naam, voegToe, bewerk, verwijder }: {
  alles: Activiteit[];
  laatstBijgewerkt: (kolom: string) => string | null;
  nagelopen: Record<string, Nagelopen>;
  naam: string;
  voegToe: (kolom: string, v: ActiviteitVelden) => void;
  bewerk: (id: string, v: ActiviteitVelden) => void;
  verwijder: (id: string) => void;
}) {
  const { school, titelVan, kolomVan, welkJaar, elkJaar } = useSchool();
  const [openKolom, setOpenKolom] = useState<string | null>(null);
  const [viaCode, setViaCode] = useState<string | null>(null);
  const [jaar, setJaar] = useState(0); // 0 = alle
  const [open, setOpen] = useState<string[]>([]);
  const [hover, setHover] = useState<{ code: string; kolom: string; regels: Activiteit[]; x: number; y: number } | null>(null);

  // Een record zonder bekend jaar blijft bij elk filter staan; de voetnoot zegt dat erbij.
  const inJaar = (a: Activiteit) => jaar === 0 || a.jaar === null || a.jaar === jaar;
  // "Doen we niet" blijft in het vakpaneel staan, maar telt niet op de kaart.
  const zichtbaar = alles.filter((a) => inJaar(a) && a.antwoord?.waarde !== "nee");
  const rijen = { gridTemplateColumns: `minmax(${LABEL_BREEDTE}px,1fr) repeat(${school.kolommen.length}, minmax(${KOLOM_BREEDTE}px, 1fr))` };
  const onbekendJaar = jaar > 0 && zichtbaar.some((a) => a.jaar === null);

  const toonHover = (e: { currentTarget: HTMLElement }, code: string, kolom: string, regels: Activiteit[]) => {
    if (!regels.length) return;
    const r = e.currentTarget.getBoundingClientRect();
    setHover({ code, kolom, regels, x: r.left + r.width / 2, y: r.bottom });
  };
  const celProps = (o: Onderdeel, k: { id: string; naam: string }, regels: Activiteit[], wat: string) => ({
    regels, schaduw: !nagelopen[k.id],
    label: regels.length ? `${k.naam}, ${wat}: ${regels.length === 1 ? "1 les" : `${regels.length} lessen`}` : `${k.naam}, ${wat}: ${nagelopen[k.id] ? "bevestigd, hier niets" : "nog niet bevestigd"}`,
    onKlik: () => { setViaCode(o.code); setOpenKolom(k.id); },
    onHover: (e: { currentTarget: HTMLElement }) => toonHover(e, o.code, k.id, regels),
    onWeg: () => setHover(null),
  });

  return (
    <main className="mx-auto max-w-breed px-6 py-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-titel">Kerndoelen per {school.kolomLabel}</h1>
        <div className="flex flex-wrap items-center gap-2">
          <span className="capitalize text-ink-soft">{school.jaarLabel}</span>
          {[0, ...school.jaren].map((j) => <Keuze key={j} aan={jaar === j} onClick={() => setJaar(j)}>{j === 0 ? "Alle" : j}</Keuze>)}
        </div>
      </div>

      <div className="overflow-x-auto rounded-kaart border border-line bg-surface">
        <div style={{ minWidth: LABEL_BREEDTE + school.kolommen.length * KOLOM_BREEDTE }}>
          <div className="grid items-stretch border-b border-line-strong" style={rijen}>
            <div className="sticky left-0 z-10 flex items-end bg-surface px-4 py-3 font-semibold">Onderdeel</div>
            {school.kolommen.map((k) => {
              const n = nagelopen[k.id]; const lb = laatstBijgewerkt(k.id);
              const uitleg = `${k.naam}. ${n ? `Bevestigd door ${n.door}, ${watGeleden(n.op)}.` : "Nog niet bevestigd."}${lb ? ` Laatst bijgewerkt ${watGeleden(lb)}.` : ""}`;
              return (
                <button key={k.id} onClick={() => setOpenKolom(k.id)} title={uitleg} aria-label={uitleg}
                  className={`px-1.5 py-2.5 text-center transition hover:bg-action-soft ${n ? "" : "bg-shade"}`}>
                  <span className="block font-semibold leading-tight">{k.naam}</span>
                  <span className="mt-0.5 block"><Datum iso={n?.op ?? null} /></span>
                </button>
              );
            })}
          </div>

          {school.kerndoelen.map((kd) => (
            <Fragment key={kd.nummer}>
              <div className="border-b border-line bg-ground">
                <div className="sticky left-0 inline-flex items-baseline gap-2.5 px-4 py-2.5">
                  <span className="font-bold">{kd.naam}</span>
                  <span className="text-klein text-ink-soft">Kerndoel {kd.nummer}</span>
                </div>
              </div>
              {kd.onderdelen.map((o) => {
                const isOpen = open.includes(o.code);
                const kanOpen = !!o.subdoelen?.length;
                const hier = zichtbaar.filter((a) => a.codes.includes(o.code));
                const zonderSubdoel = hier.filter((a) => !a.subdoelen?.some((s) => s.startsWith(`${o.code}.`)));
                return (
                  <Fragment key={o.code}>
                    <div className="grid border-b border-line-soft" style={rijen}>
                      <div className="sticky left-0 z-10 flex bg-surface">
                        {kanOpen ? (
                          <button onClick={() => setOpen(isOpen ? open.filter((c) => c !== o.code) : [...open, o.code])} aria-expanded={isOpen}
                            className="flex w-full items-center gap-2.5 px-4 py-2.5 text-left transition hover:text-action">
                            <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true" className={`shrink-0 text-ink-soft transition ${isOpen ? "rotate-90" : ""}`}><path d="M4 2 L8 6 L4 10" fill="none" stroke="currentColor" strokeWidth="1.6" /></svg>
                            <Code code={o.code} /><span>{o.titel}</span>
                          </button>
                        ) : (
                          <div className="flex items-center gap-2.5 px-4 py-2.5"><Code code={o.code} /><span>{o.titel}</span></div>
                        )}
                      </div>
                      {school.kolommen.map((k) => (
                        <Cel key={k.id} {...celProps(o, k, hier.filter((a) => a.kolom === k.id), o.titel)} />
                      ))}
                    </div>
                    {isOpen && o.subdoelen!.map((s) => (
                      <div key={s.code} className="grid border-b border-line-soft" style={rijen}>
                        <div title={s.volledig} className="sticky left-0 z-10 flex items-center bg-surface py-2 pl-[52px] pr-4 text-legenda text-ink-soft">{s.titel}</div>
                        {school.kolommen.map((k) => (
                          <Cel key={k.id} {...celProps(o, k, hier.filter((a) => a.kolom === k.id && a.subdoelen?.includes(s.code)), s.titel)} />
                        ))}
                      </div>
                    ))}
                    {isOpen && zonderSubdoel.length > 0 && (
                      <div className="grid border-b border-line-soft" style={rijen}>
                        <div className="sticky left-0 z-10 flex items-center bg-surface py-2 pl-[52px] pr-4 text-legenda text-ink-soft">Geen subdoel aangegeven</div>
                        {school.kolommen.map((k) => (
                          <Cel key={k.id} {...celProps(o, k, zonderSubdoel.filter((a) => a.kolom === k.id), "geen subdoel aangegeven")} />
                        ))}
                      </div>
                    )}
                  </Fragment>
                );
              })}
            </Fragment>
          ))}
        </div>
      </div>

      <div className="mt-3.5 flex flex-wrap items-center gap-x-6 gap-y-2 text-legenda text-ink-soft">
        <span className="inline-flex items-center gap-2"><Boek /> Uit de methode</span>
        <span className="inline-flex items-center gap-2"><Persoon /> Van een docent</span>
        <span className="inline-flex items-center gap-2"><span className="text-klein tabular-nums">3</span> Aantal lessen en projecten</span>
        <span className="inline-flex items-center gap-2"><span className="inline-block h-3.5 w-3.5 border border-line bg-shade" /> Nog niet bevestigd door een docent</span>
        <span className="inline-flex items-center gap-2"><span className="inline-block h-3.5 w-3.5 border border-line bg-surface" /> Leeg en bevestigd: hier gebeurt niets</span>
      </div>
      {onbekendJaar && (
        <p className="mt-2 max-w-regel text-legenda text-ink-soft">
          Van sommige methode-onderdelen is niet bekend in {welkJaar} ze vallen. Die blijven daarom bij {elkJaar} staan.
        </p>
      )}

      {hover && (
        <div className="pointer-events-none fixed z-40 w-[320px] -translate-x-1/2 rounded-kaartje border border-line bg-surface p-3 shadow-m"
             style={{ left: Math.min(Math.max(hover.x, 170), window.innerWidth - 170), top: hover.y + 6 }}>
          <div className="flex items-baseline gap-2 border-b border-line-soft pb-2">
            <Code code={hover.code} />
            <span className="font-semibold">{titelVan(hover.code)}</span>
            <span className="ml-auto text-klein text-ink-soft">{kolomVan(hover.kolom).naam}</span>
          </div>
          {hover.regels.map((a) => (
            <div key={a.id} className="mt-2 flex items-start gap-2">
              <span className="mt-0.5 shrink-0"><Merk methode={a.bron === "methode"} docent={a.bron === "docent"} /></span>
              <div>
                <div className="leading-snug">{a.titel}</div>
                <div className="text-klein text-ink-soft">{herkomst(a)}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {openKolom && (
        <VakPaneel kolom={kolomVan(openKolom)} regels={alles.filter((a) => a.kolom === openKolom)} laatst={laatstBijgewerkt(openKolom)} bevestigd={nagelopen[openKolom]} viaCode={viaCode} naam={naam}
                   onSluit={() => { setOpenKolom(null); setViaCode(null); }} setViaCode={setViaCode}
                   voegToe={voegToe} bewerk={bewerk} verwijder={verwijder} />
      )}
    </main>
  );
}
