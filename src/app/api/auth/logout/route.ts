import { ACCESS_TOKEN } from "@/constants/AUTH";
import { NextResponse } from "next/server";

export async function GET() {
  const redirectUri = process.env.NEXT_PUBLIC_SHOPIFY_REDIRECT_URI!;

  const response = NextResponse.redirect(`${redirectUri}/`);
  response.cookies.set(ACCESS_TOKEN, "", {
    httpOnly: true,
    secure: true,
    path: "/",
    sameSite: "lax",
    maxAge: 0,
  });

  return response;
}
