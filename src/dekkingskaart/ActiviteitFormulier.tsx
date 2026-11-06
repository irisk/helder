import { useState, type ReactNode } from "react";
import { useSchool } from "./SchoolContext";
import type { ActiviteitVelden, Status } from "./types";
import { Keuze, Knop, Veld } from "./ui";

/* Eén formulier voor toevoegen en bewerken, overal hetzelfde. Verplicht: titel, jaar,
   minstens één onderdeel, naam. De rest zit achter "Meer invullen": toevoegen moet
   voelen als een briefje schrijven. Er is bewust geen standaardjaar: een stilzwijgend
   "leerjaar 1" levert foute data op die niemand ziet. */

export function ActiviteitFormulier({ kop, boven, begin, bewerken, naam, kolomId, toonCodes, onOpslaan, onAnnuleer }: {
  kop: string;
  boven?: ReactNode; // extra veld direct onder de kop

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
    <div className="space-y-3.5">
      <h3 className="font-bold">{kop}</h3>
      {boven}
      <Veld label="Titel" value={titel} onChange={setTitel} placeholder="Bijv. Debat over AI en werk" />
      <div>
        <div className="mb-1.5 font-semibold capitalize">{school.jaarLabel}</div>
        <div className="flex flex-wrap gap-2">
          {school.jaren.map((j) => <Keuze key={j} aan={jaar === j} onClick={() => setJaar(j)} label={`${school.jaarLabel} ${j}`}>{j}</Keuze>)}
        </div>
      </div>
      <div>
        <div className="mb-1.5 font-semibold">Gaat over</div>
        <div className="flex flex-wrap gap-2">
          {onderdelen.map((o) => (
            <Keuze key={o.code} aan={codes.includes(o.code)} onClick={() => kiesCode(o.code)} titel={o.titel}>
              {toonCodes && <span className="text-klein">{o.code} </span>}{o.titel}
            </Keuze>
          ))}
        </div>
      </div>
      <Veld label="Ingevuld door" value={door} onChange={setDoor} list={`namen-${kolomId}`} placeholder="Je naam" />
      <datalist id={`namen-${kolomId}`}>{namen.map((n) => <option key={n} value={n} />)}</datalist>

      {meer ? (
        <div className="space-y-3.5">
          {gekozenMetSubdoelen.map((o) => (
            <div key={o.code}>
              <div className="mb-1.5 font-semibold">Welk subdoel van {o.titel.toLowerCase()}? (optioneel)</div>
              <div className="flex flex-wrap gap-2">
                {o.subdoelen!.map((s) => <Keuze key={s.code} aan={subdoelen.includes(s.code)} onClick={() => setSubdoelen((l) => wissel(l, s.code))} titel={s.volledig}>{s.titel}</Keuze>)}
              </div>
            </div>
          ))}
          <Veld label="Toelichting" value={uitleg} onChange={setUitleg} placeholder="Wat doen leerlingen precies?" />
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <label className="inline-flex items-center gap-2">
              <input type="checkbox" checked={inLeerlijn} onChange={(e) => setInLeerlijn(e.target.checked)} />
              Hoort bij de afgesproken leerlijn
            </label>
            {inLeerlijn && (["gepland", "gegeven"] as const).map((s) => (
              <label key={s} className="inline-flex items-center gap-2 capitalize">
                <input type="radio" name={`status-${kolomId}`} checked={status === s} onChange={() => setStatus(s)} />{s}
              </label>
            ))}
          </div>
        </div>
      ) : (
        <Knop soort="stil" onClick={() => setMeer(true)}>Meer invullen</Knop>
      )}

      <div className="flex flex-wrap items-center gap-2">
        <Knop onClick={opslaan}>{bewerken ? "Opslaan" : "Toevoegen"}</Knop>
        {onAnnuleer && <Knop soort="stil" onClick={onAnnuleer}>Annuleren</Knop>}
        {geprobeerd && mist.length > 0 && <span role="status" className="text-ink-soft">Nog nodig: {mist.join(", ")}.</span>}
      </div>
    </div>
  );
}
