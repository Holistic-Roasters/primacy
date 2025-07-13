"use server";
import { shopifyFetch } from "@/lib/shopify";

export async function getShopifyData(
  query: string,
  variables?: Record<string, unknown>
) {
  const data = await shopifyFetch(query, variables);
  if (data?.products?.edges) {
    return data.products.edges.map(
      (edge: { node: Record<string, unknown> }) => edge.node
    );
  }
  return data;
}
