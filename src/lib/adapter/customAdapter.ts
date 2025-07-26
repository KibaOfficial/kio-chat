// Copyright (c) 2025 KibaOfficial
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import { PrismaAdapter } from "@auth/prisma-adapter";

const customAdapter = (prisma: any) => {
  const originalAdapter = PrismaAdapter(prisma);
  return {
    ...originalAdapter,
    createUser: async (data: any) => {
      const emailVerified = data.emailVerified ?? false;
      return prisma.user.create({
        data: {
          ...data,
          emailVerified,
        },
      });
    },
  };
};

export default customAdapter;
