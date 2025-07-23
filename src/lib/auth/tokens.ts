// Copyright (c) 2025 KibaOfficial
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { prisma } from "../prisma";
import { v4 as uuidv4 } from "uuid";

const VERIFICATION_TOKEN_EXPIRATION_MS = 1000 * 60 * 60; // 1 hour

export const getVerificationTokenByEmail = async (email: string) => {
  try {
    return await prisma.verificationToken.findFirst({
      where: { identifier: email }
    });
  } catch (error) {
    console.error("Error fetching verification token:", error);
    return null;
  }
};

export const generateVerificationToken = async (email: string) => {
  const token = uuidv4();
  const expires = new Date(Date.now() + VERIFICATION_TOKEN_EXPIRATION_MS);

  const existingToken = await getVerificationTokenByEmail(email);
  if (existingToken) {
    await prisma.verificationToken.delete({
      where: { token: existingToken.token }
    });
  }

  const newToken = await prisma.verificationToken.create({
    data: {
      identifier: email,
      token,
      expires
    }
  });

  return newToken;
};

export const getVerificationTokenByToken = async (
  token: string
) => {
  try {
    const verificationToken = await prisma.verificationToken.findUnique({
      where: { token }
    });

    return verificationToken;
  } catch (error) {
    console.error("Error fetching verification token by token:", error);
    return null;
  }
}