// Copyright (c) 2025 KibaOfficial
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { PrismaClient } from "@prisma/client";

const gloablForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
}

export const prisma = gloablForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== "production") {
  gloablForPrisma.prisma = prisma;
}