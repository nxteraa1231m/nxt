import ProductDetailClient from "@/components/store/ProductDetailClient";
import { getProducts } from "@/lib/firebase/firestore";

export async function generateStaticParams() {
  try {
    const products = await getProducts();
    if (products.length > 0) {
      return products.map((p) => ({
        slug: p.slug || p.id,
      }));
    }
  } catch (err) {
    console.error("Error generating static params for products:", err);
  }
  return [{ slug: "sample" }];
}

export const dynamicParams = true;

export default function ProductDetailPage() {
  return <ProductDetailClient />;
}
