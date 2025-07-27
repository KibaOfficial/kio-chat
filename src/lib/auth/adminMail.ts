// Sends an admin notification email for new user registrations
import nodemailer from "nodemailer";

export const sendAdminRegistrationNotification = async (
  user: { name: string; email: string },
  userAgent: string,
  timestamp: string
): Promise<void> => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT || "587"),
      secure: process.env.EMAIL_PORT === "465",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.verify();

    const mail = {
      from: `Kio-Auth <${process.env.EMAIL_USER}>`,
      to: "kiba@kibaofficial.net",
      subject: "Neue Registrierung wartet auf Freigabe",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Neue Benutzerregistrierung</h2>
          <p><strong>Name:</strong> ${user.name}</p>
          <p><strong>Email:</strong> ${user.email}</p>
          <p><strong>User-Agent:</strong> ${userAgent}</p>
          <p><strong>Zeitpunkt:</strong> ${timestamp}</p>
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
          <p style="color: #666; font-size: 14px;">Bitte prüfe und genehmige den Benutzer im Admin-Panel.</p>
        </div>
      `,
      text: `Neue Benutzerregistrierung\nName: ${user.name}\nEmail: ${user.email}\nUser-Agent: ${userAgent}\nZeitpunkt: ${timestamp}`,
    };

    await transporter.sendMail(mail);
  } catch (error) {
    console.error("Error sending admin registration notification:", error);
    throw new Error(`Failed to send admin registration notification: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};
