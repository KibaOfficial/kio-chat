// Copyright (c) 2025 KibaOfficial
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft, Shield, Users, Globe } from "lucide-react";
import { useRouter } from "next/navigation";
import { Suspense, useState } from "react";

const PrivacyPage = () => {
  const [lang, setLang] = useState("en");
  const router = useRouter();

  const lastUpdated = "July 20, 2025";

  return (
    <Suspense fallback={<div className="text-center text-white py-12">Loading...</div>}>
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
              <Shield className="w-16 h-16 text-blue-400" />
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
              {lang === "en" ? "Privacy Policy" : "Datenschutzerklärung"}
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
              <h2 className="text-2xl font-semibold mb-2">1. Controller</h2>
              <p>
                Responsible for data processing on this website is:
                <br />
                <strong>Oliver - Alexander Darm</strong>
                <br />
                Gäßling 22
                <br />
                66564 Ottweiler
                <br />
                Germany
                <br />
                Email:{" "}
                <a
                  href="mailto:kiochat@kibaofficial.net"
                  className="text-blue-400 hover:text-blue-300"
                >
                  kiochat@kibaofficial.net
                </a>
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-2">2. Data We Collect</h2>
              <p>
                We collect the following personal data from users:
              </p>
              <ul className="list-disc list-inside ml-6 space-y-1">
                <li>Email addresses</li>
                <li>Usernames</li>
                <li>IP addresses</li>
                <li>Device information (browser, OS, etc.)</li>
                <li>Cookies and LocalStorage</li>
                <li>Chat messages and file uploads</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-2">3. Purpose of Data Processing</h2>
              <p>
                Data is processed to:
              </p>
              <ul className="list-disc list-inside ml-6 space-y-1">
                <li>Provide the service and enable communication</li>
                <li>Manage user accounts (registration/login)</li>
                <li>Ensure technical security</li>
                <li>Support future analytics features (Matomo)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-2">4. Legal Basis</h2>
              <p>
                The legal basis under GDPR Art. 6(1) is:
              </p>
              <ul className="list-disc list-inside ml-6 space-y-1">
                <li>
                  <strong>(a)</strong> Consent (e.g., at registration)
                </li>
                <li>
                  <strong>(b)</strong> Contract fulfillment (use of the service)
                </li>
                <li>
                  <strong>(f)</strong> Legitimate interest (security, troubleshooting)
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-2">5. Data Retention</h2>
              <p>
                Data is stored as long as the user actively uses the service.
                After account deletion, personal data is permanently removed,
                including backups.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-2">6. Data Sharing</h2>
              <p>
                Data is not shared with third parties except technical service
                providers (e.g., hosting) under GDPR-compliant contracts.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-2">7. Analytics & Tracking</h2>
              <p>
                Currently, no analytics tools are used. Future plans include
                self-hosted Matomo with anonymized IP addresses.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-2">8. Your Rights</h2>
              <p>
                You have the right to:
              </p>
              <ul className="list-disc list-inside ml-6 space-y-1">
                <li>Access your data</li>
                <li>Rectify or delete your data</li>
                <li>Restrict processing</li>
                <li>Object to processing</li>
                <li>Data portability</li>
              </ul>
              <p>
                Requests can be sent to:{" "}
                <a
                  href="mailto:kiochat@kibaofficial.net"
                  className="text-blue-400 hover:text-blue-300"
                >
                  kiochat@kibaofficial.net
                </a>
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-2">9. Cookies & LocalStorage</h2>
              <p>
                Cookies and LocalStorage are used only for technical purposes (e.g.,
                login sessions). No third-party tracking is performed.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-2">10. Children</h2>
              <p>
                Use of this service is not permitted for persons under 16 years of
                age.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-2">11. Data Protection Officer</h2>
              <p>
                No data protection officer is appointed as this is a small-scale
                operation.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-2">12. Complaints</h2>
              <p>
                You can complain to the data protection authority if you believe
                your rights have been violated.
              </p>
              <p>
                Contact:{" "}
                <a
                  href="https://www.datenschutz.saarland.de/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300"
                >
                  Saarland Data Protection Authority
                </a>
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-2">13. Changes to this Policy</h2>
              <p>
                Changes will be communicated via the website and are effective
                immediately upon publication.
              </p>
            </section>
          </div>
        ) : (
          <div className="bg-gradient-to-br from-white/5 via-white/5 to-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/10 text-slate-300 space-y-6">
            <section>
              <h2 className="text-2xl font-semibold mb-2">1. Verantwortlicher</h2>
              <p>
                Verantwortlich für die Datenverarbeitung auf dieser Website ist:
                <br />
                <strong>Oliver - Alexander Darm</strong>
                <br />
                Gäßling 22
                <br />
                66564 Ottweiler
                <br />
                Deutschland
                <br />
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
              <h2 className="text-2xl font-semibold mb-2">2. Erhobene Daten</h2>
              <p>Wir erheben folgende personenbezogene Daten von Nutzer:innen:</p>
              <ul className="list-disc list-inside ml-6 space-y-1">
                <li>E-Mail-Adressen</li>
                <li>Benutzernamen</li>
                <li>IP-Adressen</li>
                <li>Geräteinformationen (Browser, Betriebssystem etc.)</li>
                <li>Cookies und LocalStorage</li>
                <li>Chatnachrichten und Dateiuploads</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-2">3. Zweck der Datenverarbeitung</h2>
              <p>Daten werden verarbeitet, um:</p>
              <ul className="list-disc list-inside ml-6 space-y-1">
                <li>Den Dienst bereitzustellen und Kommunikation zu ermöglichen</li>
                <li>Accounts zu verwalten (Registrierung/Login)</li>
                <li>Technische Sicherheit zu gewährleisten</li>
                <li>Zukünftige Analysefunktionen (Matomo) zu unterstützen</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-2">4. Rechtsgrundlage</h2>
              <p>Rechtsgrundlage gemäß Art. 6 Abs. 1 DSGVO ist:</p>
              <ul className="list-disc list-inside ml-6 space-y-1">
                <li>
                  <strong>Lit. a</strong> – Einwilligung (z. B. bei Registrierung)
                </li>
                <li>
                  <strong>Lit. b</strong> – Vertragserfüllung (Nutzung des Dienstes)
                </li>
                <li>
                  <strong>Lit. f</strong> – berechtigtes Interesse (Sicherheit,
                  Fehlerbehebung)
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-2">5. Speicherdauer</h2>
              <p>
                Daten werden so lange gespeichert, wie der Nutzer den Dienst aktiv
                verwendet. Nach Accountlöschung werden personenbezogene Daten
                dauerhaft entfernt, einschließlich Backups.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-2">6. Weitergabe an Dritte</h2>
              <p>
                Es erfolgt keine Weitergabe der Daten an Dritte, außer an technische
                Dienstleister (z. B. Hosting) im Rahmen DSGVO-konformer Verträge.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-2">7. Analyse & Tracking</h2>
              <p>
                Derzeit werden keine Analyse-Tools verwendet. Geplant ist der
                Einsatz von selbstgehostetem Matomo mit anonymisierten IPs.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-2">8. Betroffenenrechte</h2>
              <p>Du hast das Recht auf:</p>
              <ul className="list-disc list-inside ml-6 space-y-1">
                <li>Auskunft über deine Daten</li>
                <li>Berichtigung oder Löschung</li>
                <li>Einschränkung der Verarbeitung</li>
                <li>Widerspruch gegen Verarbeitung</li>
                <li>Datenübertragbarkeit</li>
              </ul>
              <p>
                Anfragen bitte an:{" "}
                <a
                  href="mailto:kiochat@kibaofficial.net"
                  className="text-blue-400 hover:text-blue-300"
                >
                  kiochat@kibaofficial.net
                </a>
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-2">9. Cookies & LocalStorage</h2>
              <p>
                Cookies und LocalStorage werden nur für technische Zwecke (z. B.
                Login) genutzt. Kein Tracking durch Dritte.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-2">10. Kinder</h2>
              <p>
                Die Nutzung des Dienstes ist Personen unter 16 Jahren nicht gestattet.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-2">11. Datenschutzbeauftragter</h2>
              <p>
                Es wurde kein Datenschutzbeauftragter benannt, da es sich um einen
                Kleinbetrieb handelt.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-2">12. Beschwerden</h2>
              <p>
                Du kannst dich bei der Datenschutzbehörde beschweren, falls du der
                Meinung bist, dass deine Rechte verletzt wurden.
              </p>
              <p>
                Kontakt:{" "}
                <a
                  href="https://www.datenschutz.saarland.de/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300"
                >
                  Datenschutzbehörde Saarland
                </a>
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-2">13. Änderungen</h2>
              <p>
                Änderungen werden über die Website kommuniziert und sind mit
                Veröffentlichung sofort wirksam.
              </p>
            </section>
          </div>
        )}
      </div>
    </div>
    </Suspense>
  );
};

export default PrivacyPage;
