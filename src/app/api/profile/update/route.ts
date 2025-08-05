// Copyright (c) 2025 KibaOfficial
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import bcrypt from "bcryptjs";

// Type for user update data
interface UserUpdateData {
  name?: string;
  description?: string | null;
  image?: string | null;
  password?: string;
}

// Validation helper functions
const isValidDescription = (description: unknown): boolean => {
  if (description === undefined || description === null) return true;
  if (typeof description !== "string") return false;
  return description.trim().length <= 200;
};

export async function PATCH(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { name, description, image, password } = body;

    // Validate name (required)
    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return NextResponse.json(
        { error: "Name is required" },
        { status: 400 }
      );
    }

    if (name.trim().length > 50) {
      return NextResponse.json(
        { error: "Name must be 50 characters or less" },
        { status: 400 }
      );
    }

    // Validate description (optional)
    if (!isValidDescription(description)) {
      return NextResponse.json(
        { error: "Description must be 200 characters or less" },
        { status: 400 }
      );
    }

    // Update user profile
    const updateData: UserUpdateData = {};

    // Always update name (it's required)
    updateData.name = name.trim();
    
    // Handle description update (optional) - preserve empty strings
    updateData.description = (description === undefined || description === null) ? null : description.trim();

    // Handle image update (optional)
    if (image !== undefined) {
      updateData.image = image === "" ? null : image;
    }

    // Handle password update (optional) 
    if (password && typeof password === "string" && password.length >= 6) {
      // Hash password securely before storing
      const hashedPassword = await bcrypt.hash(password, 12);
      updateData.password = hashedPassword;
    }

    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: updateData,
      select: {
        id: true,
        name: true,
        image: true,
        description: true,
      }
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}