import Image from "next/image";
import { notFound } from "next/navigation";
import { getShopifyData } from "@/lib/getShopifyProducts";
import { PRODUCT_QUERY_BY_ID } from "@/constants/CART";
import { AddToCartActions } from "@/components/AddToCart"; // Client component

export default async function ProductPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;
  if (!id) {
    notFound();
  }
  const shopifyId = decodeURIComponent(id);
  const data = await getShopifyData(PRODUCT_QUERY_BY_ID, { id: shopifyId });
  const product = data.product;

  if (!product) notFound();

  const images = product.images.edges.map((edge: any) => edge.node);
  const variants = product.variants.edges.map((edge: any) => edge.node);
  const [firstVariant] = variants;

  return (
    <div className="max-w-5xl mx-auto p-6 grid md:grid-cols-2 gap-12 min-h-screen bg-[var(--color-black)]">
      {/* LEFT: Images */}
      <div className="flex flex-col items-center">
        <div className="w-full h-[340px] relative bg-[var(--color-surface)] rounded-xl overflow-hidden mb-4 flex items-center justify-center">
          <Image
            src={images[0]?.url || "/placeholder.jpg"}
            alt={images[0]?.altText || product.title}
            fill
            sizes="(max-width: 768px) 90vw, 400px"
            className="object-contain"
            priority
          />
        </div>
        {/* Thumbnails */}
        <div className="flex gap-2">
          {images.slice(1).map((img) => (
            <div
              key={img.url}
              className="w-16 h-16 bg-[var(--color-surface)] rounded-md relative border border-[var(--color-border)]"
            >
              <Image
                src={img.url}
                alt={img.altText || product.title}
                fill
                className="object-contain"
              />
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT: Details */}
      <div className="flex flex-col">
        <h1 className="font-display text-3xl md:text-4xl mb-3 text-white">
          {product.title}
        </h1>
        <div
          className="prose prose-invert text-[var(--color-light-grey)] mb-4"
          dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
        />
        <div className="text-2xl font-bold mb-4 text-[var(--color-accent)]">
          {product.priceRange.minVariantPrice.currencyCode}{" "}
          {Number(product.priceRange.minVariantPrice.amount).toLocaleString(
            undefined,
            { minimumFractionDigits: 2 }
          )}
        </div>
        {/* Variant selection and Add to Cart actions */}
        <AddToCartActions
          variants={variants}
          defaultVariantId={firstVariant.id}
        />
      </div>
    </div>
  );
}
