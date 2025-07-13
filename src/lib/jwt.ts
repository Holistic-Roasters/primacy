export function decodeJwt(token: string | undefined) {
  if (!token || typeof token !== "string" || !token.includes(".")) return null;
  const [, payload] = token.split(".");
  try {
    const decodedPayload = JSON.parse(atob(payload));
    return decodedPayload;
  } catch {
    return null;
  }
}
