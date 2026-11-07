import { Link } from "react-router-dom";
import type { ReactNode } from "react";
import { knopKlas, Voettekst } from "../dekkingskaart/ui";

/* Productpagina. Lezers zijn coördinatoren en docenten die dit werk al doen.
   Ze hoeven niet overtuigd te worden van het probleem; ze willen zien wat het
   is. Dus: wat het is, hoe het eruitziet, wat erin zit, wat er nog bij kan.
   Geen namen, geen aannames over "elke school". */

function Beeld({ src, alt, bij }: { src: string; alt: string; bij: string }) {
  return (
    <figure className="mt-3">
      <img src={src} alt={alt} className="w-full rounded-kaartje border border-line" />
      <figcaption className="mt-1.5 text-klein text-ink-soft">{bij}</figcaption>
    </figure>
  );
}

function Naast({ src, alt, children }: { src: string; alt: string; children: ReactNode }) {
  return (
    <div className="mt-6 grid items-start gap-5 sm:grid-cols-[1fr_330px]">
      <p>{children}</p>
      <img src={src} alt={alt} className="w-full rounded-kaartje border border-line" />
    </div>
  );
}

function Blok({ titel, children }: { titel: string; children: ReactNode }) {
  return (
    <section className="border-t border-line py-7">
      <h2 className="text-kop">{titel}</h2>
      <div className="mt-2.5">{children}</div>
    </section>
  );
}

export function Product() {
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-20 border-b border-line bg-surface">
        <div className="mx-auto flex max-w-smal items-center gap-4 px-6 py-2.5">
          <Link to="/" className="text-kop text-action">Helder</Link>
          <Link to="/dekkingskaart" className={`ml-auto ${knopKlas("hoofd")}`}>
            Open het prototype
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-smal px-6 pb-14">
        <div className="py-7">
          <h1 className="text-titel">
            Weten wat je school doet aan digitale geletterdheid.
          </h1>
          <p className="mt-3">
            Een overzicht van welke kerndoelen in welke lessen aan bod komen. Per vak zie je wat er uit de methode komt en wat een docent er zelf bij doet, en je houdt het samen met je collega's bij.
          </p>
        </div>

        <Blok titel="Twee dingen kosten tijd">
          <p>
            <span className="font-semibold">De eerste inventarisatie.</span> Voor elk vak uitzoeken wat de methode al dekt, en daarnaast ophalen wat de docent er zelf bij doet. Dat is per vak een gesprek, en je hebt er een stuk of zes.
          </p>
          <p className="mt-2.5 ">
            <span className="font-semibold">En daarna bijhouden.</span> Lessen veranderen, methodes veranderen, docenten wisselen. De vraag is niet alleen hoe je het overzicht maakt, maar van wie het daarna is. Meestal komt dat op één persoon neer.
          </p>
        </Blok>

        <Blok titel="Zo ziet het eruit">
          <p>
            De kaart zet de negen kerndoelonderdelen af tegen de vakken. Een boekje komt uit de methode, een poppetje is wat een docent zelf doet. Die twee staan los van elkaar, want dat verschil bepaalt of de dekking op materiaal rust of op één persoon.
          </p>
          <Beeld src="/shots/kaart.jpg" alt="De dekkingskaart: kerndoelonderdelen afgezet tegen vakken"
                 bij="Bovenaan staat wanneer een docent een vak voor het laatst heeft bevestigd. Een kolom in schaduw is nog niet bevestigd." />

          <p className="mt-6 ">
            Ga je over een vakje heen, dan zie je meteen welke lessen daarachter zitten en wie ze heeft opgegeven.
          </p>
          <Beeld src="/shots/hover.jpg" alt="Pop-up met de lessen achter één vakje" bij="" />

          <Naast src="/shots/vakpaneel.jpg" alt="Het paneel per vak, met toelichting per activiteit">
            Klik erop en je ziet het hele vak, met het onderdeel waar je vandaan kwam bovenaan. Elke regel is een losse les of opdracht die je kunt uitklappen, aanpassen of weghalen.
          </Naast>

          <p className="mt-6 ">
            Je collega's vullen hun eigen vak in. Jij ziet wie er lang niets aan heeft gedaan, en vraagt het na.
          </p>
          <Beeld src="/shots/collegas.jpg" alt="Overzicht van collega's en wanneer zij hun vak bijwerkten" bij="" />

          <p className="mt-6 ">
            Wat een docent zelf te zien krijgt, begint bij wat er al staat. Niet bij wat ontbreekt. Wat nog niet in beeld is, zie je alleen als je erom vraagt, met de opmerking dat een ander vak het misschien al oppakt.
          </p>
          <Beeld src="/shots/docent.jpg" alt="Het scherm Mijn vak, voor één vak" bij="" />
        </Blok>

        <Blok titel="Wat er verder in zit">
          <ul className="space-y-1.5">
            <li>Filteren op leerjaar, zodat je kunt zien wat er in leerjaar 1, 2 of 3 gebeurt.</li>
            <li>Elk onderdeel klapt uit naar de subdoelen, zodat je ziet welk deel ervan aan bod komt.</li>
            <li>Een leerlijn per leerjaar, met wat jullie hebben afgesproken en of het is gepland of gegeven.</li>
            <li>Bij elke les een korte toelichting, zodat een collega er iets aan heeft.</li>
            <li>Bij alles staat wie het heeft opgegeven en wanneer.</li>
            <li>Geen percentage en geen voortgangsbalk. Een cijfer nodigt uit om ruimer op te geven dan waar is.</li>
            <li>Geen leerlinggegevens. De kaart gaat over lessen, niet over kinderen.</li>
          </ul>
        </Blok>

        <Blok titel="Wat er nog bij kan">
          <p>
            Dit is een prototype: nog geen opslag, geen inlog, geen echte data. Wat hieronder staat is gevraagd en zou een volgende stap zijn.
          </p>
          <ul className="mt-2.5 space-y-1.5">
            <li><span className="font-semibold">Per afdeling of niveau.</span> Lastiger dan het klinkt, want in de brugklas zitten de niveaus vaak door elkaar in één klas.</li>
            <li><span className="font-semibold">Een export voor de inspectie.</span> Dan wel van wat de school zelf heeft opgegeven, met naam en datum erbij, en geen oordeel over of iets gedekt is.</li>
            <li><span className="font-semibold">Taal, rekenen en burgerschap erbij.</span> Dezelfde opzet, meer basisvaardigheden.</li>
            <li><span className="font-semibold">Methodes die zichzelf invullen.</span> Nu zijn de methodes en de koppeling met de kerndoelen in dit prototype verzonnen. Voor de nieuwe kerndoelen digitale geletterdheid bestaat die koppeling nog niet. Daar is een betrouwbare bron voor nodig.</li>
          </ul>
        </Blok>

        <div className="border-t border-line pt-7">
          <p>
            Het prototype staat open met een verzonnen school erin. Klik erdoorheen en zeg wat er niet klopt, of wat je zou missen als je het morgen zou gebruiken.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Link to="/dekkingskaart" className={knopKlas("hoofd")}>
              Open het prototype
            </Link>
            <Link to="/over" className={knopKlas("tweede")}>
              Over Helder
            </Link>
          </div>
          <p className="mt-5 text-klein text-ink-soft">
            Prototype, november 2026, gemaakt op basis van gesprekken met docenten, coördinatoren en ICT-coaches
          </p>
        </div>
      </main>
      <Voettekst />
    </div>
  );
}
