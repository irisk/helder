/* De vorm van de data. Alles wat per school verschilt zit in SchoolConfig,
   zodat een nieuwe school alleen een config nodig heeft en geen codewijziging. */

// De SLO nummert of benoemt deze regels niet ("Het gaat hierbij om"). `titel` is een eigen korte naam, `volledig` de SLO-tekst.
export type Subdoel = { code: string; titel: string; volledig: string };
export type Onderdeel = { code: string; titel: string; subdoelen?: Subdoel[] };
export type Kerndoel = { nummer: number; naam: string; lens?: string; onderdelen: Onderdeel[] };

// Een kolom op de kaart. Meestal een vak, maar een breekweek werkt net zo.
export type Kolom = { id: string; naam: string; afk: string; methodes: string[] };

export type Docent = { naam: string; kolom: string };

// Wat een methode volgens een bron raakt. `jaar: null` betekent: niet bekend.
export type MethodeKoppeling = {
  code: string;
  jaar: number | null;
  bron: string; // van wie deze bewering komt, altijd zichtbaar
  titel?: string;
  toelichting?: string;
  inLeerlijn?: boolean;
  status?: Status;
};

export type Nagelopen = { door: string; op: string };

export type SchoolConfig = {
  id: string;
  naam: string;
  jaarLabel: "leerjaar" | "groep";
  jaren: number[];
  kolomLabel: string; // "vak", "vakgebied"
  kerndoelen: Kerndoel[];
  kolommen: Kolom[];
  methodeDekking: Record<string, MethodeKoppeling[]>;
  docenten: Docent[];
  activiteiten: Activiteit[];
  nagelopen?: Record<string, Nagelopen>; // per kolom: wie heeft dit nagekeken en wanneer
  suggesties?: Record<string, string>;
  opzetNotitie?: string;
};

/* ---------- het atoom ---------- */

export type Bron = "methode" | "docent";
export type Status = "gepland" | "gegeven";

export type Activiteit = {
  id: string;
  titel: string;
  kolom: string;
  jaar: number | null;
  codes: string[];
  bron: Bron;
  door: string; // wie het invoerde of als laatste wijzigde
  op: string; // ISO-datum; leeg bij methode-records, die hebben een bron in plaats van een datum
  toelichting?: string;
  duur?: string;
  docent?: string; // wie het geeft; een kolom kan meerdere docenten hebben
  schooljaar?: string; // wordt bewaard, nog nergens op gefilterd
  status?: Status;
  inLeerlijn?: boolean; // apart van `bron`: herkomst zegt niet of het is afgesproken
  subdoelen?: string[];
  bronNotitie?: string;
  antwoord?: MethodeAntwoord; // alleen bij methode-records: wat de school zelf zegt
};

export type MethodeAntwoord = { waarde: "ja" | "nee"; door: string; op: string };

export type ActiviteitVelden = Pick<Activiteit, "titel" | "jaar" | "codes" | "door" | "toelichting" | "subdoelen" | "inLeerlijn" | "status">;
