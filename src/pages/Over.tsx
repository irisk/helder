import { Link } from "react-router-dom";
import { knopKlas } from "../dekkingskaart/ui";

const CONTACT_EMAIL = "helder@irisvandekieft.com";
const MAILTO = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent("Helder · meedenken")}`;

/* De voordeur: een gesprek verdienen, geen product verkopen. De tekst is van Iris zelf. */

export function Over() {
  return (
    <div className="min-h-screen">
      <header className="mx-auto flex max-w-3xl flex-wrap items-center justify-between gap-3 px-6 py-5">
        <Link to="/" className="text-kop text-action">Helder</Link>
        <a href={MAILTO} className={knopKlas("tweede")}>Praat je mee?</a>
      </header>
      <main className="mx-auto max-w-3xl px-6">
        <section className="grid items-center gap-8 pb-10 pt-4 sm:grid-cols-[1.45fr_1fr]">
          <div>
            <h1 className="text-titel">Hoe leren we jongeren bewust en kritisch omgaan met technologie?</h1>
            <p className="mt-4">Ik ben Iris. Ik onderzoek hoe jongeren kritisch en gezond met technologie leren omgaan, en of ik daar iets voor kan bouwen.</p>
            <p className="mt-3">In gesprekken met docenten, coördinatoren en ICT-coaches kwam één ding steeds terug dat nog niet bestaat: een overzicht van welke kerndoelen digitale geletterdheid in welke lessen aan bod komen. Daar werk ik nu aan.</p>
            <div className="mt-5 flex flex-wrap items-center gap-2">
              <Link to="/dekkingskaart" className={knopKlas("hoofd")}>Probeer de dekkingskaart</Link>
              <Link to="/product" className={knopKlas("tweede")}>Wat het is</Link>
            </div>
            <p className="mt-2 text-klein text-ink-soft">Prototype met een verzonnen school erin</p>
          </div>
          <img src="/images/iris-portrait.jpg" alt="Iris van de Kieft" className="aspect-[3/4] w-full rounded-kaart border border-line object-cover" />
        </section>

        <section className="border-t border-line py-8">
          <h2 className="text-kop">Waarom ik hieraan werk</h2>
          <p className="mt-3">
            Ik heb een achtergrond in kunstmatige intelligentie en cognitieve neuropsychologie, en werk al twaalf jaar als productmanager in tech. Juist daardoor zie ik ook steeds meer de schaduwkant, ook bij mezelf. Ik was vaak de hele dag druk met mail en berichten, en had aan het eind toch niet het gevoel dat ik iets zinvols had gedaan. Toen ik het boek <span className="italic">Deep Work</span> las, kwam dat hard binnen. Het gaat over hoe waardevol geconcentreerd, ongestoord werk is, en hoe snel constante afleiding dat wegvreet.
          </p>
          <p className="mt-3">
            Ik weet dat ik niet de enige ben die dit ervaart. Er wordt inmiddels veel geschreven over de invloed van smartphones, vooral op de jeugd. Ik zie het ook breder: minder kritisch denken, mensen sneller op scherp. En met de opkomst van AI komt er nog een laag bij die het voor jongeren ingewikkelder maakt.
          </p>
          <p className="my-5 text-kop">
            Een kind van 13 zou moeten kunnen zeggen: dit is mijn gereedschap, ik weet hoe ik het kritisch gebruik. Niet: ik kan niet zonder, ik ga mee in alles wat het me voorschotelt.
          </p>
          <p>
            Ik geloof dat je juist bij jongeren veel verschil kunt maken, op een leeftijd waarop ze er zelf over na kunnen denken. De overheid ziet het belang inmiddels ook: de nieuwe kerndoelen digitale geletterdheid komen eraan. Ik wil kijken of ik scholen daarbij kan helpen.
          </p>
        </section>

        <section className="border-t border-line py-8">
          <h2 className="text-kop">Wat ik heb geleerd</h2>
          <p className="mt-1 text-ink-soft">Uit gesprekken met docenten, coördinatoren en mensen uit het onderwijsveld.</p>
          <ul className="mt-3 divide-y divide-line-soft rounded-kaart border border-line bg-surface">
            <li className="px-4 py-3">Lesmateriaal is niet het probleem. Uitgevers zijn ermee bezig en er is al veel gratis materiaal.</li>
            <li className="px-4 py-3">Het knelpunt zit bij docenten: tijd, en of ze zich er klaar voor voelen.</li>
            <li className="px-4 py-3">Niemand heeft overzicht. Scholen weten niet goed welke kerndoelen al aan bod komen, in welk vak en in welk leerjaar.</li>
          </ul>
        </section>

        <section className="pb-12">
          <div className="rounded-kaart border border-line bg-surface p-6">
            <h2 className="text-kop">Werk je in het onderwijs? Ik leer graag van je.</h2>
            <p className="mt-2">Of je nu lesgeeft, coördineert of meedenkt over digitale geletterdheid: ik hoor graag hoe het er bij jullie aan toegaat. Een half uur is genoeg.</p>
            <a href={MAILTO} className={`mt-4 ${knopKlas("hoofd")}`}>Stuur een mail</a>
          </div>
        </section>
      </main>
      <footer className="border-t border-line">
        <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-between gap-3 px-6 py-6 text-klein text-ink-soft">
          <div><span className="font-semibold text-ink">Helder</span>, een initiatief van Iris van de Kieft</div>
          <div className="flex flex-wrap items-center gap-4">
            <Link to="/dekkingskaart" className="text-action hover:text-action-deep">Dekkingskaart</Link>
            <a href={MAILTO} className="text-action hover:text-action-deep">{CONTACT_EMAIL}</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
