import { useState } from "react";
import { ActiviteitFormulier } from "./ActiviteitFormulier";
import { useSchool } from "./SchoolContext";
import { watGeleden } from "./tijd";
import type { Activiteit, ActiviteitVelden, Kolom, MethodeAntwoord, Nagelopen } from "./types";
import { Code, herkomst, Knop, Merk } from "./ui";

/* Nalopen wat er al staat. Opluchting eerst: het scherm opent met wat al waar is, niet met
   een lijst van wat ontbreekt.
   "Klaar" markeert de kolom als bevestigd; daar leest de kaart zijn schaduw uit. */

const inputKlas = "rounded-md border border-rule bg-cream px-2.5 py-1 text-[12.5px] text-ink outline-none placeholder:text-ink-faint/70 focus:border-cobalt";

export function DocentModus({ kolom, methode, regels, naam, nagelopen, setKolom, voegToe, bewerk, beantwoord, klaar }: {
  kolom: Kolom; methode?: string; regels: Activiteit[]; naam: string; nagelopen?: Nagelopen;
  setKolom: (k: string) => void;
  voegToe: (kolom: string, v: ActiviteitVelden) => void;
  bewerk: (id: string, v: ActiviteitVelden) => void;
  beantwoord: (id: string, a: MethodeAntwoord["waarde"], door: string) => void;
  klaar: (door: string) => void;
}) {
  const { school, onderdelen, titelVan, jaarTekst } = useSchool();
  const [wie, setWie] = useState<string | null>(null);
  const [formulier, setFormulier] = useState(false);
  const [bezig, setBezig] = useState<Activiteit | null>(null);
  const [gaten, setGaten] = useState(false);
  const [ik, setIk] = useState(naam);
  const [naamNodig, setNaamNodig] = useState(false);

  const eigen = regels.filter((a) => a.bron === "docent");
  const uitMethode = regels.filter((a) => a.bron === "methode");
  const docenten = [...new Set([...school.docenten.filter((d) => d.kolom === kolom.id).map((d) => d.naam), ...eigen.map((a) => a.docent ?? a.door)])];
  const getoond = eigen.filter((a) => !wie || (a.docent ?? a.door) === wie);
  const geraakt = new Set(regels.filter((a) => a.antwoord?.waarde !== "nee").flatMap((a) => a.codes));
  const ontbreekt = onderdelen.filter((o) => !geraakt.has(o.code));
  const wat = (a: Activiteit) => `${a.codes.map(titelVan).join(", ")}, ${a.jaar === null ? `${school.jaarLabel} niet bekend` : jaarTekst(a.jaar)}`;
  const metNaam = (doe: (door: string) => void) => () => {
    if (!ik.trim()) { setNaamNodig(true); return; }
    setNaamNodig(false); doe(ik.trim());
  };

  return (
    <main className="mx-auto max-w-[720px] px-4 py-6">
      <label className="flex items-center gap-2 text-[12.5px] text-ink-faint">
        {school.kolomLabel}
        <select value={kolom.id} onChange={(e) => setKolom(e.target.value)} aria-label={`Kies een ${school.kolomLabel}`}
          className="rounded-md border border-rule bg-cream px-2 py-1 text-[12.5px] text-ink outline-none focus:border-cobalt">
          {school.kolommen.map((k) => <option key={k.id} value={k.id}>{k.naam}</option>)}
        </select>
      </label>
      <h1 className="mt-3 font-display text-[21px] font-bold tracking-tight text-ink">{kolom.naam}</h1>
      <p className="mt-1">
        {regels.length ? "Dit staat er al. Klopt het zo?" : "Hier staat nog niets. Vul in wat je doet, of zeg dat het klaar is als hier niets gebeurt."}
        {nagelopen && <span className="text-ink-faint"> Bevestigd door {nagelopen.door}, {watGeleden(nagelopen.op)}.</span>}
      </p>

      {uitMethode.length > 0 && (
        <section className="mt-5">
          <h2 className="font-medium text-ink">Uit {methode}</h2>
          <div className="mt-1.5 divide-y divide-rule/70 rounded-lg border border-rule bg-cream">
            {uitMethode.map((a) => (
              <div key={a.id} className="flex flex-wrap items-center gap-x-2.5 gap-y-1.5 px-3 py-2">
                <Merk methode docent={false} />
                <div className="min-w-0 flex-1 basis-[260px]">
                  <div className={a.antwoord?.waarde === "nee" ? "text-ink-faint line-through" : "text-ink"}>{a.titel}</div>
                  <div className="text-[12px] text-ink-faint">{wat(a)}. {herkomst(a)}</div>
                </div>
                {(["ja", "nee"] as const).map((w) => (
                  <button key={w} onClick={metNaam((d) => beantwoord(a.id, w, d))} aria-pressed={a.antwoord?.waarde === w}
                    className={`rounded-md px-2 py-0.5 text-[12px] transition ${a.antwoord?.waarde === w ? "bg-cobalt text-cream" : "border border-rule text-ink-soft hover:border-ink-faint"}`}>
                    {w === "ja" ? "We doen dit" : "Doen we niet"}
                  </button>
                ))}
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="mt-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="font-medium text-ink">Eigen lessen</h2>
          {docenten.length > 1 && (
            <div className="flex flex-wrap gap-1">
              {[null, ...docenten].map((n) => (
                <button key={n ?? "iedereen"} onClick={() => setWie(n)} aria-pressed={wie === n}
                  className={`rounded-md px-2 py-0.5 text-[12px] ${wie === n ? "bg-cobalt-soft text-cobalt-deep" : "text-ink-soft hover:text-ink"}`}>{n ?? "Iedereen"}</button>
              ))}
            </div>
          )}
        </div>
        <div className="mt-1.5 divide-y divide-rule/70 rounded-lg border border-rule bg-cream">
          {getoond.map((a) => (
            <div key={a.id} className="flex items-start gap-2.5 px-3 py-2">
              <span className="mt-1"><Merk methode={false} docent /></span>
              <div className="min-w-0 flex-1">
                <div className="text-ink">{a.titel}</div>
                <div className="text-[12px] text-ink-faint">{wat(a)}. {herkomst(a)}</div>
              </div>
              <button onClick={() => { setBezig(a); setFormulier(true); }} className="shrink-0 text-[12px] text-ink-faint hover:text-cobalt">bewerk</button>
            </div>
          ))}
          <div className="p-2.5">
            {formulier ? (
              <ActiviteitFormulier
                key={bezig?.id ?? "nieuw"}
                kop={bezig ? "bewerken" : "les toevoegen"}
                begin={bezig ?? undefined} bewerken={!!bezig}
                naam={ik} kolomId={kolom.id} toonCodes={false}
                onOpslaan={(v) => { setIk(v.door); if (bezig) { bewerk(bezig.id, v); setBezig(null); } else voegToe(kolom.id, v); setFormulier(false); }}
                onAnnuleer={() => { setBezig(null); setFormulier(false); }}
              />
            ) : (
              <button onClick={() => setFormulier(true)} className="w-full rounded-md border border-rule px-2.5 py-1.5 text-left text-[12.5px] text-cobalt hover:border-cobalt">Les toevoegen</button>
            )}
          </div>
        </div>
      </section>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <Knop onClick={metNaam(klaar)}>Klaar, dit klopt</Knop>
        <button onClick={() => setGaten(!gaten)} aria-expanded={gaten} className="text-[12.5px] text-cobalt hover:text-cobalt-deep">
          {gaten ? "Verberg wat er nog niet staat" : `Wat staat er nog niet bij ${kolom.naam}?`}
        </button>
      </div>
      {(naamNodig || !ik.trim()) && (
        <div className="mt-2 flex items-center gap-2 text-[12.5px]">
          <label htmlFor="ik" className={naamNodig ? "text-ink" : "text-ink-faint"}>{naamNodig ? "Vul eerst je naam in:" : "Je naam:"}</label>
          <input id="ik" value={ik} onChange={(e) => setIk(e.target.value)} placeholder="Je naam" className={`w-40 ${inputKlas}`} />
        </div>
      )}

      {gaten && (
        <section className="mt-4">
          <p className="text-[12.5px] text-ink-faint">Niet per se een probleem. Een ander {school.kolomLabel} pakt dit misschien al op.</p>
          <div className="mt-2 divide-y divide-rule/70 rounded-lg border border-rule bg-cream">
            {ontbreekt.map((o) => (
              <div key={o.code} className="px-3 py-2">
                <div className="flex items-baseline gap-2"><Code code={o.code} /><span className="text-ink">{o.titel}</span></div>
                {school.suggesties?.[o.code] && <p className="mt-0.5 text-[12.5px] text-ink-faint">Idee: {school.suggesties[o.code]}</p>}
              </div>
            ))}
            {ontbreekt.length === 0 && <p className="px-3 py-2 text-ink-faint">Alle onderdelen staan hier al.</p>}
          </div>
        </section>
      )}
    </main>
  );
}
