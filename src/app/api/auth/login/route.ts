import { NextResponse } from "next/server";

import { generateCodeChallenge, generateCodeVerifier } from "@/lib/pkce"; // we'll define this
import { PKCE_VERIFIER } from "@/constants/AUTH";

export async function GET() {
  const shopId = process.env.SHOPIFY_ID; // Replace with your actual shop_id
  const clientId = process.env.SHOPIFY_CLIENT_ID!;
  const redirectUri = process.env.NEXT_PUBLIC_SHOPIFY_REDIRECT_URI!;

  const verifier = generateCodeVerifier();
  const challenge = await generateCodeChallenge(verifier);

  // Save verifier in cookie or encrypted storage
  const res = NextResponse.redirect(
    `https://shopify.com/authentication/${shopId}/oauth/authorize?` +
      new URLSearchParams({
        client_id: clientId,
        scope: "openid email customer-account-api:full",
        response_type: "code",
        redirect_uri: redirectUri,
        state: "secureRandomState123",
        nonce: "secureNonce123",
        code_challenge: challenge,
        code_challenge_method: "S256",
      }).toString()
  );

  res.cookies.set(PKCE_VERIFIER, verifier, {
    httpOnly: true,
    secure: true,
    path: "/",
    maxAge: 300,
  });

  return res;
}

export const dynamic = "force-dynamic"; // Ensure this route is always fresh
export const revalidate = 0; // Disable static generation for this route
export const runtime = "edge"; // Use edge runtime for better performance
export const preferredRegion = "global"; // Use global region for edge functions
export const fetchCache = "force-no-store"; // Disable caching for this route
