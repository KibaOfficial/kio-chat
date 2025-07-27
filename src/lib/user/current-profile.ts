// Copyright (c) 2025 KibaOfficial
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { auth } from "@/auth";
import { prisma } from "../prisma";

export const getCurrentUser = async () => {
  const session = await auth();

  if (!session?.user?.id) return null;

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  })

  return user;
}