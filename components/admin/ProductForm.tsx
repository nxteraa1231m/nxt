"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, X, Upload, Trash2, Palette, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { createProduct, updateProduct, getCategories } from "@/lib/firebase/firestore";
import { generateSlug } from "@/lib/utils";
import { productSchema, type ProductFormData } from "@/lib/validations/product.schema";
import { uploadToCloudinary } from "@/lib/cloudinary";
import type { Product, ProductVariant, SizeStock } from "@/types/product";

interface ProductFormProps {
  initialData?: Product;
  productId?: string;
}

const AVAILABLE_SIZES = ["XS", "S", "M", "L", "XL", "XXL", "One Size"];

export function ProductForm({ initialData, productId }: ProductFormProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  
  // Custom states for variant adding inputs
  const [newColorName, setNewColorName] = useState("");
  const [newColorHex, setNewColorHex] = useState("#000000");

  // Load dynamic categories from Firestore
  useEffect(() => {
    getCategories()
      .then((list) => {
        if (list.length > 0) {
          setCategories(list.map((c) => c.slug));
        } else {
          setCategories(["men", "women", "unisex", "accessories", "shoes"]);
        }
      })
      .catch(() => {
        setCategories(["men", "women", "unisex", "accessories", "shoes"]);
      });
  }, []);

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
          mainImage: initialData.mainImage,
          variants: initialData.variants,
          featured: initialData.featured,
          bestSeller: initialData.bestSeller,
        }
      : {
          variants: [],
          featured: false,
          bestSeller: false,
          price: 0,
        },
  });

  const watchedMainImage = watch("mainImage");
  const watchedVariants = watch("variants") || [];

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setValue("name", name);
    if (!productId) {
      setValue("slug", generateSlug(name), { shouldValidate: true });
    }
  };

  // Upload main cover image to Cloudinary
  const handleMainImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const loadingToast = toast.loading("Uploading primary image...");
    try {
      const url = await uploadToCloudinary(file);
      setValue("mainImage", url, { shouldValidate: true });
      toast.success("Primary image uploaded successfully", { id: loadingToast });
    } catch {
      toast.error("Failed to upload image", { id: loadingToast });
    }
  };

  // Upload color-specific variant image
  const handleVariantImageUpload = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const loadingToast = toast.loading("Uploading color image...");
    try {
      const url = await uploadToCloudinary(file);
      const current = [...watchedVariants];
      current[index] = { ...current[index], image: url };
      setValue("variants", current, { shouldValidate: true });
      toast.success("Color image uploaded successfully", { id: loadingToast });
    } catch {
      toast.error("Failed to upload image", { id: loadingToast });
    }
  };

  // Add new color variant card
  const addColorVariant = () => {
    if (!newColorName.trim()) {
      toast.error("Please enter a color name");
      return;
    }
    const colorHexNormalized = newColorHex.toLowerCase();
    
    // Check if color hex is already defined
    if (watchedVariants.some((v) => v.colorHex.toLowerCase() === colorHexNormalized)) {
      toast.error("This color variant already exists");
      return;
    }

    const newVariant: ProductVariant = {
      colorName: newColorName.trim(),
      colorHex: colorHexNormalized,
      image: "",
      sizes: [],
    };

    setValue("variants", [...watchedVariants, newVariant], { shouldValidate: true });
    setNewColorName("");
    setNewColorHex("#000000");
    toast.success(`Color variant "${newVariant.colorName}" added`);
  };

  // Remove entire color variant card
  const removeColorVariant = (index: number) => {
    const next = watchedVariants.filter((_, idx) => idx !== index);
    setValue("variants", next, { shouldValidate: true });
  };

  // Add a size to a color variant with default stock
  const addSizeToVariant = (variantIndex: number, size: string) => {
    const variant = watchedVariants[variantIndex];
    if (variant.sizes.some((s) => s.size === size)) {
      toast.error(`Size "${size}" is already added to this color`);
      return;
    }

    const newSizeStock: SizeStock = { size, stock: 10 }; // Default stock of 10
    const updatedSizes = [...variant.sizes, newSizeStock];
    
    const updatedVariants = [...watchedVariants];
    updatedVariants[variantIndex] = { ...variant, sizes: updatedSizes };
    
    setValue("variants", updatedVariants, { shouldValidate: true });
  };

  // Remove a size from a color variant
  const removeSizeFromVariant = (variantIndex: number, sizeIndex: number) => {
    const variant = watchedVariants[variantIndex];
    const updatedSizes = variant.sizes.filter((_, idx) => idx !== sizeIndex);
    
    const updatedVariants = [...watchedVariants];
    updatedVariants[variantIndex] = { ...variant, sizes: updatedSizes };
    
    setValue("variants", updatedVariants, { shouldValidate: true });
  };

  // Update specific size stock input
  const updateSizeStock = (variantIndex: number, sizeIndex: number, stock: number) => {
    const updatedVariants = [...watchedVariants];
    const variant = updatedVariants[variantIndex];
    const sizes = [...variant.sizes];
    
    sizes[sizeIndex] = { ...sizes[sizeIndex], stock: Math.max(0, stock) };
    updatedVariants[variantIndex] = { ...variant, sizes };
    
    setValue("variants", updatedVariants, { shouldValidate: true });
  };

  const onSubmit = async (data: ProductFormData) => {
    setSaving(true);
    try {
      if (productId) {
        await updateProduct(productId, data);
        toast.success("Product updated successfully!");
      } else {
        await createProduct(data);
        toast.success("Product created successfully!");
      }
      router.push("/admin/products");
    } catch {
      toast.error("Failed to save product. Please check all variant inputs.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-10 max-w-4xl">
      
      {/* 1. Basic Info Panel */}
      <div className="bg-white rounded-2xl border border-zinc-100 p-6 shadow-[0_8px_30px_rgba(0,0,0,0.015)]">
        <h2 className="font-black text-xs text-zinc-900 uppercase tracking-widest mb-6">Basic Information</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="sm:col-span-2">
            <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-2">
              Product Name
            </label>
            <input
              className="w-full px-4 py-3 border border-zinc-100 rounded-xl text-xs bg-white focus:outline-none focus:border-zinc-300 focus:ring-1 focus:ring-zinc-200/50 transition-all font-semibold text-zinc-800 placeholder:text-zinc-400"
              placeholder="e.g. Minimalist Crewneck Hoodie"
              {...register("name")}
              onChange={handleNameChange}
            />
            {errors.name && (
              <p className="text-red-500 text-[10px] font-bold mt-1.5 flex items-center gap-1">
                <AlertCircle size={10} /> {errors.name.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-2">
              Slug (URL slug)
            </label>
            <input
              className="w-full px-4 py-3 border border-zinc-100 rounded-xl text-xs bg-zinc-50 focus:outline-none focus:border-zinc-300 focus:ring-1 focus:ring-zinc-200/50 transition-all font-mono font-semibold text-zinc-600"
              placeholder="minimalist-crewneck-hoodie"
              readOnly
              {...register("slug")}
            />
            {errors.slug && (
              <p className="text-red-500 text-[10px] font-bold mt-1.5 flex items-center gap-1">
                <AlertCircle size={10} /> {errors.slug.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-2">
              Brand
            </label>
            <input
              className="w-full px-4 py-3 border border-zinc-100 rounded-xl text-xs bg-white focus:outline-none focus:border-zinc-300 focus:ring-1 focus:ring-zinc-200/50 transition-all font-semibold text-zinc-800 placeholder:text-zinc-400"
              placeholder="e.g. NXT"
              {...register("brand")}
            />
            {errors.brand && (
              <p className="text-red-500 text-[10px] font-bold mt-1.5 flex items-center gap-1">
                <AlertCircle size={10} /> {errors.brand.message}
              </p>
            )}
          </div>

          <div className="sm:col-span-2">
            <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-2">
              Description
            </label>
            <textarea
              className="w-full px-4 py-3 border border-zinc-100 rounded-xl text-xs bg-white focus:outline-none focus:border-zinc-300 focus:ring-1 focus:ring-zinc-200/50 transition-all font-medium text-zinc-800 placeholder:text-zinc-400 resize-none"
              rows={4}
              placeholder="Describe the fabrics, fitting, structure, wash instructions..."
              {...register("description")}
            />
            {errors.description && (
              <p className="text-red-500 text-[10px] font-bold mt-1.5 flex items-center gap-1">
                <AlertCircle size={10} /> {errors.description.message}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* 2. Cover / Main Image Card */}
      <div className="bg-white rounded-2xl border border-zinc-100 p-6 shadow-[0_8px_30px_rgba(0,0,0,0.015)]">
        <h2 className="font-black text-xs text-zinc-900 uppercase tracking-widest mb-2">Main Catalog Image</h2>
        <p className="text-[10px] text-zinc-400 font-medium mb-6">
          This is the primary cover image shown on the product card inside the shop listing. Use high-resolution PNG with transparent background.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="w-32 h-32 rounded-2xl bg-zinc-50 border border-zinc-100 flex items-center justify-center overflow-hidden p-2 relative">
            {watchedMainImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={watchedMainImage} alt="Main Preview" className="object-contain w-full h-full" />
            ) : (
              <span className="text-[10px] text-zinc-300 font-black">NXT COVER</span>
            )}
          </div>
          
          <div className="flex-1 space-y-3">
            <label className="inline-flex items-center gap-2 bg-zinc-900 text-white px-4 py-2.5 rounded-xl font-bold text-[10px] hover:bg-zinc-800 transition-all cursor-pointer shadow-md shadow-zinc-900/10">
              <Upload size={12} />
              Upload Card Cover
              <input 
                type="file" 
                accept="image/*" 
                className="hidden" 
                onChange={handleMainImageUpload}
              />
            </label>
            <p className="text-[9px] text-zinc-400 font-mono leading-none truncate max-w-md">
              {watchedMainImage || "No cover image uploaded yet"}
            </p>
            {errors.mainImage && (
              <p className="text-red-500 text-[10px] font-bold flex items-center gap-1">
                <AlertCircle size={10} /> {errors.mainImage.message}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* 3. Pricing & Category */}
      <div className="bg-white rounded-2xl border border-zinc-100 p-6 shadow-[0_8px_30px_rgba(0,0,0,0.015)]">
        <h2 className="font-black text-xs text-zinc-900 uppercase tracking-widest mb-6">Pricing & Class</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div>
            <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-2">
              Category
            </label>
            <select
              className="w-full px-4 py-3 border border-zinc-100 rounded-xl text-xs bg-white focus:outline-none focus:border-zinc-300 focus:ring-1 focus:ring-zinc-200/50 transition-all font-semibold text-zinc-800 capitalize cursor-pointer"
              {...register("category")}
            >
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat} className="capitalize">
                  {cat}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="text-red-500 text-[10px] font-bold mt-1.5 flex items-center gap-1">
                <AlertCircle size={10} /> {errors.category.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-2">
              Price (EGP) — Price Before
            </label>
            <input
              type="number"
              className="w-full px-4 py-3 border border-zinc-100 rounded-xl text-xs bg-white focus:outline-none focus:border-zinc-300 focus:ring-1 focus:ring-zinc-200/50 transition-all font-semibold text-zinc-800 placeholder:text-zinc-400"
              placeholder="e.g. 1200"
              {...register("price", { valueAsNumber: true })}
            />
            {errors.price && (
              <p className="text-red-500 text-[10px] font-bold mt-1.5 flex items-center gap-1">
                <AlertCircle size={10} /> {errors.price.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-2">
              Sale Price (EGP) — Price After
            </label>
            <input
              type="number"
              className="w-full px-4 py-3 border border-zinc-100 rounded-xl text-xs bg-white focus:outline-none focus:border-zinc-300 focus:ring-1 focus:ring-zinc-200/50 transition-all font-semibold text-zinc-800 placeholder:text-zinc-400"
              placeholder="e.g. 950"
              {...register("salePrice", { valueAsNumber: true })}
            />
            {errors.salePrice && (
              <p className="text-red-500 text-[10px] font-bold mt-1.5 flex items-center gap-1">
                <AlertCircle size={10} /> {errors.salePrice.message}
              </p>
            )}
          </div>

          <div className="sm:col-span-3 flex items-center gap-6 pt-2">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                className="w-4 h-4 rounded border-zinc-200 text-zinc-900 focus:ring-zinc-900 accent-zinc-900"
                {...register("featured")}
              />
              <span className="text-xs font-bold text-zinc-700 uppercase tracking-wider">New Arrival Badge</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                className="w-4 h-4 rounded border-zinc-200 text-zinc-900 focus:ring-zinc-900 accent-zinc-900"
                {...register("bestSeller")}
              />
              <span className="text-xs font-bold text-zinc-700 uppercase tracking-wider">Best Seller Badge</span>
            </label>
          </div>
        </div>
      </div>

      {/* 4. Color Variants Inventory Grid */}
      <div className="bg-white rounded-2xl border border-zinc-100 p-6 shadow-[0_8px_30px_rgba(0,0,0,0.015)]">
        <h2 className="font-black text-xs text-zinc-900 uppercase tracking-widest mb-2">Color Variants & Sizes</h2>
        <p className="text-[10px] text-zinc-400 font-medium mb-6">
          Define color variations. For each color, upload a matching image, choose sizes (e.g. S, M, L), and set the stock count for each size!
        </p>

        {/* Variant Add Panel */}
        <div className="flex flex-col sm:flex-row gap-3 items-end p-4 bg-zinc-50 border border-zinc-100 rounded-2xl mb-6">
          <div>
            <label className="block text-[9px] font-bold text-zinc-400 uppercase tracking-wider mb-1.5">
              Color Hex
            </label>
            <input
              type="color"
              value={newColorHex}
              onChange={(e) => setNewColorHex(e.target.value)}
              className="h-10 w-12 rounded-lg border border-zinc-200 cursor-pointer p-0.5 bg-white"
            />
          </div>
          <div className="flex-1">
            <label className="block text-[9px] font-bold text-zinc-400 uppercase tracking-wider mb-1.5">
              Color Name
            </label>
            <input
              type="text"
              placeholder="e.g. Midnight Black, Crimson Red"
              value={newColorName}
              onChange={(e) => setNewColorName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addColorVariant())}
              className="w-full px-4 py-2.5 border border-zinc-100 rounded-xl text-xs bg-white focus:outline-none focus:border-zinc-300 transition-all font-semibold text-zinc-800 placeholder:text-zinc-400"
            />
          </div>
          <button
            type="button"
            onClick={addColorVariant}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-zinc-900 text-white rounded-xl text-xs font-bold hover:bg-zinc-800 transition-colors shadow-md shadow-zinc-900/10"
          >
            <Plus size={12} />
            Add Variant
          </button>
        </div>

        {errors.variants && (
          <p className="text-red-500 text-[10px] font-bold mb-4 flex items-center gap-1">
            <AlertCircle size={10} /> {errors.variants.message}
          </p>
        )}

        {/* Variant list Cards */}
        <div className="space-y-6">
          {watchedVariants.map((variant, variantIdx) => (
            <div 
              key={variant.colorHex}
              className="border border-zinc-100 rounded-2xl p-5 space-y-4 hover:border-zinc-300 transition-all duration-300 bg-white"
            >
              {/* Card Header */}
              <div className="flex items-center justify-between border-b border-zinc-50 pb-3">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-4 h-4 rounded-full border border-zinc-200" 
                    style={{ backgroundColor: variant.colorHex }}
                  />
                  <span className="text-xs font-black text-zinc-900">{variant.colorName}</span>
                  <span className="text-[9px] text-zinc-400 font-mono">({variant.colorHex})</span>
                </div>
                <button
                  type="button"
                  onClick={() => removeColorVariant(variantIdx)}
                  className="text-zinc-400 hover:text-red-600 transition-colors"
                >
                  <Trash2 size={13} />
                </button>
              </div>

              {/* Card Body columns */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                
                {/* Variant Image upload */}
                <div className="md:col-span-4 flex flex-col items-center justify-center border border-dashed border-zinc-100 rounded-2xl p-4 bg-zinc-50/50">
                  <div className="w-24 h-24 rounded-xl bg-white border border-zinc-100 flex items-center justify-center overflow-hidden p-1 relative mb-3">
                    {variant.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={variant.image} alt="Color Preview" className="object-contain w-full h-full" />
                    ) : (
                      <Palette size={18} className="text-zinc-300" />
                    )}
                  </div>
                  
                  <label className="inline-flex items-center gap-1.5 bg-white text-zinc-700 border border-zinc-200 px-3.5 py-2 rounded-lg font-bold text-[10px] hover:bg-zinc-50 transition-all cursor-pointer">
                    <Upload size={10} />
                    Upload Image
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={(e) => handleVariantImageUpload(variantIdx, e)}
                    />
                  </label>
                  {!variant.image && (
                    <p className="text-[8px] text-red-500 font-bold mt-2 flex items-center gap-0.5">
                      <AlertCircle size={8} /> Image is required
                    </p>
                  )}
                </div>

                {/* Variant Sizes and Stock levels */}
                <div className="md:col-span-8 space-y-4">
                  <div>
                    <span className="block text-[9px] font-bold text-zinc-400 uppercase tracking-wider mb-2">
                      Fulfillment Stock Levels
                    </span>
                    
                    {/* Quick Add size tags */}
                    <div className="flex flex-wrap gap-1 mb-3">
                      {AVAILABLE_SIZES.map((size) => {
                        const isAdded = variant.sizes.some((s) => s.size === size);
                        return (
                          <button
                            key={size}
                            type="button"
                            onClick={() => addSizeToVariant(variantIdx, size)}
                            disabled={isAdded}
                            className={`px-2.5 py-1 rounded text-[9px] font-bold border transition-all ${
                              isAdded
                                ? "bg-zinc-50 border-zinc-100 text-zinc-300 cursor-not-allowed"
                                : "bg-white border-zinc-200 text-zinc-600 hover:border-zinc-400 hover:text-zinc-950"
                            }`}
                          >
                            + {size}
                          </button>
                        );
                      })}
                    </div>
                    
                    {/* Size and stock inputs list */}
                    {variant.sizes.length === 0 ? (
                      <p className="text-[10px] text-zinc-400 font-medium italic py-2">
                        No sizes configured. Add sizes using the buttons above.
                      </p>
                    ) : (
                      <div className="grid grid-cols-2 gap-2.5">
                        {variant.sizes.map((sizeStock, sizeIdx) => (
                          <div 
                            key={sizeStock.size}
                            className="flex items-center gap-2.5 bg-zinc-50 border border-zinc-100 rounded-xl px-3 py-1.5"
                          >
                            <span className="text-[10px] font-black text-zinc-800 w-8">{sizeStock.size}</span>
                            <div className="flex-1 flex items-center gap-1 bg-white border border-zinc-100 rounded-lg px-2 py-0.5">
                              <span className="text-[8px] font-bold text-zinc-400 uppercase">Stock</span>
                              <input 
                                type="number"
                                value={sizeStock.stock}
                                onChange={(e) => updateSizeStock(variantIdx, sizeIdx, parseInt(e.target.value) || 0)}
                                className="w-full text-xs font-bold text-zinc-900 border-none outline-none focus:ring-0 p-0 text-right"
                              />
                            </div>
                            <button
                              type="button"
                              onClick={() => removeSizeFromVariant(variantIdx, sizeIdx)}
                              className="text-zinc-400 hover:text-red-500 transition-colors"
                            >
                              <X size={12} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

              </div>
            </div>
          ))}
          
          {watchedVariants.length === 0 && (
            <div className="text-center py-10 border border-dashed border-zinc-100 rounded-2xl bg-zinc-50/20">
              <span className="text-zinc-300 block mb-2"><Palette size={24} className="mx-auto" /></span>
              <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">No variants defined yet</p>
              <p className="text-[9px] text-zinc-400/80 mt-1">Add at least one color variant above to structure your inventory.</p>
            </div>
          )}
        </div>
      </div>

      {/* 5. Submit / Operations bar */}
      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center justify-center bg-zinc-900 text-white px-6 py-3.5 rounded-xl font-bold text-xs hover:bg-zinc-800 transition-all duration-300 shadow-md shadow-zinc-900/10 disabled:opacity-50"
        >
          {saving && (
            <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
          )}
          {productId ? "Save Product Changes" : "Publish Product"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-3.5 border border-zinc-200 rounded-xl text-xs font-bold hover:bg-zinc-50 transition-colors"
        >
          Cancel
        </button>
      </div>

    </form>
  );
}
