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

export async function getChatById(chatId: string) {
  return prisma.chat.findUnique({
    where: { id: chatId },
    include: {
      users: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              // email: true, // not needed now we're gonna display only username maybe in future or make it optional via profile settings
              image: true,
            },
          }
        },
      },
      messages: {
        orderBy: { createdAt: "desc" },
      },
    },
  });
}

export async function createChat(userId: string, targetUserId: string, isGroup: boolean = false) {
  return prisma.chat.create({
    data: {
      isGroup,
      users: {
        create: [
          { userId },
          { userId: targetUserId },
        ],
      },
      messages: {
        create: [],
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