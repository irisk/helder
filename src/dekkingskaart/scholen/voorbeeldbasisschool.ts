import { KERNDOELEN_PO } from "../kerndoelen";
import { dagenTerug } from "../tijd";
import type { SchoolConfig } from "../types";

/* Een verzonnen basisschool. Dit is de test voor de config: PO-kerndoelen, groepen,
   vakgebieden en een kolom die geen vak is. Als dit een codewijziging vraagt,
   is de config niet algemeen genoeg. */

export const voorbeeldbasisschool: SchoolConfig = {
  id: "voorbeeldbasisschool",
  naam: "Voorbeeldbasisschool",
  jaarLabel: "groep",
  jaren: [1, 2, 3, 4, 5, 6, 7, 8],
  kolomLabel: "vakgebied",
  kerndoelen: KERNDOELEN_PO,
  kolommen: [
    { id: "taal", naam: "Taal", afk: "TAAL", methodes: ["Taalmethode C", "Geen / eigen materiaal"] },
    { id: "rek", naam: "Rekenen", afk: "REK", methodes: ["Rekenmethode C", "Geen / eigen materiaal"] },
    { id: "wo", naam: "Wereldoriëntatie", afk: "WO", methodes: ["Zaakvakkenmethode C", "Geen / eigen materiaal"] },
    { id: "mak", naam: "Kunst en techniek", afk: "K&T", methodes: [] },
    { id: "proj", naam: "Projectweken", afk: "PROJ", methodes: [] },
  ],
  methodeDekking: {
    "Taalmethode C": [{ code: "22B", jaar: 6, bron: "verzonnen voorbeeld" }, { code: "24A", jaar: null, bron: "verzonnen voorbeeld" }],
    "Rekenmethode C": [{ code: "22C", jaar: 7, bron: "verzonnen voorbeeld" }],
    "Zaakvakkenmethode C": [{ code: "24C", jaar: 8, bron: "verzonnen voorbeeld", titel: "Thema over technologie en samenleving" }],
  },
  docenten: [
    { naam: "Noor", kolom: "taal" }, { naam: "Daan", kolom: "taal" }, { naam: "Noor", kolom: "rek" },
    { naam: "Fatima", kolom: "wo" }, { naam: "Lars", kolom: "mak" }, { naam: "Fatima", kolom: "proj" },
  ],
  activiteiten: [
    { id: "b1", inLeerlijn: true, status: "gepland", titel: "Blokjes programmeren met een robotje", kolom: "mak", jaar: 5, codes: ["23B"], bron: "docent", door: "Lars", docent: "Lars", op: dagenTerug(12), duur: "4 lessen" },
    { id: "b2", titel: "Een eigen stripverhaal maken op de tablet", kolom: "taal", jaar: 4, codes: ["23A"], bron: "docent", door: "Daan", docent: "Daan", op: dagenTerug(5), duur: "3 lessen" },
    { id: "b3", inLeerlijn: true, status: "gegeven", titel: "Is deze foto echt? Kijken naar nepfoto's", kolom: "taal", jaar: 7, codes: ["22B", "22D"], bron: "docent", door: "Noor", docent: "Noor", op: dagenTerug(30), duur: "1 les" },
    { id: "b4", titel: "Mediaweek: wat doet een scherm met jou?", kolom: "proj", jaar: 6, codes: ["24B"], bron: "docent", door: "Fatima", docent: "Fatima", op: dagenTerug(160), duur: "1 week" },
  ],
  nagelopen: { taal: { door: "Noor", op: dagenTerug(5) }, proj: { door: "Fatima", op: dagenTerug(160) } },
  opzetNotitie: "Deze school, de methodes en wat ze dekken zijn verzonnen.",
};
