import { z } from "zod";

export const productColorSchema = z.object({
  name: z.string().min(1, "Color name required"),
  hex: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Valid hex color required"),
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
  sizes: z.array(z.string()).min(1, "At least one size required"),
  colors: z.array(productColorSchema).min(1, "At least one color required"),
  stock: z.number().int().min(0, "Stock must be 0 or more"),
  images: z.array(z.string().url()).min(1, "At least one image required"),
  featured: z.boolean().default(false),
  bestSeller: z.boolean().default(false),
});

export type ProductFormData = z.infer<typeof productSchema>;
