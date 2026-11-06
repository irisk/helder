import type { ChangeEvent, ReactNode } from "react";
import { useSchool } from "./SchoolContext";
import { versheid, watGeleden } from "./tijd";
import type { Activiteit, Status } from "./types";

/* De gedeelde bouwstenen van het design system.
   Schermen stellen hieruit samen, zodat ze niet uit elkaar kunnen lopen. */

/* ---------- merken: bron en status, op vorm ---------- */

const icoon = { width: 17, height: 17, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round", role: "img" } as const;

export const Boek = () => (
  <svg {...icoon} aria-label="Uit de methode" className="shrink-0 text-present">
    <path d="M12 7v14" />
    <path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z" />
  </svg>
);

export const Persoon = () => (
  <svg {...icoon} aria-label="Van een docent" className="shrink-0 text-present">
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

export function Merk({ methode, docent }: { methode: boolean; docent: boolean }) {
  if (!methode && !docent) return null;
  return (
    <span className="inline-flex items-center gap-1">
      {methode && <Boek />}
      {docent && <Persoon />}
    </span>
  );
}

export function StatusTeken({ status }: { status: Status }) {
  return (
    <span className="inline-flex items-center gap-1 whitespace-nowrap text-klein text-ink-soft">
      {status === "gegeven" ? (
        <svg width="13" height="13" viewBox="0 0 13 13" aria-hidden="true"><path d="M2 7 L5 10 L11 3" fill="none" stroke="currentColor" strokeWidth="1.8" /></svg>
      ) : (
        <span className="h-[11px] w-[11px] rounded-full border-[1.5px] border-ink-soft" />
      )}
      {status}
    </span>
  );
}

/* ---------- knoppen en keuzes ---------- */

type KnopSoort = "hoofd" | "tweede" | "stil";

export const knopKlas = (soort: KnopSoort = "hoofd") => {
  const stijl = soort === "hoofd" ? "rounded-full bg-action px-[18px] text-surface hover:bg-action-deep"
    : soort === "tweede" ? "rounded-full border border-line-strong bg-surface px-[18px] text-ink hover:border-field"
    : "px-2 text-action hover:text-action-deep";
  return `inline-flex h-10 items-center font-semibold transition ${stijl}`;
};

export function Knop({ children, onClick, soort = "hoofd" }: { children: ReactNode; onClick: () => void; soort?: KnopSoort }) {
  return <button onClick={onClick} className={knopKlas(soort)}>{children}</button>;
}

// Eén geselecteerde stand voor filters, chips en antwoorden.
export function Keuze({ children, aan, onClick, label, titel }: { children: ReactNode; aan: boolean; onClick: () => void; label?: string; titel?: string }) {
  return (
    <button onClick={onClick} aria-pressed={aan} aria-label={label} title={titel}
      className={`min-h-9 rounded-full border px-3.5 py-1 text-left transition ${aan ? "border-transparent bg-action-soft font-bold text-action" : "border-line-strong bg-surface text-ink hover:border-field"}`}>
      {children}
    </button>
  );
}

/* ---------- formulier ---------- */

const veldKlas = "h-10 w-full rounded-veld border border-field bg-surface px-3 font-normal text-ink placeholder:text-ink-soft";

export function Veld({ label, value, onChange, placeholder, list }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; list?: string }) {
  return (
    <label className="block font-semibold">
      {label}
      <input value={value} list={list} placeholder={placeholder} onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(e.target.value)} className={`mt-1.5 ${veldKlas}`} />
    </label>
  );
}

export function Keuzelijst({ label, verborgenLabel, value, onChange, opties }: { label: string; verborgenLabel?: boolean; value: string; onChange: (v: string) => void; opties: { waarde: string; tekst: string }[] }) {
  return (
    <label className="block font-semibold">
      <span className={verborgenLabel ? "sr-only" : ""}>{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)} className={`${verborgenLabel ? "" : "mt-1.5"} ${veldKlas}`}>
        {opties.map((o) => <option key={o.waarde} value={o.waarde}>{o.tekst}</option>)}
      </select>
    </label>
  );
}

/* ---------- tekst en datum ---------- */

export function Code({ code }: { code: string }) {
  return <span className="text-klein tabular-nums text-ink-soft">{code}</span>;
}

// Een datum met het woord erbij. Oude datums krijgen een gele stip, nooit gele tekst.
export function Datum({ iso, woord, leeg = "Nog niet" }: { iso: string | null; woord?: string; leeg?: string }) {
  if (!iso) return <span className="text-klein text-ink-soft">{leeg}</span>;
  const oud = versheid(iso) === "verouderd";
  const tekst = watGeleden(iso);
  return (
    <span className={`inline-flex items-center gap-1.5 text-klein ${oud ? "text-ink" : "text-ink-soft"}`}>
      {oud && <span className="h-[9px] w-[9px] shrink-0 rounded-full bg-old" />}
      {woord ? `${woord} ${tekst}` : tekst.charAt(0).toUpperCase() + tekst.slice(1)}
    </span>
  );
}

// Van wie een record komt: bij een methode de bron, bij een docent naam en datum.
export const herkomst = (a: Activiteit) => {
  if (a.bron === "docent") return `${a.door}, ${watGeleden(a.op)}`;
  const bron = `Bron: ${a.bronNotitie ?? "onbekend"}`;
  if (!a.antwoord) return bron;
  return `${bron}. ${a.antwoord.waarde === "ja" ? "Bevestigd" : "Doen we niet"} door ${a.antwoord.door}`;
};

/* ---------- lijstregel en leerlijnkaart ---------- */

export function LijstRegel({ a, details, acties, children }: { a: Activiteit; details: string; acties?: ReactNode; children?: ReactNode }) {
  return (
    <div className="px-4 py-3">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
        <Merk methode={a.bron === "methode"} docent={a.bron === "docent"} />
        <div className="min-w-0 flex-1 basis-[240px]">
          <div className={a.antwoord?.waarde === "nee" ? "text-ink-soft line-through" : ""}>{a.titel}</div>
          <div className="text-klein text-ink-soft">{details}</div>
        </div>
        {acties && <div className="flex shrink-0 flex-wrap items-center gap-2">{acties}</div>}
      </div>
      {children}
    </div>
  );
}

export function LesKaart({ a, onKlik }: { a: Activiteit; onKlik?: () => void }) {
  const { kolomVan } = useSchool();
  const kolom = kolomVan(a.kolom);
  const Tag = onKlik ? "button" : "div";
  return (
    <Tag onClick={onKlik} className={`flex w-full overflow-hidden rounded-kaartje border border-line-strong bg-surface text-left ${onKlik ? "transition hover:border-action" : ""}`}>
      <span title={kolom.naam} className="flex w-[52px] shrink-0 items-center justify-center bg-shade text-klein font-semibold">{kolom.afk}</span>
      <span className="block min-w-0 flex-1 px-3 py-2.5">
        <span className="block">{a.titel}</span>
        <span className="mt-1.5 flex items-center gap-2">
          <Merk methode={a.bron === "methode"} docent={a.bron === "docent"} />
          {a.status && <span className="ml-auto"><StatusTeken status={a.status} /></span>}
        </span>
      </span>
    </Tag>
  );
}
