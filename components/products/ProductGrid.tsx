import { ProductCard } from "./ProductCard";
import type { Product } from "@/types/product";

interface ProductGridProps {
  products: Product[];
  columns?: 2 | 3 | 4;
}

const colClasses = {
  2: "grid-cols-2",
  3: "grid-cols-2 md:grid-cols-3",
  4: "grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
};

export function ProductGrid({ products, columns = 4 }: ProductGridProps) {
  return (
    <div className={`grid ${colClasses[columns]} gap-x-4 gap-y-10 md:gap-x-8`}>
      {products.map((product, i) => (
        <ProductCard key={product.id} product={product} index={i} />
      ))}
    </div>
  );
}
