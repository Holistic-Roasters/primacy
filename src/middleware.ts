import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ACCESS_TOKEN } from "./constants/AUTH";

export function middleware(request: NextRequest) {
  const token = request.cookies.get(ACCESS_TOKEN);

  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
