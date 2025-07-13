const SHOPIFY_DOMAIN = process.env.SHOPIFY_STORE_DOMAIN!;
const SHOPIFY_STOREFRONT_TOKEN = process.env.SHOPIFY_STOREFRONT_TOKEN!;

export async function shopifyFetchCart(query: string, variables = {}) {
  const res = await fetch(
    `https://${SHOPIFY_DOMAIN}/api/2023-10/graphql.json`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": SHOPIFY_STOREFRONT_TOKEN,
      },
      body: JSON.stringify({ query, variables }),
      cache: "no-store",
    }
  );
  const json = await res.json();
  if (json.errors) throw new Error(JSON.stringify(json.errors));
  return json.data;
}

// Create cart
export async function createCart(variantId: string, quantity: number = 1) {
  const mutation = `
    mutation CreateCart($lines: [CartLineInput!]!) {
      cartCreate(input: {lines: $lines}) {
        cart {
          id
          checkoutUrl
          lines(first: 10) {
            edges { node { id quantity merchandise { ... on ProductVariant { id } } } }
          }
        }
      }
    }
  `;
  return shopifyFetchCart(mutation, {
    lines: [{ merchandiseId: variantId, quantity }],
  });
}

// Add to cart
export async function addToCart(
  cartId: string,
  variantId: string,
  quantity: number = 1
) {
  const mutation = `
    mutation AddToCart($cartId: ID!, $lines: [CartLineInput!]!) {
      cartLinesAdd(cartId: $cartId, lines: $lines) {
        cart {
          id
          checkoutUrl
          lines(first: 10) {
            edges { node { id quantity merchandise { ... on ProductVariant { id } } } }
          }
        }
      }
    }
  `;
  return shopifyFetchCart(mutation, {
    cartId,
    lines: [{ merchandiseId: variantId, quantity }],
  });
}
