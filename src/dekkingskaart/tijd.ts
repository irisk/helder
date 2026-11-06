const MAAND = ["januari", "februari", "maart", "april", "mei", "juni", "juli", "augustus", "september", "oktober", "november", "december"];

export const vandaagISO = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

// Voor verzonnen scholen: een datum relatief aan vandaag, zodat de demo niet vanzelf veroudert.
export const dagenTerug = (n: number) => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

// Op kalenderdagen rekenen, anders wisselt "gisteren" gedurende de dag.
const dagNummer = (iso: string) => {
  const [j, m, d] = iso.split("-").map(Number);
  return Date.UTC(j, m - 1, d) / 86400000;
};
export const dagenGeleden = (iso: string) => dagNummer(vandaagISO()) - dagNummer(iso);

export function watGeleden(iso: string) {
  const d = dagenGeleden(iso);
  if (d <= 0) return "vandaag";
  if (d === 1) return "gisteren";
  if (d < 14) return `${d} dagen geleden`;
  if (d < 60) return `${Math.round(d / 7)} weken geleden`;
  const [j, m] = iso.split("-").map(Number);
  const ditJaar = j === new Date().getFullYear();
  return `in ${MAAND[m - 1]}${ditJaar ? "" : ` ${j}`}`;
}

export type Versheid = "vers" | "ouder" | "verouderd";
export const versheid = (iso: string | null): Versheid => {
  if (!iso) return "verouderd";
  const d = dagenGeleden(iso);
  return d <= 21 ? "vers" : d <= 60 ? "ouder" : "verouderd";
};
// Schooljaar begint in augustus.
export const schooljaarVan = (iso: string) => {
  const [j, m] = iso.split("-").map(Number);
  return m >= 8 ? `${j}-${j + 1}` : `${j - 1}-${j}`;
};
