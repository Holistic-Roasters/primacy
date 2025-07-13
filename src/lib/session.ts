import { cookies } from "next/headers";
import { TOKEN_COOKIE } from "@/constants/AUTH";

export async function saveAccessToken(token: string) {
  (await cookies()).set(TOKEN_COOKIE, token, {
    httpOnly: true,
    secure: true,
    path: "/",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 1 week
  });
}

export async function getAccessToken(): string | null {
  const cookieStore = await cookies();
  return cookieStore.get(TOKEN_COOKIE)?.value || null;
}

export async function clearAccessToken() {
  (await cookies()).set(TOKEN_COOKIE, "", {
    httpOnly: true,
    secure: true,
    path: "/",
    sameSite: "lax",
    maxAge: 0,
  });
}
