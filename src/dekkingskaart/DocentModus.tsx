import { useState } from "react";
import { ActiviteitFormulier } from "./ActiviteitFormulier";
import { useSchool } from "./SchoolContext";
import { watGeleden } from "./tijd";
import type { Activiteit, ActiviteitVelden, Kolom, MethodeAntwoord, Nagelopen } from "./types";
import { Code, herkomst, Keuze, Keuzelijst, Knop, LijstRegel, Veld } from "./ui";

/* Nalopen wat er al staat. Opluchting eerst: het scherm opent met wat al waar is, niet met
   een lijst van wat ontbreekt. "Klaar" markeert de kolom als bevestigd; daar leest de kaart
   zijn schaduw uit. */

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
  const details = (a: Activiteit) => `${a.codes.map(titelVan).join(", ")}, ${a.jaar === null ? `${school.jaarLabel} niet bekend` : jaarTekst(a.jaar)}. ${herkomst(a)}`;
  const metNaam = (doe: (door: string) => void) => () => {
    if (!ik.trim()) { setNaamNodig(true); return; }
    setNaamNodig(false); doe(ik.trim());
  };

  return (
    <main className="mx-auto max-w-smal px-6 py-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-titel">{kolom.naam}</h1>
        <div className="w-56">
          <Keuzelijst label={`Kies een ${school.kolomLabel}`} verborgenLabel value={kolom.id} onChange={setKolom}
            opties={school.kolommen.map((k) => ({ waarde: k.id, tekst: k.naam }))} />
        </div>
      </div>
      <p className="mt-1.5">
        {regels.length ? "Dit staat er al. Klopt het zo?" : "Hier staat nog niets. Vul in wat je doet, of zeg dat het klaar is als hier niets gebeurt."}
        {nagelopen && <span className="text-ink-soft"> Bevestigd door {nagelopen.door}, {watGeleden(nagelopen.op)}.</span>}
      </p>

      {uitMethode.length > 0 && (
        <section className="mt-6">
          <h2 className="text-kop">Uit {methode}</h2>
          <div className="mt-2 divide-y divide-line-soft rounded-kaart border border-line bg-surface">
            {uitMethode.map((a) => (
              <LijstRegel key={a.id} a={a} details={details(a)} acties={(["ja", "nee"] as const).map((w) => (
                <Keuze key={w} aan={a.antwoord?.waarde === w} onClick={metNaam((d) => beantwoord(a.id, w, d))}>{w === "ja" ? "We doen dit" : "Doen we niet"}</Keuze>
              ))} />
            ))}
          </div>
        </section>
      )}

      <section className="mt-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-kop">Eigen lessen</h2>
          {docenten.length > 1 && (
            <div className="flex flex-wrap gap-2">
              {[null, ...docenten].map((n) => <Keuze key={n ?? "iedereen"} aan={wie === n} onClick={() => setWie(n)}>{n ?? "Iedereen"}</Keuze>)}
            </div>
          )}
        </div>
        <div className="mt-2 divide-y divide-line-soft rounded-kaart border border-line bg-surface">
          {getoond.map((a) => (
            <LijstRegel key={a.id} a={a} details={details(a)} acties={<Knop soort="stil" onClick={() => { setBezig(a); setFormulier(true); }}>Bewerken</Knop>} />
          ))}
          <div className="p-4">
            {formulier ? (
              <ActiviteitFormulier
                key={bezig?.id ?? "nieuw"}
                kop={bezig ? "Les bewerken" : "Les toevoegen"}
                begin={bezig ?? undefined} bewerken={!!bezig}
                naam={ik} kolomId={kolom.id} toonCodes={false}
                onOpslaan={(v) => { setIk(v.door); if (bezig) { bewerk(bezig.id, v); setBezig(null); } else voegToe(kolom.id, v); setFormulier(false); }}
                onAnnuleer={() => { setBezig(null); setFormulier(false); }}
              />
            ) : (
              <Knop soort="tweede" onClick={() => setFormulier(true)}>Les toevoegen</Knop>
            )}
          </div>
        </div>
      </section>

      {naamNodig && (
        <div className="mt-5 max-w-[280px]">
          <Veld label="Vul eerst je naam in" value={ik} onChange={setIk} placeholder="Je naam" />
        </div>
      )}
      <div className="mt-5 flex flex-wrap items-center gap-3">
        <Knop onClick={metNaam(klaar)}>Klaar, dit klopt</Knop>
        <Knop soort="stil" onClick={() => setGaten(!gaten)}>{gaten ? "Verberg wat er nog niet staat" : `Wat staat er nog niet bij ${kolom.naam}?`}</Knop>
      </div>

      {gaten && (
        <section className="mt-4">
          <p className="text-ink-soft">Niet per se een probleem. Een ander {school.kolomLabel} pakt dit misschien al op.</p>
          <div className="mt-2 divide-y divide-line-soft rounded-kaart border border-line bg-surface">
            {ontbreekt.map((o) => (
              <div key={o.code} className="px-4 py-3">
                <div className="flex items-baseline gap-2.5"><Code code={o.code} /><span>{o.titel}</span></div>
                {school.suggesties?.[o.code] && <p className="mt-0.5 text-klein text-ink-soft">Idee: {school.suggesties[o.code]}</p>}
              </div>
            ))}
            {ontbreekt.length === 0 && <p className="px-4 py-3 text-ink-soft">Alle onderdelen staan hier al.</p>}
          </div>
        </section>
      )}
    </main>
  );
}
