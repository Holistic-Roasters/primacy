import { shopifyFetch } from "@/lib/shopify";
import Image from "next/image";
import Link from "next/link";
import { PRODUCTS_QUERY } from "@/constants/CART";

export default async function ProductsPage() {
  const data = await shopifyFetch(PRODUCTS_QUERY);
  const products = data.products.edges.map((edge: any) => edge.node);

  return (
    <section className="min-h-screen w-full bg-[var(--color-dark-grey)] py-20">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="font-display text-4xl text-white mb-3 uppercase tracking-wide">
            Initiate Your{" "}
            <span className="text-[var(--color-accent)]">Protocol</span>
          </h2>
          <p className="text-[var(--color-light-grey)] text-lg max-w-xl mx-auto">
            Your journey to optimized performance begins here. Choose your entry
            point into the PRIMACY ecosystem.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-10">
          {products.map((p: any) => (
            <Link href={`/products/${encodeURIComponent(p.id)}`} key={p.id}>
              <div className="rounded-2xl bg-[var(--color-black)] border-2 px-8 py-10 flex flex-col items-center shadow-xl relative border-[var(--color-mid-grey)]">
                <Image
                  src={p.images.edges[0]?.node.url}
                  alt={p.images.edges[0]?.node.altText || p.title}
                  width={120}
                  height={120}
                  className="mb-4"
                  style={{ background: "#1a1a1a", borderRadius: "12px" }}
                />
                <h3 className="font-display text-2xl mb-2 uppercase text-white">
                  {p.title}
                </h3>
                <div className="text-3xl font-bold mb-2 font-display text-[var(--color-accent)]">
                  $
                  {Number(p.variants.edges[0]?.node.price.amount || 0).toFixed(
                    2
                  )}
                </div>
                <p className="text-[var(--color-light-grey)] text-base mb-6 text-center">
                  {p.description}
                </p>
                <h6 className="mt-auto inline-block px-6 py-3 rounded-lg font-display uppercase tracking-wide border-2 text-base transition border-[var(--color-accent)] text-[var(--color-accent)] hover:bg-[var(--color-accent)] hover:text-[var(--color-black)]">
                  {p.title}
                </h6>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
