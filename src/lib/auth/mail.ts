// Copyright (c) 2025 KibaOfficial
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import nodemailer from "nodemailer";
import { ImapFlow } from "imapflow";

export const sendVerificationEmail = async (
  email: string,
  token: string,
  name?: string
): Promise<void> => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT || "587"),
      secure: process.env.EMAIL_PORT === "465", // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Verify connection configuration
    await transporter.verify();

    const confirmLink = `${process.env.AUTH_URL}/auth/verify?token=${token}`;

    const mail = {
      from: `Kio-Auth <${process.env.EMAIL_USER}>`, // EMAIL_USER sollte bereits vollständige E-Mail sein
      to: email,
      subject: "Confirm your email",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #333;">Welcome to Kio-Chat${name ? `, ${name}` : ''}!</h1>
          <p>Thank you for registering. Please confirm your email address by clicking the button below:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${confirmLink}" 
               style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Confirm Email
            </a>
          </div>
          <p><strong>Or copy and paste this link:</strong></p>
          <p style="word-break: break-all; color: #666;">${confirmLink}</p>
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
          <p style="color: #666; font-size: 14px;">If you did not register for this account, please ignore this email.</p>
        </div>
      `,
      // Zusätzlich Text-Version für bessere Kompatibilität
      text: `
        Welcome to Kio-Chat!
        
        Thank you for registering. Please confirm your email address by visiting this link:
        ${confirmLink}
        
        If you did not register for this account, please ignore this email.
      `,
    };

    const info = await transporter.sendMail(mail);
    console.log("Verification email sent successfully:", info.messageId);
    
    // Save sent email to IMAP Sent folder
    await saveSentEmailToIMAP(mail, info.messageId);
    
  } catch (error) {
    console.error("Error sending verification email:", error);
    throw new Error(`Failed to send verification email: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

const saveSentEmailToIMAP = async (mailOptions: any, messageId: string): Promise<void> => {
  try {
    const client = new ImapFlow({
      host: process.env.EMAIL_HOST || '',
      port: parseInt(process.env.EMAIL_IMAP_PORT || "993"),
      secure: true,
      auth: {
        user: process.env.EMAIL_USER || '',
        pass: process.env.EMAIL_PASS || '',
      },
      logger: false, // Disable logging for production
    });

    await client.connect();

    // Create the email message in RFC822 format
    const date = new Date().toUTCString();
    const rfc822Message = [
      `Message-ID: <${messageId}>`,
      `Date: ${date}`,
      `From: ${mailOptions.from}`,
      `To: ${mailOptions.to}`,
      `Subject: ${mailOptions.subject}`,
      `MIME-Version: 1.0`,
      `Content-Type: multipart/alternative; boundary="boundary123"`,
      ``,
      `--boundary123`,
      `Content-Type: text/plain; charset=UTF-8`,
      ``,
      mailOptions.text,
      ``,
      `--boundary123`,
      `Content-Type: text/html; charset=UTF-8`,
      ``,
      mailOptions.html,
      ``,
      `--boundary123--`,
    ].join('\r\n');

    // Append to Sent folder (try common sent folder names)
    const sentFolders = ['Sent', 'INBOX.Sent', 'Sent Messages', 'Sent Items'];
    let savedToSent = false;

    for (const folderName of sentFolders) {
      try {
        // Try to select the folder to check if it exists
        await client.mailboxOpen(folderName);
        await client.append(folderName, rfc822Message, ['\\Seen']);
        console.log(`Email saved to ${folderName} folder successfully`);
        savedToSent = true;
        break;
      } catch (folderError) {
        console.log(`Could not save to ${folderName}:`, folderError);
        continue;
      }
    }

    // If no standard sent folder found, try to create one
    if (!savedToSent) {
      try {
        await client.mailboxCreate('Sent');
        await client.append('Sent', rfc822Message, ['\\Seen']);
        console.log('Created Sent folder and saved email');
        savedToSent = true;
      } catch (createError) {
        console.log('Could not create Sent folder:', createError);
      }
    }

    if (!savedToSent) {
      console.warn('Could not save email to any Sent folder');
    }

    await client.logout();

  } catch (error) {
    console.error('Error saving sent email to IMAP:', error);
    // Don't throw here - we don't want to fail the entire email send if IMAP save fails
  }
};