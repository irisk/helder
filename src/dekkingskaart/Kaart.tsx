import { Fragment, useState } from "react";
import { useSchool } from "./SchoolContext";
import { versheid, watGeleden } from "./tijd";
import type { Activiteit, ActiviteitVelden, Nagelopen, Onderdeel } from "./types";
import { Code, herkomst, Label, Merk } from "./ui";
import { VakPaneel } from "./VakPaneel";

const KOLOM_BREEDTE = 64;
const LABEL_BREEDTE = 300;

function Cel({ regels, schaduw, klein, label, onKlik, onHover, onWeg }: {
  regels: Activiteit[]; schaduw: boolean; klein?: boolean; label: string;
  onKlik: () => void; onHover: (e: { currentTarget: HTMLElement }) => void; onWeg: () => void;
}) {
  const methode = regels.some((a) => a.bron === "methode");
  const docent = regels.some((a) => a.bron === "docent");
  return (
    <button onClick={onKlik} onMouseEnter={onHover} onMouseLeave={onWeg} onFocus={onHover} onBlur={onWeg} aria-label={label}
      className={`flex items-center justify-center gap-[3px] transition hover:bg-cobalt-soft/40 ${klein ? "min-h-6" : "min-h-8"} ${schaduw ? "bg-wash" : ""}`}>
      {regels.length > 0 && <Merk methode={methode} docent={docent} />}
      {regels.length > 1 && <span className="font-mono text-[10px] text-ink-soft">{regels.length}</span>}
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
    <main className="mx-auto max-w-[1400px] px-4 py-5">
      <h1 className="font-display text-[19px] font-bold tracking-tight text-ink">Kerndoelen per {school.kolomLabel}</h1>
      <div className="mb-3 mt-3 flex items-center gap-1.5">
        <Label>{school.jaarLabel}</Label>
        {[0, ...school.jaren].map((j) => (
          <button key={j} onClick={() => setJaar(j)} aria-pressed={jaar === j}
            className={`rounded-md px-2 py-0.5 font-mono text-[11px] transition ${jaar === j ? "bg-cobalt text-cream" : "border border-rule bg-cream text-ink-soft hover:border-ink-faint"}`}>
            {j === 0 ? "alle" : j}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto rounded-lg border border-rule bg-cream">
        <div style={{ minWidth: LABEL_BREEDTE + school.kolommen.length * KOLOM_BREEDTE }}>
          <div className="grid items-stretch border-b border-rule" style={rijen}>
            <div className="sticky left-0 z-10 flex items-end bg-cream px-3 py-2"><Label>kerndoelonderdeel</Label></div>
            {school.kolommen.map((k) => {
              const n = nagelopen[k.id]; const lb = laatstBijgewerkt(k.id); const oud = n && versheid(n.op) === "verouderd";
              const uitleg = `${k.naam}. ${n ? `Bevestigd door ${n.door}, ${watGeleden(n.op)}.` : "Nog niet bevestigd."}${lb ? ` Laatst bijgewerkt ${watGeleden(lb)}.` : ""}`;
              return (
                <button key={k.id} onClick={() => setOpenKolom(k.id)} title={uitleg} aria-label={uitleg}
                  className={`px-1 py-2 text-center transition hover:bg-cobalt-soft/40 ${n ? "" : "bg-wash"}`}>
                  <div className="font-mono text-[11px] font-medium tracking-wide text-ink">{k.afk}</div>
                  <div className={`mt-0.5 font-mono text-[9.5px] leading-tight ${oud ? "font-medium text-ink" : "text-ink-faint"}`}>
                    {oud && <span className="mr-1 inline-block h-1.5 w-1.5 rounded-full bg-yellow align-middle" />}
                    {n ? watGeleden(n.op).replace(" geleden", "") : "nog niet"}
                  </div>
                </button>
              );
            })}
          </div>

          {school.kerndoelen.map((kd) => (
            <Fragment key={kd.nummer}>
              <div className="border-b border-rule bg-offwhite">
                <div className="sticky left-0 inline-flex items-baseline gap-2 px-3 py-1.5">
                  <span className="font-medium text-ink">{kd.naam}</span>
                  {kd.lens && <span className="font-serif text-[12px] italic text-ink-faint">{kd.lens}</span>}
                  <Code code={`kerndoel ${kd.nummer}`} />
                </div>
              </div>
              {kd.onderdelen.map((o) => {
                const isOpen = open.includes(o.code);
                const kanOpen = !!o.subdoelen?.length;
                const hier = zichtbaar.filter((a) => a.codes.includes(o.code));
                const zonderSubdoel = hier.filter((a) => !a.subdoelen?.some((s) => s.startsWith(`${o.code}.`)));
                return (
                  <Fragment key={o.code}>
                    <div className="grid border-b border-rule/60" style={rijen}>
                      <div className="sticky left-0 z-10 bg-cream">
                        {kanOpen ? (
                          <button onClick={() => setOpen(isOpen ? open.filter((c) => c !== o.code) : [...open, o.code])} aria-expanded={isOpen}
                            className="flex w-full items-baseline gap-2 px-3 py-1.5 text-left text-ink hover:text-cobalt">
                            <span className="w-2.5 shrink-0 text-[10px] text-ink-faint">{isOpen ? "▾" : "▸"}</span>
                            <Code code={o.code} /><span>{o.titel}</span>
                          </button>
                        ) : (
                          <div className="flex items-baseline gap-2 px-3 py-1.5 text-ink"><Code code={o.code} /><span>{o.titel}</span></div>
                        )}
                      </div>
                      {school.kolommen.map((k) => (
                        <Cel key={k.id} {...celProps(o, k, hier.filter((a) => a.kolom === k.id), o.titel)} />
                      ))}
                    </div>
                    {isOpen && o.subdoelen!.map((s) => (
                      <div key={s.code} className="grid border-b border-rule/40" style={rijen}>
                        <div title={s.volledig} className="sticky left-0 z-10 bg-offwhite py-1 pl-[46px] pr-3 text-[12.5px] text-ink-soft">{s.titel}</div>
                        {school.kolommen.map((k) => (
                          <Cel key={k.id} klein {...celProps(o, k, hier.filter((a) => a.kolom === k.id && a.subdoelen?.includes(s.code)), s.titel)} />
                        ))}
                      </div>
                    ))}
                    {isOpen && zonderSubdoel.length > 0 && (
                      <div className="grid border-b border-rule/40" style={rijen}>
                        <div className="sticky left-0 z-10 bg-offwhite py-1 pl-[46px] pr-3 text-[12.5px] italic text-ink-faint">Geen subdoel aangegeven</div>
                        {school.kolommen.map((k) => (
                          <Cel key={k.id} klein {...celProps(o, k, zonderSubdoel.filter((a) => a.kolom === k.id), "geen subdoel aangegeven")} />
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

      {onbekendJaar && (
        <p className="mt-2 max-w-[72ch] text-[12px] text-ink-faint">
          Van sommige methode-onderdelen is niet bekend in {welkJaar} ze vallen. Die blijven daarom bij {elkJaar} staan.
        </p>
      )}
      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[12px] text-ink-faint">
        <span className="inline-flex items-center gap-1.5"><Merk methode docent={false} /> uit de methode</span>
        <span className="inline-flex items-center gap-1.5"><Merk methode={false} docent /> van een docent</span>
        <span className="inline-flex items-center gap-1.5"><span className="font-mono text-[10px] text-ink-soft">3</span> aantal lessen en projecten</span>
        <span className="inline-flex items-center gap-1.5"><span className="inline-block h-3 w-3 bg-wash" /> {school.kolomLabel} nog niet bevestigd door een docent</span>
        <span className="inline-flex items-center gap-1.5"><span className="inline-block h-3 w-3 border border-rule bg-cream" /> leeg en bevestigd: hier gebeurt niets</span>
      </div>
      <p className="mt-1.5 text-[12px] text-ink-faint">Onder elk {school.kolomLabel} staat wanneer het voor het laatst is bevestigd. Alles op deze kaart is opgegeven door collega's.</p>

      {hover && (
        <div className="pointer-events-none fixed z-40 w-[300px] -translate-x-1/2 rounded-lg border border-rule bg-cream p-2.5 shadow-m"
             style={{ left: Math.min(Math.max(hover.x, 160), window.innerWidth - 160), top: hover.y + 6 }}>
          <div className="flex items-baseline gap-1.5 border-b border-rule pb-1.5">
            <Code code={hover.code} />
            <span className="text-[12px] font-medium text-ink">{titelVan(hover.code)}</span>
            <span className="ml-auto font-mono text-[10px] text-ink-faint">{kolomVan(hover.kolom).naam}</span>
          </div>
          {hover.regels.map((a) => (
            <div key={a.id} className="mt-1.5 flex items-start gap-1.5">
              <span className="mt-1 shrink-0"><Merk methode={a.bron === "methode"} docent={a.bron === "docent"} /></span>
              <div>
                <div className="text-[12px] leading-snug text-ink">{a.titel}</div>
                <div className="font-mono text-[9.5px] text-ink-faint">{herkomst(a)}</div>
              </div>
            </div>
          ))}
          <div className="mt-1.5 border-t border-rule pt-1 font-mono text-[9.5px] text-ink-faint">klik voor de toelichting</div>
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
