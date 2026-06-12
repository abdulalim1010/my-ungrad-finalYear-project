import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

function verifyToken(token) {
  if (!JWT_SECRET) {
    return null;
  }
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}

export function middleware(req) {
  const token = req.cookies.get("auth_token")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/auth", req.url));
  }

  const decoded = verifyToken(token);

  if (!decoded) {
    return NextResponse.redirect(new URL("/auth", req.url));
  }

  if (req.nextUrl.pathname.startsWith("/admin")) {
    if (decoded.role?.toLowerCase() !== "admin") {
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};