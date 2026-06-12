import { NextResponse } from "next/server";
import { clientPromise } from "@/lib/mongodb";
import bcrypt from "bcryptjs";
import { generateToken } from "@/lib/jwt";

const ADMIN_EMAILS = [
  "admin@mydepartment.edu",
  "chairman@mydepartment.edu",
];

export async function POST(req) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, Email, and Password are required" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB || "departmentDB");

    const existingUser = await db.collection("users").findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const role = ADMIN_EMAILS.includes(email) ? "admin" : "user";

    const result = await db.collection("users").insertOne({
      name,
      email,
      password: hashedPassword,
      role,
      createdAt: new Date(),
    });

    const token = generateToken({
      id: result.insertedId.toString(),
      email,
      role,
    });

    const response = NextResponse.json(
      {
        message: "Registration successful",
        user: {
          id: result.insertedId.toString(),
          name,
          email,
          role,
        },
      },
      { status: 201 }
    );

    response.cookies.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}