import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { Collegas } from "../dekkingskaart/Collegas";
import { DocentModus } from "../dekkingskaart/DocentModus";
import { Kaart } from "../dekkingskaart/Kaart";
import { Leerlijn } from "../dekkingskaart/Leerlijn";
import { Opzet } from "../dekkingskaart/Opzet";
import { SchoolProvider, useSchool } from "../dekkingskaart/SchoolContext";
import { schoolMetId } from "../dekkingskaart/scholen";
import { schooljaarVan, vandaagISO } from "../dekkingskaart/tijd";
import type { Activiteit, ActiviteitVelden, MethodeAntwoord, Nagelopen, SchoolConfig } from "../dekkingskaart/types";
import { Label } from "../dekkingskaart/ui";

/* ============================================================================
   Helder: de kerndoelen dekkingskaart
   ----------------------------------------------------------------------------
   Drie beslissingen die alles sturen:

   1. HET ATOOM IS EEN ACTIVITEIT, geen cel. De kaart, de tellingen en de panelen
      zijn VIEWS over dezelfde lijst records.
   2. HET IS EEN KAART, GEEN SCORE. Geen percentages, geen voortgangsbalk. Een leeg
      gebied is niet een fout, het is nog niet bezocht.
   3. VEROUDERING IS ZICHTBAAR. Elk record heeft een datum.

   Alles wat per school verschilt staat in een SchoolConfig (dekkingskaart/scholen).
   ========================================================================== */

type Scherm = "opzet" | "kaart" | "leerlijn" | "uitnodigen" | "docent";

export function Dekkingskaart() {
  const { schoolId } = useParams();
  const school = schoolMetId(schoolId);
  if (!school) {
    return (
      <main className="mx-auto max-w-[760px] px-4 py-16 text-ink-soft">
        <h1 className="font-display text-[22px] font-bold tracking-tight text-ink">Deze school bestaat hier niet</h1>
        <p className="mt-2"><a href="/" className="text-cobalt hover:text-cobalt-deep">Naar het voorbeeld</a></p>
      </main>
    );
  }
  // key: een andere school begint met schone state
  return <SchoolProvider key={school.id} school={school}><App school={school} /></SchoolProvider>;
}

