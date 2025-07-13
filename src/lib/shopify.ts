export async function shopifyFetch<T = any>(
  query: string,
  variables?: Record<string, any>
): Promise<T> {
  const domain = process.env.SHOPIFY_STORE_DOMAIN;
  const token = process.env.SHOPIFY_STOREFRONT_TOKEN;
  const apiVersion = process.env.SHOPIFY_API_VERSION;

  if (!domain || !token) {
    throw new Error("Missing Shopify environment variables");
  }

  const res = await fetch(`https://${domain}/api/${apiVersion}/graphql.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": token,
    },
    body: JSON.stringify({ query, variables }),
    next: { revalidate: 60 }, // For Next.js cache, optional
  });

  const json = await res.json();
  if (json.errors) {
    throw new Error(JSON.stringify(json.errors));
  }
  return json.data;
}
