// Copyright (c) 2025 KibaOfficial
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
export const runtime = "nodejs";
import { prisma } from "@/lib/prisma";
import { generateVerificationToken } from "@/lib/auth/tokens";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { sendVerificationEmail } from "@/lib/auth/mail";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { username, email, password } = body;

    if (!username || !email || !password) {
      return new NextResponse(JSON.stringify({ error: "All fields are required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const normalizedEmail = email.toLowerCase();

    // check if user with email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingUser) {
      return new NextResponse(
        JSON.stringify({ error: "User with this email already exists" }),
        {
          status: 409,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // create user
    const user = await prisma.user.create({
      data: {
        name: username,
        email: normalizedEmail,
        password: hashedPassword,
      }
    });

    const verificationToken = await generateVerificationToken(normalizedEmail);
    try {
      await sendVerificationEmail(normalizedEmail, verificationToken.token);
    } catch (error) {
      console.error("Error sending verification email:", error);
      return new NextResponse(
        JSON.stringify({ error: "Failed to send verification email" }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    return new NextResponse(
      JSON.stringify({ message: "User registered successfully. Please check your email to verify your account." }),
      {
        status: 201,
        headers: { "Content-Type": "application/json" },
      }
    );

  } catch (error) {
    console.error("Registration error:", error);
    return new NextResponse(
      JSON.stringify({ error: "Internal server error" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}