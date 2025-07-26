import { prisma } from "@/lib/prisma";

export async function getChats(userId: string) {
  return prisma.chat.findMany({
    where: {
      users: {
        some: {
          userId,
        },
      },
    },
    include: {
      users: {
        include: {
          user: true,
        },
      },
      messages: {
        orderBy: { createdAt: "desc" },
        take: 1,
      },
    },
  });
}
