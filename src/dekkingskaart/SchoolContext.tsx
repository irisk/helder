import { createContext, useContext, useMemo, type ReactNode } from "react";
import type { Kolom, SchoolConfig } from "./types";

/* De huidige school, beschikbaar voor elk scherm zonder hem door elke laag door te geven. */

function maakHulpjes(school: SchoolConfig) {
  const onderdelen = school.kerndoelen.flatMap((k) => k.onderdelen);
  const kort = school.jaarLabel === "groep" ? "gr" : "lj";
  return {
    school,
    onderdelen,
    titelVan: (code: string) => onderdelen.find((o) => o.code === code)?.titel ?? code,
    kolomVan: (id: string): Kolom => school.kolommen.find((k) => k.id === id) ?? { id, naam: id, afk: id, methodes: [] },
    jaarTekst: (jaar: number) => `${school.jaarLabel} ${jaar}`,
    // Nederlands: "het leerjaar", maar "de groep"
    welkJaar: school.jaarLabel === "groep" ? "welke groep" : "welk leerjaar",
    elkJaar: school.jaarLabel === "groep" ? "elke groep" : "elk leerjaar",
    jaarKort: (jaar: number | null) => (jaar === null ? `${kort}?` : `${kort}${jaar}`),
  };
}

const Ctx = createContext<ReturnType<typeof maakHulpjes> | null>(null);

export function SchoolProvider({ school, children }: { school: SchoolConfig; children: ReactNode }) {
  const waarde = useMemo(() => maakHulpjes(school), [school]);
  return <Ctx.Provider value={waarde}>{children}</Ctx.Provider>;
}

export function useSchool() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useSchool buiten SchoolProvider");
  return c;
}
