// Copyright (c) 2025 KibaOfficial
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
"use server";

import { prisma } from "../prisma";
import { getVerificationTokenByToken } from "./tokens";

export const Verification = async (token: string) => {
  const existingToken = await getVerificationTokenByToken(token);

  if (!existingToken) {
    return { error: "Invalid or expired verification token." };
  }

  const hasExpired = existingToken.expires < new Date();

  if (hasExpired) {
    return { error: "Verification token has expired." };
  }

  const user = await prisma.user.findUnique({
    where: { email: existingToken.identifier },
  });

  if (!user) {
    return { error: "User not found." };
  }

  // Mark user as verified
  await prisma.user.update({
    where: { email: user.email },
    data: { emailVerified: true },
  });

  // For dev only, In prod we would not need a 2 second delay
  setTimeout(async () => {
    await prisma.verificationToken.delete({
      where: { token: existingToken.token },
    });
  }, 2000);

  return { success: true, message: "Email verified successfully." };
}