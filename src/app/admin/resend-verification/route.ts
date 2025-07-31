import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { sendVerificationEmail } from "@/lib/auth/mail";
import crypto from "crypto";

export async function POST(request: NextRequest) {
  try {
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

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true, emailVerified: true }
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    if (user.emailVerified) {
      return new NextResponse("User email already verified", { status: 400 });
    }

    // Generate new verification token
    const token = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Create new verification token - if one exists for this email+token combo, it will be unique violation handled gracefully
    // Since token is random, this should not conflict
    await prisma.verificationToken.create({
      data: {
        identifier: user.email,
        token: token,
        expires: expires
      }
    });

    // Send verification email
    await sendVerificationEmail(user.email, token, user.name);
    console.log(`Verification email sent to ${user.email}`);

    const url = new URL("/admin", request.url);
    return NextResponse.redirect(url, 303);
  } catch (error) {
    console.error("Error resending verification:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}