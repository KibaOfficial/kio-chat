import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
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
