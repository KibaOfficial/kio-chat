// Debug endpoint to check push subscriptions
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get all push subscriptions for this user
    const subscriptions = await prisma.pushSubscription.findMany({
      where: { userId: session.user.id },
      select: {
        id: true,
        endpoint: true,
        userAgent: true,
        createdAt: true
      }
    });

    // Get all users and their subscription count
    const allUsers = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        _count: {
          select: {
            pushSubscriptions: true
          }
        }
      }
    });

    return NextResponse.json({
      currentUser: {
        id: session.user.id,
        name: session.user.name,
        subscriptions: subscriptions
      },
      allUsers: allUsers,
      vapidConfigured: !!process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
    });

  } catch (error) {
    console.error("Push debug error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
