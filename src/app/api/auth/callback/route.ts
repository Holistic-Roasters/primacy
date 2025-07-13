import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { decodeJwt } from "@/lib/jwt";
import {
  ACCESS_TOKEN,
  CUSTOMER_INFO,
  PKCE_VERIFIER,
  REFRESH_TOKEN,
} from "@/constants/AUTH";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const redirectUri = process.env.NEXT_PUBLIC_SHOPIFY_REDIRECT_URI!;
  const verifier = (await cookies()).get(PKCE_VERIFIER)?.value;

  if (!code || !verifier) {
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/error`);
  }

  const body = new URLSearchParams({
    grant_type: "authorization_code",
    client_id: process.env.SHOPIFY_CLIENT_ID!,
    redirect_uri: redirectUri,
    code,
    code_verifier: verifier,
  });

  const response = await fetch(process.env.SHOPIFY_TOKEN_ENDPOINT!, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  });

  const tokenData = await response.json();
  const { access_token, refresh_token, id_token, expires_in } = tokenData;

  const res = NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/`);

  if (access_token) {
    res.cookies.set(ACCESS_TOKEN, access_token, {
      httpOnly: true,
      secure: true,
      path: "/",
      maxAge: expires_in || 3600,
    });
  }
  if (refresh_token) {
    res.cookies.set(REFRESH_TOKEN, refresh_token, {
      httpOnly: true,
      secure: true,
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });
  }
  if (id_token) {
    const customer = decodeJwt(id_token);
    res.cookies.set(CUSTOMER_INFO, JSON.stringify(customer), {
      httpOnly: false,
      secure: true,
      path: "/",
      maxAge: expires_in || 3600,
    });
  }

  return res;
}
