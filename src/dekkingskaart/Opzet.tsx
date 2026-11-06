import { useSchool } from "./SchoolContext";
import { Keuzelijst, Knop } from "./ui";

export function Opzet({ methode, setMethode, onKlaar }: { methode: Record<string, string>; setMethode: (m: Record<string, string>) => void; onKlaar: () => void }) {
  const { school } = useSchool();
  const metMethode = school.kolommen.filter((k) => k.methodes.length > 0);
  return (
    <main className="mx-auto max-w-[760px] px-6 py-8">
      <h1 className="text-titel">Welke methodes gebruiken jullie?</h1>
      <p className="mt-2 max-w-[60ch]">
        Dit vult alvast een deel van de kaart. Het is niet verplicht: je kunt overslaan en meteen zelf invullen wat er in de lessen gebeurt.
      </p>
      <div className="mt-5 divide-y divide-line-soft rounded-kaart border border-line bg-surface">
        {metMethode.map((k) => (
          <div key={k.id} className="flex items-center gap-3 px-4 py-2.5">
            <span className="w-40 shrink-0 font-semibold">{k.naam}</span>
            <div className="min-w-0 flex-1">
              <Keuzelijst label={`Methode voor ${k.naam}`} verborgenLabel value={methode[k.id]} onChange={(m) => setMethode({ ...methode, [k.id]: m })}
                opties={k.methodes.map((m) => ({ waarde: m, tekst: m }))} />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 flex items-center gap-2">
        <Knop onClick={onKlaar}>Naar de kaart</Knop>
        <Knop soort="stil" onClick={onKlaar}>Overslaan</Knop>
      </div>
      {school.opzetNotitie && <p className="mt-4 max-w-[62ch] text-legenda text-ink-soft">{school.opzetNotitie}</p>}
    </main>
  );
}
