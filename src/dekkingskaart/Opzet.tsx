import { useSchool } from "./SchoolContext";
import { Knop } from "./ui";

export function Opzet({ methode, setMethode, onKlaar }: { methode: Record<string, string>; setMethode: (m: Record<string, string>) => void; onKlaar: () => void }) {
  const { school } = useSchool();
  const metMethode = school.kolommen.filter((k) => k.methodes.length > 0);
  return (
    <main className="mx-auto max-w-[760px] px-4 py-8">
      <h1 className="font-display text-[22px] font-bold tracking-tight text-ink">Welke methodes gebruiken jullie?</h1>
      <p className="mt-1.5 max-w-[60ch]">
        Dit vult alvast een deel van de kaart. Het is niet verplicht: je kunt overslaan en meteen zelf invullen wat er in de lessen gebeurt.
      </p>
      <div className="mt-5 divide-y divide-rule overflow-hidden rounded-lg border border-rule bg-cream">
        {metMethode.map((k) => (
          <div key={k.id} className="flex items-center gap-3 px-3 py-2">
            <span className="w-32 shrink-0 font-medium text-ink">{k.naam}</span>
            <select
              aria-label={`Methode voor ${k.naam}`}
              value={methode[k.id]} onChange={(e) => setMethode({ ...methode, [k.id]: e.target.value })}
              className="flex-1 rounded-md border border-rule bg-offwhite px-2 py-1.5 text-[13px] text-ink outline-none focus:border-cobalt"
            >
              {k.methodes.map((m) => <option key={m}>{m}</option>)}
            </select>
          </div>
        ))}
      </div>
      <div className="mt-4 flex items-center gap-2">
        <Knop onClick={onKlaar}>Naar de kaart</Knop>
        <Knop soort="stil" onClick={onKlaar}>Overslaan</Knop>
      </div>
      {school.opzetNotitie && (
        <p className="mt-4 max-w-[62ch] border-l-2 border-rule pl-3 text-[12.5px] text-ink-faint">{school.opzetNotitie}</p>
      )}
    </main>
  );
}
