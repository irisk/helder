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
    { id: "a1", inLeerlijn: true, status: "gegeven", subdoelen: ["21B.2"], titel: "Fake-news-project: bronnen checken op betrouwbaarheid", kolom: "ned", jaar: 2, codes: ["21B"], bron: "docent", door: "Joost", docent: "Joost", op: dagenTerug(3), duur: "3 lessen",
      toelichting: "Leerlingen schrijven in tweetallen een waar en een misleidend bericht over hetzelfde onderwerp, in dezelfde opmaak. Daarna beoordelen ze elkaars berichten en maken we samen een checklist van signalen: bron, toon, urgentie, beeldgebruik." },
    { id: "a2", subdoelen: ["21D.4"], titel: "Prentenboek ontwerpen met AI-illustraties", kolom: "ned", jaar: 1, codes: ["21D", "22A"], bron: "docent", door: "Joost", docent: "Joost", op: dagenTerug(3), duur: "4 lessen",
      toelichting: "Leerlingen schrijven een kort verhaal en laten de illustraties door een beeldgenerator maken. Het gesprek gaat over wat er misgaat in de prompts en wie de maker is van het resultaat." },
    { id: "a3", inLeerlijn: true, status: "gepland", subdoelen: ["21D.4", "22B.1"], titel: "Vibecoding: uitleg schrijven zodat AI je recept-app bouwt", kolom: "ned", jaar: 3, codes: ["21D", "22B"], bron: "docent", door: "Joost", docent: "Joost", op: dagenTerug(6), duur: "2 lessen",
      toelichting: "Schrijfopdracht vermomd als techniek. Leerlingen moeten zo precies formuleren dat een AI er een werkend appje van maakt. Onduidelijk schrijven levert direct zichtbaar een kapot resultaat op." },
    { id: "a10", titel: "Debat over AI en werk", kolom: "ned", jaar: 3, codes: ["21D"], bron: "docent", door: "Aisha", docent: "Aisha", op: dagenTerug(36), duur: "2 lessen" },
    { id: "a4", subdoelen: ["21A.3"], titel: "Digitale woordenboeken en vertaaltools kritisch gebruiken", kolom: "eng", jaar: 1, codes: ["21A"], bron: "docent", door: "Sanne", docent: "Sanne", op: dagenTerug(197), duur: "doorlopend",
      toelichting: "Vaste routine bij schrijfopdrachten: eerst zelf, dan vertalen, dan vergelijken. Leerlingen markeren waar de tool iets anders koos dan zijzelf en waarom dat uitmaakt." },
    { id: "a5", inLeerlijn: true, status: "gegeven", subdoelen: ["23C.4"], titel: "Algoritmes, filterbubbels en de macht van techbedrijven", kolom: "mm", jaar: 3, codes: ["23C"], bron: "docent", door: "Karim", docent: "Karim", op: dagenTerug(36), duur: "3 lessen",
      toelichting: "Start met de eigen feed: iedereen noteert wat er bovenaan staat. Daarna vergelijken in groepjes, en het begrip aanbevelingsalgoritme introduceren vanuit wat ze zelf zagen." },
    { id: "a6", titel: "Plantengroei meten: van Excel naar een eigen meet-appje", kolom: "bio", jaar: 2, codes: ["21C"], bron: "docent", door: "Marieke", docent: "Marieke", op: dagenTerug(204), duur: "5 lessen",
      toelichting: "Practicum over fotosynthese waarbij de meetgegevens eerst in een sheet gaan en daarna in een zelfgebouwd appje. Het biologische doel blijft leidend; de data-vaardigheid komt eronderuit mee." },
    { id: "a7", inLeerlijn: true, status: "gegeven", subdoelen: ["21C.1"], titel: "Data en grafieken kritisch lezen", kolom: "wis", jaar: 2, codes: ["21C"], bron: "docent", door: "Ton", docent: "Ton", op: dagenTerug(22), duur: "2 lessen",
      toelichting: "Misleidende grafieken uit kranten en advertenties naast elkaar. Wat klopt er technisch, en wat suggereert het beeld? Leerlingen maken zelf een eerlijke en een misleidende versie van dezelfde data." },
    { id: "a8", inLeerlijn: true, status: "gegeven", subdoelen: ["23A.5"], titel: "Digitale voetafdruk: wat is er online over je te vinden?", kolom: "mnt", jaar: 1, codes: ["23A"], bron: "docent", door: "Esra", docent: "Esra", op: dagenTerug(8), duur: "1 les",
      toelichting: "Leerlingen zoeken zichzelf op en bespreken in tweetallen wat ze vinden. Daarna instellingen nalopen. Bewust geen huiswerk: dit blijft in de klas." },
    { id: "a9", subdoelen: ["23B.3"], titel: "Gesprek over schermtijd en online welzijn", kolom: "mnt", jaar: 2, codes: ["23B"], bron: "docent", door: "Esra", docent: "Esra", op: dagenTerug(8), duur: "1 les + week bijhouden",
      toelichting: "Een week schermtijd bijhouden, dan het gesprek over hoe het voelt in plaats van over hoeveel het is. De cijfers zijn de aanleiding, niet het onderwerp." },
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
