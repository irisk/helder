import type { ReactNode } from "react";
import { watGeleden } from "./tijd";
import type { Activiteit, Status } from "./types";

// Onderscheid op VORM, niet op positie (links/rechts zijn spiegelbeelden en
// perceptueel het zwakste onderscheid dat bestaat) en niet op intensiteit
// (dat smokkelt een oordeel binnen over welke bron meer waard is).
export function Merk({ methode, docent }: { methode: boolean; docent: boolean }) {
  if (!methode && !docent) return <span className="inline-block h-[3px] w-[3px] rounded-full bg-ink-faint/40" />;
  return (
    <span className="inline-flex items-center gap-[3px]">
      {methode && <span className="h-[11px] w-[11px] rounded-[2px] border-[1.5px] border-sage-deep" />}
      {docent && <span className="h-[9px] w-[9px] rounded-full bg-sage-deep" />}
    </span>
  );
}

export function Knop({ children, onClick, soort = "primair", klein }: { children: ReactNode; onClick: () => void; soort?: "primair" | "rand" | "stil"; klein?: boolean }) {
  const basis = `inline-flex items-center gap-1.5 rounded-lg font-medium transition ${klein ? "px-2.5 py-1 text-[12.5px]" : "px-3.5 py-2 text-[13.5px]"}`;
  const stijl = soort === "primair" ? "bg-cobalt text-cream hover:bg-cobalt-deep"
    : soort === "rand" ? "border border-rule bg-cream text-ink hover:border-ink-faint"
    : "text-ink-soft hover:text-ink";
  return <button onClick={onClick} className={`${basis} ${stijl}`}>{children}</button>;
}

export function Label({ children }: { children: ReactNode }) {
  return <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-faint">{children}</span>;
}

export function Code({ code }: { code: string }) {
  return <span className="font-mono text-[10.5px] tracking-wide text-ink-faint">{code}</span>;
}

// Van wie een record komt: bij een methode de bron, bij een docent naam en datum.
export const herkomst = (a: Activiteit) => {
  if (a.bron === "docent") return `${a.door}, ${watGeleden(a.op)}`;
  const bron = `bron: ${a.bronNotitie ?? "onbekend"}`;
  if (!a.antwoord) return bron;
  return `${bron}; ${a.antwoord.waarde === "ja" ? "bevestigd" : "doen we niet"}, ${a.antwoord.door}`;
};

// Eén teken per stand, op vorm: een vinkje voor gegeven, een open rondje voor gepland.
export function StatusTeken({ status }: { status: Status }) {
  return (
    <span className="inline-flex items-center gap-1 whitespace-nowrap text-[11px] text-ink-soft">
      {status === "gegeven" ? (
        <svg width="11" height="11" viewBox="0 0 11 11" aria-hidden="true"><path d="M1.5 6 L4.3 8.8 L9.5 2.5" fill="none" stroke="currentColor" strokeWidth="1.7" /></svg>
      ) : (
        <span className="h-[9px] w-[9px] rounded-full border-[1.5px] border-ink-faint" />
      )}
      {status}
    </span>
  );
}
