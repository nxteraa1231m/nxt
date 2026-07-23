import { z } from "zod";

export const sizeStockSchema = z.object({
  size: z.string().min(1, "Size is required"),
  stock: z.number().int().min(0, "Stock must be 0 or more"),
});

export const productVariantSchema = z.object({
  colorName: z.string().min(1, "Color name is required"),
  colorHex: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Valid hex color required"),
  image: z.string().url("Color variant image is required"),
  sizes: z.array(sizeStockSchema).min(1, "At least one size is required"),
});

export const productSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  slug: z
    .string()
    .min(2)
    .regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers and hyphens"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.number().min(0, "Price must be positive"),
  salePrice: z.number().min(0).optional(),
  category: z.string().min(1, "Category required"),
  brand: z.string().min(1, "Brand required"),
  mainImage: z.string().url("Primary card image required"),
  variants: z.array(productVariantSchema).min(1, "At least one color variant required"),
  featured: z.boolean().default(false),
  bestSeller: z.boolean().default(false),
});

export type ProductFormData = z.infer<typeof productSchema>;
