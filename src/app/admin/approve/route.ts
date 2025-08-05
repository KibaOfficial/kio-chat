import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { auth } from "@/auth";

export async function POST(request: Request) {
  // Check admin authentication
  const session = await auth();
  const adminEmail = "kiba@kibaofficial.net";
  
  if (!session?.user?.email || session.user.email !== adminEmail) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const formData = await request.formData();
  const userId = formData.get("userId") as string;
  if (!userId) {
    return new NextResponse("Missing userId", { status: 400 });
  }
  await prisma.user.update({
    where: { id: userId },
    data: { approved: true },
  });
  // Redirect back to admin page (303 for browser compatibility)
  return NextResponse.redirect("/admin", 303);
}
