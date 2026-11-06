import { useState } from "react";
import { useSchool } from "./SchoolContext";
import type { ActiviteitVelden, Status } from "./types";
import { Knop, Label } from "./ui";

/* Eén formulier voor toevoegen en bewerken, overal hetzelfde. Verplicht: titel, jaar,
   minstens één onderdeel, naam. De rest zit achter "Meer invullen": toevoegen moet
   voelen als een briefje schrijven. Er is bewust geen standaardjaar: een
   stilzwijgend "leerjaar 1" levert foute data op die niemand ziet. */

export function ActiviteitFormulier({ kop, begin, bewerken, naam, kolomId, toonCodes, onOpslaan, onAnnuleer }: {
  kop: string;
  begin?: Partial<ActiviteitVelden>;
  bewerken?: boolean;
  naam: string;
  kolomId: string;
  toonCodes: boolean; // docenten kiezen op titel; de code is geen invoer
  onOpslaan: (v: ActiviteitVelden) => void;
  onAnnuleer?: () => void;
}) {
  const { school, onderdelen } = useSchool();
  const [titel, setTitel] = useState(begin?.titel ?? "");
  const [jaar, setJaar] = useState<number | null>(begin?.jaar ?? null);
  const [codes, setCodes] = useState<string[]>(begin?.codes ?? []);
  const [subdoelen, setSubdoelen] = useState<string[]>(begin?.subdoelen ?? []);
  const [uitleg, setUitleg] = useState(begin?.toelichting ?? "");
  const [inLeerlijn, setInLeerlijn] = useState(begin?.inLeerlijn ?? false);
  const [status, setStatus] = useState<Status>(begin?.status ?? "gepland");
  const [door, setDoor] = useState(naam);
  const [geprobeerd, setGeprobeerd] = useState(false);
  const [meer, setMeer] = useState(!!(begin?.subdoelen?.length || begin?.toelichting || begin?.inLeerlijn));

  const mist = [
    !titel.trim() && "een titel",
    jaar === null && `een ${school.jaarLabel}`,
    !codes.length && "minstens één onderdeel",
    !door.trim() && "je naam",
  ].filter(Boolean) as string[];

  const wissel = (l: string[], c: string) => (l.includes(c) ? l.filter((x) => x !== c) : [...l, c]);
  const kiesCode = (c: string) => {
    setCodes((l) => wissel(l, c));
    setSubdoelen((l) => l.filter((s) => !s.startsWith(`${c}.`) || !codes.includes(c)));
  };
  const opslaan = () => {
    if (mist.length) { setGeprobeerd(true); return; }
    onOpslaan({
      titel: titel.trim(), jaar, codes, door: door.trim(), toelichting: uitleg.trim() || undefined,
      subdoelen: subdoelen.length ? subdoelen : undefined,
      inLeerlijn, status: inLeerlijn ? status : undefined,
    });
    if (!bewerken) { setTitel(""); setJaar(null); setCodes([]); setSubdoelen([]); setUitleg(""); setInLeerlijn(false); setMeer(false); }
    setGeprobeerd(false);
  };
  const namen = [...new Set(school.docenten.filter((d) => d.kolom === kolomId).map((d) => d.naam))];
  const gekozenMetSubdoelen = onderdelen.filter((o) => codes.includes(o.code) && o.subdoelen?.length);

  return (
    <div>
      <Label>{kop}</Label>
      <input value={titel} onChange={(e) => setTitel(e.target.value)} aria-label="Titel" placeholder="Wat doe je? Bijv. 'Debat over AI en werk'"
             className="mt-1.5 w-full rounded-md border border-rule bg-cream px-2.5 py-1.5 text-[13px] text-ink outline-none placeholder:text-ink-faint/70 focus:border-cobalt" />
      <div className="mt-2 flex flex-wrap items-center gap-1.5">
        <Label>{school.jaarLabel}</Label>
        {school.jaren.map((j) => (
          <button key={j} onClick={() => setJaar(j)} aria-pressed={jaar === j} aria-label={`${school.jaarLabel} ${j}`}
            className={`h-6 w-6 rounded-md font-mono text-[11px] transition ${jaar === j ? "bg-cobalt text-cream" : "border border-rule bg-cream text-ink-soft hover:border-ink-faint"}`}>{j}</button>
        ))}
      </div>
      <div className="mt-2"><Label>raakt</Label>
        <div className="mt-1 flex flex-wrap gap-1">
          {onderdelen.map((o) => (
            <button key={o.code} onClick={() => kiesCode(o.code)} title={o.titel} aria-pressed={codes.includes(o.code)}
              className={`rounded-md px-1.5 py-0.5 text-left text-[11.5px] transition ${codes.includes(o.code) ? "bg-sage-deep text-cream" : "border border-rule bg-cream text-ink-soft hover:border-ink-faint"}`}>
              {toonCodes && <span className="font-mono text-[10px]">{o.code} </span>}{o.titel}
            </button>
          ))}
        </div>
      </div>
      <div className="mt-2 flex items-center gap-2">
        <Label>ingevoerd door</Label>
        <input value={door} onChange={(e) => setDoor(e.target.value)} list={`namen-${kolomId}`} aria-label="Je naam" placeholder="Je naam"
               className="w-40 rounded-md border border-rule bg-cream px-2.5 py-1 text-[12.5px] text-ink outline-none placeholder:text-ink-faint/70 focus:border-cobalt" />
        <datalist id={`namen-${kolomId}`}>{namen.map((n) => <option key={n} value={n} />)}</datalist>
      </div>

      {meer ? (
        <div className="mt-2 space-y-2 border-l-2 border-rule pl-2.5">
          {gekozenMetSubdoelen.map((o) => (
            <div key={o.code}>
              <Label>welk deel van {o.titel.toLowerCase()}? (optioneel)</Label>
              <div className="mt-1 flex flex-wrap gap-1">
                {o.subdoelen!.map((s) => (
                  <button key={s.code} onClick={() => setSubdoelen((l) => wissel(l, s.code))} title={s.volledig} aria-pressed={subdoelen.includes(s.code)}
                    className={`rounded-md px-1.5 py-0.5 text-left text-[11.5px] transition ${subdoelen.includes(s.code) ? "bg-sage-deep text-cream" : "border border-rule bg-cream text-ink-soft hover:border-ink-faint"}`}>
                    {s.titel}
                  </button>
                ))}
              </div>
            </div>
          ))}
          <input value={uitleg} onChange={(e) => setUitleg(e.target.value)} aria-label="Toelichting" placeholder="Korte toelichting: wat doen leerlingen precies?"
                 className="w-full rounded-md border border-rule bg-cream px-2.5 py-1.5 text-[12.5px] text-ink outline-none placeholder:text-ink-faint/70 focus:border-cobalt" />
          <div className="flex flex-wrap items-center gap-3">
            <label className="inline-flex items-center gap-1.5 text-[12.5px] text-ink">
              <input type="checkbox" checked={inLeerlijn} onChange={(e) => setInLeerlijn(e.target.checked)} className="accent-[#1D4AE5]" />
              Hoort bij de afgesproken leerlijn
            </label>
            {inLeerlijn && (["gepland", "gegeven"] as const).map((s) => (
              <label key={s} className="inline-flex items-center gap-1 text-[12.5px] text-ink-soft">
                <input type="radio" name={`status-${kolomId}`} checked={status === s} onChange={() => setStatus(s)} className="accent-[#1D4AE5]" />{s}
              </label>
            ))}
          </div>
        </div>
      ) : (
        <button onClick={() => setMeer(true)} className="mt-2 text-[12.5px] text-cobalt hover:text-cobalt-deep">Meer invullen</button>
      )}

      <div className="mt-2.5 flex flex-wrap items-center gap-2">
        <Knop klein onClick={opslaan}>{bewerken ? "Opslaan" : "Toevoegen"}</Knop>
        {onAnnuleer && <Knop klein soort="stil" onClick={onAnnuleer}>Annuleren</Knop>}
        {geprobeerd && mist.length > 0 && <span role="status" className="text-[12px] text-ink-soft">Nog nodig: {mist.join(", ")}.</span>}
      </div>
    </div>
  );
}
