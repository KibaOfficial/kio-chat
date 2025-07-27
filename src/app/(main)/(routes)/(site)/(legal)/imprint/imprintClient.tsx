// Copyright (c) 2025 KibaOfficial
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
"use client";
export const dynamic = "force-dynamic";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const ImprintClient = () => {
  const [lang, setLang] = useState("en");
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-12 max-w-4xl">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <Button
              variant="outline"
              onClick={() => router.back()}
              className="bg-white/5 border-white/10 text-white hover:bg-white/10"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              {lang === "en" ? "Back" : "Zurück"}
            </Button>
            <Button
              variant="outline"
              onClick={() => setLang(lang === "en" ? "de" : "en")}
              className="bg-white/5 border-white/10 text-white hover:bg-white/10"
            >
              {lang === "en" ? "Deutsch" : "English"}
            </Button>
          </div>
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <Users className="w-16 h-16 text-blue-400" />
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
              {lang === "en" ? "Legal Notice" : "Impressum"}
            </h1>
            <p className="text-slate-400 text-lg">
              {lang === "en"
                ? "Last updated: July 20, 2025"
                : "Letzte Aktualisierung: 20. Juli 2025"}
            </p>
          </div>
        </div>

        {lang === "en" ? (
          <div className="bg-gradient-to-br from-white/5 via-white/5 to-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/10 text-slate-300 space-y-6">
            <section>
              <h2 className="text-2xl font-semibold mb-2">Responsible Person</h2>
              <p>
                Oliver - Alexander Darm<br />
                Gäßling 22<br />
                66564 Ottweiler<br />
                Germany
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-2">Contact</h2>
              <p>
                Email:{" "}
                <a
                  href="mailto:kiochat@kibaofficial.net"
                  className="text-blue-400 hover:text-blue-300"
                >
                  kiochat@kibaofficial.net
                </a>
              </p>
              {/* Telefonnummer kann hier ergänzt werden, falls gewünscht */}
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-2">Legal Information</h2>
              <p>
                I am operating this website as a private person with a small side
                business (Neben­gewerbe). There is no registration in a commercial
                register and no VAT ID.
              </p>
              <p>
                Responsible according to § 55 RStV (German Interstate Broadcasting
                Treaty): Oliver - Alexander Darm (address as above)
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-2">Disclaimer for External Links</h2>
              <p>
                This website may contain links to external websites of third parties,
                on whose contents I have no influence. Therefore, I cannot assume
                any liability for these external contents. The respective provider or
                operator of the linked sites is always responsible for their content.
                The linked pages were checked for possible legal violations at the
                time of linking. Illegal contents were not recognizable at the time
                of linking. However, a permanent control of the contents of the
                linked pages is not reasonable without concrete evidence of a
                violation of the law. Upon notification of violations, I will
                remove such links immediately.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-2">Privacy Policy</h2>
              <p>
                Please refer to the{" "}
                <a
                  href="/privacy"
                  className="text-blue-400 hover:text-blue-300"
                >
                  Privacy Policy
                </a>{" "}
                for information about data processing and your rights.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-2">Governing Law and Jurisdiction</h2>
              <p>
                This website is operated under German law. The exclusive place of
                jurisdiction for all disputes arising from this website is Saarbrücken,
                Germany.
              </p>
            </section>
          </div>
        ) : (
          <div className="bg-gradient-to-br from-white/5 via-white/5 to-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/10 text-slate-300 space-y-6">
            <section>
              <h2 className="text-2xl font-semibold mb-2">Verantwortlicher</h2>
              <p>
                Oliver - Alexander Darm<br />
                Gäßling 22<br />
                66564 Ottweiler<br />
                Deutschland
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-2">Kontakt</h2>
              <p>
                E-Mail:{" "}
                <a
                  href="mailto:kiochat@kibaofficial.net"
                  className="text-blue-400 hover:text-blue-300"
                >
                  kiochat@kibaofficial.net
                </a>
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-2">Rechtliche Hinweise</h2>
              <p>
                Ich betreibe diese Website als Privatperson mit einem kleinen
                Nebengewerbe. Es gibt keine Eintragung im Handelsregister und keine
                Umsatzsteuer-ID.
              </p>
              <p>
                Verantwortlich gemäß § 55 Abs. 2 RStV: Oliver - Alexander Darm (Adresse
                wie oben)
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-2">Haftung für externe Links</h2>
              <p>
                Diese Website kann Links zu externen Websites Dritter enthalten, auf
                deren Inhalte ich keinen Einfluss habe. Deshalb kann ich für diese
                fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der
                verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der
                Seiten verantwortlich. Die verlinkten Seiten wurden zum Zeitpunkt der
                Verlinkung auf mögliche Rechtsverstöße überprüft. Rechtswidrige
                Inhalte waren zum Zeitpunkt der Verlinkung nicht erkennbar. Eine
                permanente inhaltliche Kontrolle der verlinkten Seiten ist jedoch ohne
                konkrete Anhaltspunkte einer Rechtsverletzung nicht zumutbar. Bei
                Bekanntwerden von Rechtsverletzungen werde ich derartige Links
                unverzüglich entfernen.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-2">Datenschutzerklärung</h2>
              <p>
                Bitte beachten Sie die{" "}
                <a href="/privacy" className="text-blue-400 hover:text-blue-300">
                  Datenschutzerklärung
                </a>{" "}
                für Informationen über die Datenverarbeitung und Ihre Rechte.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-2">Anwendbares Recht und Gerichtsstand</h2>
              <p>
                Diese Website wird nach deutschem Recht betrieben. Ausschließlicher
                Gerichtsstand für alle Streitigkeiten aus dieser Website ist
                Saarbrücken, Deutschland.
              </p>
            </section>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImprintClient;
