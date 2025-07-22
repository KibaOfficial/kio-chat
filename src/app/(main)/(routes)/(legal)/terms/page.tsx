// Copyright (c) 2025 KibaOfficial
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft, FileText, Users, Globe } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const TermsPage = () => {
  const [lang, setLang] = useState("en");
  const router = useRouter();

  const lastUpdated = "July 20, 2025";

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
              <FileText className="w-16 h-16 text-blue-400" />
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
              {lang === "en" ? "Terms of Service" : "Nutzungsbedingungen"}
            </h1>
            <p className="text-slate-400 text-lg">
              {lang === "en"
                ? `Last updated: ${lastUpdated}`
                : `Letzte Aktualisierung: 20. Juli 2025`}
            </p>
          </div>
        </div>

        {lang === "en" ? (
          <div className="bg-gradient-to-br from-white/5 via-white/5 to-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/10 text-slate-300 space-y-6">
            <section>
              <h2 className="text-2xl font-semibold mb-2">1. Scope</h2>
              <p>
                These terms apply to the use of "Kio Chat", operated by Oliver -
                Alexander Darm.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-2">2. Permitted Use</h2>
              <p>Prohibited content includes:</p>
              <ul className="list-disc list-inside ml-6 space-y-1">
                <li>Hate speech, discrimination, threats, harassment</li>
                <li>Spam, unsolicited advertising, viruses</li>
                <li>Uploading illegal content</li>
                <li>Violation of copyrights</li>
                <li>Pornographic content</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-2">3. Age Restriction</h2>
              <p>Use is only permitted for persons aged 16 years or older.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-2">4. Account</h2>
              <p>
                Accounts can be created via email/password or OAuth (Discord, GitHub).
                Users are responsible for safeguarding their login credentials.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-2">5. Uploads</h2>
              <p>
                Maximum file size: <strong>10 MB</strong>
                <br />
                Allowed formats: JPEG, PNG, PDF, DOCX, MP3, WAV
                <br />
                Disallowed formats: ZIP, EXE, RAR and similar
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-2">6. Sanctions</h2>
              <p>
                The operator reserves the right to:
              </p>
              <ul className="list-disc list-inside ml-6 space-y-1">
                <li>Remove content violating these terms</li>
                <li>Suspend accounts temporarily or permanently</li>
                <li>Delete accounts permanently</li>
                <li>Initiate legal proceedings if necessary</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-2">7. Liability</h2>
              <p>
                Use of this service is at your own risk. The operator is not liable
                for:
              </p>
              <ul className="list-disc list-inside ml-6 space-y-1">
                <li>Data loss</li>
                <li>Damages caused by third-party content</li>
                <li>Technical failures</li>
              </ul>
              <p>
                The operator disclaims all warranties to the fullest extent permitted
                by law.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-2">8. Changes</h2>
              <p>
                The operator may change these terms at any time. Changes will be
                communicated via the website and take effect immediately upon
                publication.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-2">9. Governing Law and Jurisdiction</h2>
              <p>
                These terms are governed by German law. The exclusive place of
                jurisdiction is Saarbrücken, Germany.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-2">10. Contact</h2>
              <p>
                For questions or complaints, please contact:{" "}
                <a
                  href="mailto:kiochat@kibaofficial.net"
                  className="text-blue-400 hover:text-blue-300"
                >
                  kiochat@kibaofficial.net
                </a>
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-2">11. Severability</h2>
              <p>
                If any provision of these terms is invalid, illegal, or unenforceable,
                the remaining provisions remain unaffected.
              </p>
            </section>
          </div>
        ) : (
          <div className="bg-gradient-to-br from-white/5 via-white/5 to-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/10 text-slate-300 space-y-6">
            <section>
              <h2 className="text-2xl font-semibold mb-2">1. Geltungsbereich</h2>
              <p>
                Diese Bedingungen gelten für die Nutzung von „Kio Chat“, betrieben von
                Oliver - Alexander Darm.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-2">2. Zulässige Nutzung</h2>
              <p>Verbotene Inhalte sind:</p>
              <ul className="list-disc list-inside ml-6 space-y-1">
                <li>Hassrede, Diskriminierung, Bedrohung, Belästigung</li>
                <li>Spam, unerwünschte Werbung, Viren</li>
                <li>Hochladen illegaler Inhalte</li>
                <li>Verletzung von Urheberrechten</li>
                <li>Pornografische Inhalte</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-2">3. Altersbeschränkung</h2>
              <p>Die Nutzung ist nur Personen ab 16 Jahren gestattet.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-2">4. Account</h2>
              <p>
                Accounts können per E-Mail/Passwort oder OAuth (Discord, GitHub)
                erstellt werden. Nutzer sind verantwortlich für den Schutz ihrer
                Zugangsdaten.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-2">5. Uploads</h2>
              <p>
                Maximale Dateigröße: <strong>10 MB</strong>
                <br />
                Erlaubte Formate: JPEG, PNG, PDF, DOCX, MP3, WAV
                <br />
                Nicht erlaubte Formate: ZIP, EXE, RAR und ähnliche
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-2">6. Sanktionen</h2>
              <p>
                Der Betreiber behält sich das Recht vor:
              </p>
              <ul className="list-disc list-inside ml-6 space-y-1">
                <li>Inhalte, die gegen diese Bedingungen verstoßen, zu entfernen</li>
                <li>Accounts vorübergehend oder dauerhaft zu sperren</li>
                <li>Accounts dauerhaft zu löschen</li>
                <li>Rechtliche Schritte einzuleiten</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-2">7. Haftung</h2>
              <p>
                Die Nutzung dieses Dienstes erfolgt auf eigenes Risiko. Der Betreiber
                haftet nicht für:
              </p>
              <ul className="list-disc list-inside ml-6 space-y-1">
                <li>Datenverlust</li>
                <li>Schäden durch Inhalte Dritter</li>
                <li>Technische Ausfälle</li>
              </ul>
              <p>
                Der Betreiber schließt alle Gewährleistungen im gesetzlich zulässigen
                Umfang aus.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-2">8. Änderungen</h2>
              <p>
                Der Betreiber kann diese Bedingungen jederzeit ändern. Änderungen
                werden über die Website kommuniziert und sind mit Veröffentlichung
                sofort wirksam.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-2">9. Anwendbares Recht und Gerichtsstand</h2>
              <p>
                Es gilt deutsches Recht. Ausschließlicher Gerichtsstand ist
                Saarbrücken, Deutschland.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-2">10. Kontakt</h2>
              <p>
                Für Fragen oder Beschwerden kontaktieren Sie bitte:{" "}
                <a
                  href="mailto:kiochat@kibaofficial.net"
                  className="text-blue-400 hover:text-blue-300"
                >
                  kiochat@kibaofficial.net
                </a>
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-2">11. Salvatorische Klausel</h2>
              <p>
                Sollte eine Bestimmung dieser Bedingungen unwirksam sein, bleibt die
                Wirksamkeit der übrigen Bestimmungen unberührt.
              </p>
            </section>
          </div>
        )}
      </div>
    </div>
  );
};

export default TermsPage;
