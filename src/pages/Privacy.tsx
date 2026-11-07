import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Voettekst } from "../dekkingskaart/ui";

/* In gewone taal, en alleen wat echt zo is. Verandert er iets aan wat de site doet of
   waar die staat, pas dit dan mee aan. Bij echte schoolgegevens moet dit opnieuw. */

function Blok({ titel, children }: { titel: string; children: ReactNode }) {
  return (
    <section className="border-t border-line py-6">
      <h2 className="text-kop">{titel}</h2>
      <div className="mt-2 space-y-2">{children}</div>
    </section>
  );
}

export function Privacy() {
  return (
    <div className="min-h-screen">
      <header className="mx-auto max-w-smal px-6 py-5">
        <Link to="/" className="text-kop text-action">Helder</Link>
      </header>
      <main className="mx-auto max-w-smal px-6 pb-10">
        <h1 className="text-titel">Privacy</h1>
        <p className="mt-2 pb-6">Helder is een prototype. Deze site slaat geen gegevens van jou op.</p>

        <Blok titel="Wat er niet gebeurt">
          <p>Geen account, geen cookies, geen analytics en geen advertenties. Er zijn geen leerlinggegevens en geen echte schoolgegevens: de scholen op deze site zijn verzonnen.</p>
          <p>Wat je in het prototype invult, blijft in je browser en is weg zodra je de pagina herlaadt. Het wordt nergens heen gestuurd.</p>
        </Blok>

        <Blok titel="Wat er wel gebeurt">
          <p><span className="font-semibold">Hosting.</span> De site draait bij Vercel, een Amerikaans bedrijf. Om een pagina te kunnen tonen, krijgt Vercel technische gegevens zoals je IP-adres. Ik gebruik die zelf niet.</p>
          <p><span className="font-semibold">Mail.</span> Als je me mailt, heb ik je naam, adres en wat je schrijft. Mijn mail loopt via Greenhost, een Nederlands bedrijf. Ik gebruik dit alleen om met je in gesprek te gaan.</p>
          <p>De lettertypes staan op deze site zelf, dus je browser maakt daarvoor geen verbinding met Google.</p>
        </Blok>

        <Blok titel="Wie dit doet">
          <p>Helder is een initiatief van Iris van de Kieft. Wil je weten wat ik van je heb, of wil je dat ik het verwijder? Mail naar <a href="mailto:helder@irisvandekieft.com" className="text-action hover:text-action-deep">helder@irisvandekieft.com</a>. Je kunt ook een klacht indienen bij de Autoriteit Persoonsgegevens.</p>
        </Blok>

        <Blok titel="Beveiligingsprobleem gevonden?">
          <p>Mail het naar hetzelfde adres. De code is openbaar op <a href="https://github.com/irisk/helder" className="text-action hover:text-action-deep">GitHub</a>.</p>
        </Blok>
      </main>
      <Voettekst />
    </div>
  );
}
