// Copyright (c) 2025 KibaOfficial
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { getCurrentUser } from "@/lib/user/current-profile";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json({ error: "Unauthorized: No user session found." }, { status: 401 });
    }

    const body = await req.json();
    const { name, image, password } = body;

    const updateData: any = {};

    if (name) updateData.name = name;
    if (image) updateData.image = image;

    if (password && password.length >= 6) {
      updateData.password = await bcrypt.hash(password, 12);
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: "No valid fields to update." }, { status: 400 });
    }

    await prisma.user.update({
      where: { id: user.id },
      data: updateData,
    });
    
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("User profile update error:", error);
    return NextResponse.json({ 
      error: "Update failed", 
      details: error instanceof Error ? error.message : String(error) 
    }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized: No user session found." }, { status: 401 });
  }

  return NextResponse.json({ user }, { status: 200 });
}