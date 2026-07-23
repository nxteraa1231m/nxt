"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, X } from "lucide-react";
import { toast } from "sonner";
import { createProduct, updateProduct } from "@/lib/firebase/firestore";
import { generateSlug } from "@/lib/utils";
import { productSchema, type ProductFormData } from "@/lib/validations/product.schema";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { Input } from "@/components/ui/Input";
import type { Product, ProductColor } from "@/types/product";

interface ProductFormProps {
  initialData?: Product;
  productId?: string;
}

const AVAILABLE_SIZES = ["XS", "S", "M", "L", "XL", "XXL", "One Size"];
const CATEGORIES = ["men", "women", "unisex", "accessories", "shoes"];

export function ProductForm({ initialData, productId }: ProductFormProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [newColorName, setNewColorName] = useState("");
  const [newColorHex, setNewColorHex] = useState("#000000");
  const [images, setImages] = useState<string[]>(initialData?.images || []);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: initialData
      ? {
          name: initialData.name,
          slug: initialData.slug,
          description: initialData.description,
          price: initialData.price,
          salePrice: initialData.salePrice,
          category: initialData.category,
          brand: initialData.brand,
          sizes: initialData.sizes,
          colors: initialData.colors,
          stock: initialData.stock,
          images: initialData.images,
          featured: initialData.featured,
          bestSeller: initialData.bestSeller,
        }
      : {
          sizes: [],
          colors: [],
          images: [],
          featured: false,
          bestSeller: false,
          stock: 0,
          price: 0,
        },
  });

  const watchedSizes = watch("sizes") || [];
  const watchedColors = watch("colors") || [];

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setValue("name", name);
    if (!productId) {
      setValue("slug", generateSlug(name));
    }
  };

  const toggleSize = (size: string) => {
    const current = watchedSizes;
    const next = current.includes(size)
      ? current.filter((s) => s !== size)
      : [...current, size];
    setValue("sizes", next);
  };

  const addColor = () => {
    if (!newColorName.trim()) return;
    const newColor: ProductColor = { name: newColorName.trim(), hex: newColorHex };
    setValue("colors", [...watchedColors, newColor]);
    setNewColorName("");
    setNewColorHex("#000000");
  };

  const removeColor = (hex: string) => {
    setValue(
      "colors",
      watchedColors.filter((c) => c.hex !== hex)
    );
  };

  const onSubmit = async (data: ProductFormData) => {
    if (images.length === 0) {
      toast.error("Please upload at least one product image");
      return;
    }
    setSaving(true);
    try {
      const productData = { ...data, images };
      if (productId) {
        await updateProduct(productId, productData);
        toast.success("Product updated!");
      } else {
        await createProduct(productData);
        toast.success("Product created!");
      }
      router.push("/admin/products");
    } catch {
      toast.error("Failed to save product");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 max-w-4xl">
      {/* Basic Info */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <h2 className="font-bold text-lg mb-5">Basic Information</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Product Name
            </label>
            <input
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black bg-white"
              placeholder="Premium Cotton T-Shirt"
              {...register("name")}
              onChange={handleNameChange}
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
            )}
          </div>
          <div>
            <Input
              id="slug"
              label="Slug (URL)"
              placeholder="premium-cotton-t-shirt"
              error={errors.slug?.message}
              {...register("slug")}
            />
          </div>
          <div>
            <Input
              id="brand"
              label="Brand"
              placeholder="NXT"
              error={errors.brand?.message}
              {...register("brand")}
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Description
            </label>
            <textarea
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black resize-none bg-white"
              rows={4}
              placeholder="Product description..."
              {...register("description")}
            />
            {errors.description && (
              <p className="text-red-500 text-xs mt-1">
                {errors.description.message}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Pricing & Stock */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <h2 className="font-bold text-lg mb-5">Pricing & Stock</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Category
            </label>
            <select
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black bg-white capitalize"
              {...register("category")}
            >
              <option value="">Select category</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat} className="capitalize">
                  {cat}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="text-red-500 text-xs mt-1">
                {errors.category.message}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Price (EGP)
            </label>
            <input
              type="number"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black bg-white"
              {...register("price", { valueAsNumber: true })}
            />
            {errors.price && (
              <p className="text-red-500 text-xs mt-1">{errors.price.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Sale Price (optional)
            </label>
            <input
              type="number"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black bg-white"
              {...register("salePrice", { valueAsNumber: true })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Stock
            </label>
            <input
              type="number"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black bg-white"
              {...register("stock", { valueAsNumber: true })}
            />
          </div>
          <div className="sm:col-span-2 flex items-center gap-6 pt-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                className="w-4 h-4 rounded accent-black"
                {...register("featured")}
              />
              <span className="text-sm font-medium">Featured</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                className="w-4 h-4 rounded accent-black"
                {...register("bestSeller")}
              />
              <span className="text-sm font-medium">Best Seller</span>
            </label>
          </div>
        </div>
      </div>

      {/* Sizes */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <h2 className="font-bold text-lg mb-5">Sizes</h2>
        <div className="flex flex-wrap gap-2">
          {AVAILABLE_SIZES.map((size) => (
            <button
              key={size}
              type="button"
              onClick={() => toggleSize(size)}
              className={`px-4 py-2 rounded-xl border text-sm font-semibold transition-all ${
                watchedSizes.includes(size)
                  ? "bg-black text-white border-black"
                  : "bg-white text-gray-700 border-gray-200 hover:border-gray-400"
              }`}
            >
              {size}
            </button>
          ))}
        </div>
        {errors.sizes && (
          <p className="text-red-500 text-xs mt-2">{errors.sizes.message}</p>
        )}
      </div>

      {/* Colors */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <h2 className="font-bold text-lg mb-5">Colors</h2>

        {watchedColors.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {watchedColors.map((color) => (
              <div
                key={color.hex}
                className="flex items-center gap-2 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-xl"
              >
                <div
                  className="w-4 h-4 rounded-full border border-gray-200"
                  style={{ backgroundColor: color.hex }}
                />
                <span className="text-xs font-medium">{color.name}</span>
                <button
                  type="button"
                  onClick={() => removeColor(color.hex)}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="flex gap-3 items-end">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Color
            </label>
            <input
              type="color"
              value={newColorHex}
              onChange={(e) => setNewColorHex(e.target.value)}
              className="h-10 w-10 rounded-lg border border-gray-200 cursor-pointer"
            />
          </div>
          <div className="flex-1">
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Name
            </label>
            <input
              type="text"
              placeholder="e.g. Midnight Black"
              value={newColorName}
              onChange={(e) => setNewColorName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addColor())}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black bg-white"
            />
          </div>
          <button
            type="button"
            onClick={addColor}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-black text-white rounded-xl text-sm font-medium hover:bg-gray-900 transition-colors"
          >
            <Plus size={14} />
            Add
          </button>
        </div>
        {errors.colors && (
          <p className="text-red-500 text-xs mt-2">{errors.colors.message}</p>
        )}
      </div>

      {/* Images */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <h2 className="font-bold text-lg mb-2">Product Images</h2>
        <p className="text-sm text-gray-400 mb-5">
          Upload PNG images with transparent backgrounds for the best floating card effect.
        </p>
        <ImageUploader images={images} onChange={setImages} />
      </div>

      {/* Submit */}
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 bg-black text-white px-6 py-3 rounded-xl text-sm font-semibold hover:bg-gray-900 transition-colors disabled:opacity-50"
        >
          {saving ? (
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : null}
          {productId ? "Update Product" : "Create Product"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-3 border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