function App({ school }: { school: SchoolConfig }) {
  const { titelVan, kolomVan } = useSchool();
  const [scherm, setScherm] = useState<Scherm>("opzet");
  const [methode, setMethode] = useState<Record<string, string>>(
    () => Object.fromEntries(school.kolommen.filter((k) => k.methodes.length).map((k) => [k.id, k.methodes[0]]))
  );
  const [activiteiten, setActiviteiten] = useState<Activiteit[]>(school.activiteiten);
  const [nagelopen, setNagelopen] = useState<Record<string, Nagelopen>>(school.nagelopen ?? {});
  const [antwoorden, setAntwoorden] = useState<Record<string, MethodeAntwoord>>({});
  const [naam, setNaam] = useState(""); // wie er nu aan het invoeren is
  const [docentKolom, setDocentKolom] = useState(school.kolommen[0].id);

  // methode-dekking als virtuele activiteiten: alles is één soort record
  const alles: Activiteit[] = useMemo(() => {
    const uitMethode: Activiteit[] = school.kolommen.flatMap((k) => {
      const m = methode[k.id];
      return (school.methodeDekking[m] ?? []).map((d, i): Activiteit => {
        const id = `m-${m}-${d.code}-${i}`;
        const antwoord = antwoorden[id];
        return {
          id,
          titel: d.titel ?? `${m}: hoofdstuk over ${titelVan(d.code).toLowerCase()}`,
          kolom: k.id, jaar: d.jaar, codes: [d.code], bron: "methode", door: m, op: "",
          bronNotitie: d.bron, toelichting: d.toelichting, antwoord,
          inLeerlijn: d.inLeerlijn || antwoord?.waarde === "ja", status: d.status,
        };
      });
    });
    return [...uitMethode, ...activiteiten];
  }, [school, methode, activiteiten, antwoorden, titelVan]);

  const perKolom = (k: string) => alles.filter((a) => a.kolom === k);
  const laatstBijgewerkt = (k: string): string | null => {
    const eigen = activiteiten.filter((a) => a.kolom === k).map((a) => a.op).sort();
    return eigen.length ? eigen[eigen.length - 1] : null;
  };

  const beantwoord = (id: string, waarde: MethodeAntwoord["waarde"], door: string) => {
    setNaam(door);
    setAntwoorden((l) => ({ ...l, [id]: { waarde, door, op: vandaagISO() } }));
  };
  const klaar = (door: string) => {
    setNaam(door);
    setNagelopen((l) => ({ ...l, [docentKolom]: { door, op: vandaagISO() } }));
    setScherm("kaart");
  };

  const voegToe = (kolom: string, v: ActiviteitVelden) => {
    const op = vandaagISO();
    setNaam(v.door);
    setActiviteiten((l) => [...l, { ...v, id: crypto.randomUUID(), kolom, bron: "docent", op, docent: v.door, schooljaar: schooljaarVan(op) }]);
  };
  // Een wijziging telt als bijwerken: naam en datum gaan mee, wie het geeft blijft staan.
  const bewerk = (id: string, v: ActiviteitVelden) => {
    setNaam(v.door);
    setActiviteiten((l) => l.map((a) => (a.id === id ? { ...a, ...v, op: vandaagISO() } : a)));
  };
  const verwijder = (id: string) => setActiviteiten((l) => l.filter((a) => a.id !== id));

  return (
    <div className="min-h-screen bg-offwhite text-[13.5px] text-ink-soft">
      <TopBar scherm={scherm} setScherm={setScherm} naam={naam} />
      {scherm === "opzet" && <Opzet methode={methode} setMethode={setMethode} onKlaar={() => setScherm("kaart")} />}
      {scherm === "kaart" && (
        <Kaart alles={alles} laatstBijgewerkt={laatstBijgewerkt} nagelopen={nagelopen} naam={naam}
          voegToe={voegToe} bewerk={bewerk} verwijder={verwijder} />
      )}
      {scherm === "leerlijn" && <Leerlijn alles={alles} naam={naam} voegToe={voegToe} bewerk={bewerk} />}
      {scherm === "uitnodigen" && (
        <Collegas laatstBijgewerkt={laatstBijgewerkt} nagelopen={nagelopen}
          onOpen={(k, n) => { setDocentKolom(k); setNaam(n); setScherm("docent"); }}
          onTerug={() => setScherm("kaart")} />
      )}
      {scherm === "docent" && (
        <DocentModus key={docentKolom} kolom={kolomVan(docentKolom)} methode={methode[docentKolom]} regels={perKolom(docentKolom)} naam={naam}
          nagelopen={nagelopen[docentKolom]} setKolom={setDocentKolom}
          voegToe={voegToe} bewerk={bewerk} beantwoord={beantwoord} klaar={klaar} />
      )}
    </div>
  );
}

function TopBar({ scherm, setScherm, naam }: { scherm: Scherm; setScherm: (s: Scherm) => void; naam: string }) {
  const { school } = useSchool();
  const tabs = [["kaart", "Kaart"], ["leerlijn", "Leerlijn"], ["uitnodigen", "Collega's"], ["docent", "Mijn vak"]] as const;
  return (
    <header className="sticky top-0 z-20 border-b border-rule bg-cream/95 backdrop-blur">
      <div className="mx-auto flex max-w-[1400px] items-center gap-6 px-4 py-2.5">
        <div className="flex items-baseline gap-2">
          <span className="font-display text-[15px] font-bold tracking-tight text-ink">Helder</span>
          <span className="hidden font-mono text-[10px] uppercase tracking-[0.14em] text-ink-faint sm:inline">de kerndoelen dekkingskaart</span>
        </div>
        {scherm !== "opzet" && (
          <nav className="flex gap-1">
            {tabs.map(([k, l]) => (
              <button key={k} onClick={() => setScherm(k)}
                className={`rounded-md px-2.5 py-1 text-[12.5px] transition ${scherm === k ? "bg-cobalt-soft text-cobalt-deep" : "text-ink-soft hover:text-ink"}`}>
                {l}
              </button>
            ))}
          </nav>
        )}
        <div className="ml-auto hidden items-center gap-3 sm:flex">
          <Label>{school.naam}</Label>
          {naam && <span title={naam} className="h-5 w-5 rounded-full bg-cobalt text-center font-mono text-[10px] leading-5 text-cream">{naam.slice(0, 2)}</span>}
        </div>
      </div>
    </header>
  );
}
