"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getProductById } from "@/lib/firebase/firestore";
import { ProductForm } from "@/components/admin/ProductForm";
import { Spinner } from "@/components/ui/Spinner";
import type { Product } from "@/types/product";

export default function EditProductClient() {
  const params = useParams();
  const id = params.id as string;
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    getProductById(id)
      .then(setProduct)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!product) {
    return <p className="text-gray-400">Product not found.</p>;
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Edit Product</h1>
        <p className="text-gray-400 text-sm mt-1">{product.name}</p>
      </div>
      <ProductForm initialData={product} productId={id} />
    </div>
  );
}
