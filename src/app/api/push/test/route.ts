// Test endpoint to send a manual push notification
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { targetUserId, message } = await req.json();

    if (!targetUserId || !message) {
      return NextResponse.json({ error: "Missing targetUserId or message" }, { status: 400 });
    }

    // Send test notification via backend
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:4269';
    
    const response = await fetch(`${backendUrl}/test-push`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: targetUserId,
        title: 'Test Notification',
        body: message,
        data: {
          type: 'test',
          from: session.user.name
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      return NextResponse.json({ 
        error: "Backend push test failed", 
        details: errorData 
      }, { status: 500 });
    }

    const result = await response.json();
    return NextResponse.json({ 
      success: true, 
      message: "Test notification sent",
      result 
    });

  } catch (error) {
    console.error("Push test error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
