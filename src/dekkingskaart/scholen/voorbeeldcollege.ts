import { KERNDOELEN_VO } from "../kerndoelen";
import { dagenTerug } from "../tijd";
import type { MethodeKoppeling, SchoolConfig } from "../types";

const verzonnen = (methode: string, code: string, jaar: number | null, leerlijn?: MethodeKoppeling["status"]): MethodeKoppeling => ({
  code, jaar, bron: "verzonnen voorbeeld", inLeerlijn: !!leerlijn, status: leerlijn,
  toelichting: `Verzonnen voorbeeld. Voor de nieuwe kerndoelen bestaat nog geen koppeling met ${methode}; dit is een inschatting en geen bevestiging. Controleer of dit hoofdstuk het onderdeel echt raakt.`,
});

export const voorbeeldcollege: SchoolConfig = {
  id: "voorbeeldcollege",
  naam: "Voorbeeldcollege",
  jaarLabel: "leerjaar",
  jaren: [1, 2, 3],
  kolomLabel: "vak",
  kerndoelen: KERNDOELEN_VO,
  kolommen: [
    { id: "ned", naam: "Nederlands", afk: "NED", methodes: ["Taalmethode A", "Taalmethode B", "Geen / eigen materiaal"] },
    { id: "eng", naam: "Engels", afk: "ENG", methodes: ["Engelsmethode A", "Engelsmethode B", "Geen / eigen materiaal"] },
    { id: "mm", naam: "M&M", afk: "M&M", methodes: ["M&M-methode A", "Geen / eigen materiaal"] },
    { id: "bio", naam: "Biologie", afk: "BIO", methodes: ["Biologiemethode A", "Biologiemethode B", "Geen / eigen materiaal"] },
    { id: "wis", naam: "Wiskunde", afk: "WIS", methodes: ["Wiskundemethode A", "Wiskundemethode B", "Geen / eigen materiaal"] },
    { id: "mnt", naam: "Mentoruur", afk: "MNT", methodes: ["Geen vaste methode", "Mentormethode A"] },
  ],
  // Verzonnen methodes en een verzonnen koppeling. De B-methodes hebben bewust geen
  // leerjaar, om te laten zien hoe de kaart met "niet bekend" omgaat.
  methodeDekking: {
    "Taalmethode A": [verzonnen("Taalmethode A", "21B", 2, "gegeven")],
    "Taalmethode B": [verzonnen("Taalmethode B", "21B", null)],
    "Engelsmethode A": [verzonnen("Engelsmethode A", "21A", 1)],
    "Engelsmethode B": [verzonnen("Engelsmethode B", "21A", null)],
    "M&M-methode A": [verzonnen("M&M-methode A", "23C", 3)],
    "Biologiemethode A": [verzonnen("Biologiemethode A", "21C", 2, "gepland")],
    "Biologiemethode B": [verzonnen("Biologiemethode B", "21C", null)],
    "Wiskundemethode A": [verzonnen("Wiskundemethode A", "21C", 2)],
    "Wiskundemethode B": [verzonnen("Wiskundemethode B", "21C", null)],
    "Mentormethode A": [verzonnen("Mentormethode A", "23B", 1, "gegeven")],
  },
  docenten: [
    { naam: "Joost", kolom: "ned" }, { naam: "Aisha", kolom: "ned" }, { naam: "Sanne", kolom: "eng" }, { naam: "Karim", kolom: "mm" },
    { naam: "Marieke", kolom: "bio" }, { naam: "Ton", kolom: "wis" }, { naam: "Esra", kolom: "mnt" },
  ],
  // Bewust ongelijk verdeeld in de tijd: dat is wat de kaart moet laten zien.
  activiteiten: [
    { id: "a1", inLeerlijn: true, status: "gegeven", subdoelen: ["21B.2"], titel: "Nieuwsberichten vergelijken: wat is de bron?", kolom: "ned", jaar: 2, codes: ["21B"], bron: "docent", door: "Joost", docent: "Joost", op: dagenTerug(3), duur: "3 lessen",
      toelichting: "Leerlingen zoeken hetzelfde nieuws bij drie media en vergelijken bron, toon en beeld. Daarna maken ze samen een lijstje waar je op let." },
    { id: "a2", subdoelen: ["21D.4"], titel: "Een kort verhaal schrijven met hulp van AI", kolom: "ned", jaar: 1, codes: ["21D", "22A"], bron: "docent", door: "Joost", docent: "Joost", op: dagenTerug(3), duur: "4 lessen",
      toelichting: "Leerlingen schrijven een verhaal en laten een chatbot meedenken. Het gesprek gaat over wat de tool toevoegt en wat van henzelf blijft." },
    { id: "a3", inLeerlijn: true, status: "gepland", subdoelen: ["21D.4", "22B.1"], titel: "Instructies schrijven voor een chatbot", kolom: "ned", jaar: 3, codes: ["21D", "22B"], bron: "docent", door: "Joost", docent: "Joost", op: dagenTerug(6), duur: "2 lessen",
      toelichting: "Hoe precies moet je zijn? Leerlingen schrijven een instructie, testen wat eruit komt en verbeteren de tekst." },
    { id: "a10", titel: "Debat over AI en werk", kolom: "ned", jaar: 3, codes: ["21D"], bron: "docent", door: "Aisha", docent: "Aisha", op: dagenTerug(36), duur: "2 lessen" },
    { id: "a4", subdoelen: ["21A.3"], titel: "Vertaaltools vergelijken", kolom: "eng", jaar: 1, codes: ["21A"], bron: "docent", door: "Sanne", docent: "Sanne", op: dagenTerug(197), duur: "doorlopend",
      toelichting: "Leerlingen vertalen eerst zelf, dan met een tool, en bespreken waar de twee verschillen." },
    { id: "a5", inLeerlijn: true, status: "gegeven", subdoelen: ["23C.4"], titel: "Hoe werkt een tijdlijn op sociale media?", kolom: "mm", jaar: 3, codes: ["23C"], bron: "docent", door: "Karim", docent: "Karim", op: dagenTerug(36), duur: "3 lessen",
      toelichting: "Leerlingen noteren wat bovenaan hun tijdlijn staat en vergelijken dat in groepjes. Zo komt het begrip algoritme vanzelf ter sprake." },
    { id: "a6", titel: "Meetgegevens van een practicum in een grafiek", kolom: "bio", jaar: 2, codes: ["21C"], bron: "docent", door: "Marieke", docent: "Marieke", op: dagenTerug(204), duur: "5 lessen",
      toelichting: "Leerlingen zetten hun eigen meetgegevens in een sheet en maken er een grafiek van. Het biologische doel blijft leidend." },
    { id: "a7", inLeerlijn: true, status: "gegeven", subdoelen: ["21C.1"], titel: "Misleidende grafieken herkennen", kolom: "wis", jaar: 2, codes: ["21C"], bron: "docent", door: "Ton", docent: "Ton", op: dagenTerug(22), duur: "2 lessen",
      toelichting: "Leerlingen vergelijken grafieken uit de krant en maken zelf een eerlijke en een misleidende versie van dezelfde cijfers." },
    { id: "a8", inLeerlijn: true, status: "gegeven", subdoelen: ["23A.5"], titel: "Wat staat er online over jou?", kolom: "mnt", jaar: 1, codes: ["23A"], bron: "docent", door: "Esra", docent: "Esra", op: dagenTerug(8), duur: "1 les",
      toelichting: "Leerlingen zoeken zichzelf op en lopen daarna samen hun privacy-instellingen na." },
    { id: "a9", subdoelen: ["23B.3"], titel: "Praten over schermtijd", kolom: "mnt", jaar: 2, codes: ["23B"], bron: "docent", door: "Esra", docent: "Esra", op: dagenTerug(8), duur: "1 les + week bijhouden",
      toelichting: "Een week schermtijd bijhouden en daarna praten over hoe dat voelt." },
  ],
  nagelopen: {
    ned: { door: "Joost", op: dagenTerug(3) },
    eng: { door: "Sanne", op: dagenTerug(197) },
    wis: { door: "Ton", op: dagenTerug(22) },
    mnt: { door: "Esra", op: dagenTerug(8) },
  },
  suggesties: {
    "21A": "Instellingen-speurtocht: zet samen de privacy-instellingen van een schooltool goed",
    "21B": "Nepnieuws-battle: maak een echt én een nep-bericht, laat elkaar de nep ontmaskeren",
    "21C": "Mini-enquête in de klas: data verzamelen, visualiseren en kritisch bespreken",
    "21D": "Prompt-experiment: vraag AI 3x anders hetzelfde, vergelijk de verschillen",
    "22A": "Maak een korte uitlegvideo met beeld en geluid over een lesonderwerp",
    "22B": "Scratch of vibecoding: bouw een simpel spel of quiz over de lesstof",
    "23A": "Phishing-quiz: herken oplichting en zwakke wachtwoorden",
    "23B": "Schermtijd-dagboek: houd een week bij en reflecteer erop",
    "23C": "Algoritme-experiment: vergelijk ieders aanbevelingen, waarom verschillen ze?",
  },
  opzetNotitie: "De methodes en wat ze dekken zijn hier verzonnen. Voor de nieuwe kerndoelen digitale geletterdheid bestaat die koppeling nog niet. Daar heeft deze kaart een betrouwbare bron voor nodig.",
};
