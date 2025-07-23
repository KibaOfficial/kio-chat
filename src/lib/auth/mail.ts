// Copyright (c) 2025 KibaOfficial
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import nodemailer from "nodemailer";

export const sendVerificationEmail = async (
  email: string,
  token: string
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
          <h1 style="color: #333;">Welcome to Kio-Chat!</h1>
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
    
  } catch (error) {
    console.error("Error sending verification email:", error);
    throw new Error(`Failed to send verification email: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}