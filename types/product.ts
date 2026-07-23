import { Timestamp } from "firebase/firestore";

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  salePrice?: number;
  category: string;
  brand: string;
  mainImage: string; // The primary cover image shown on the card from the outside
  variants: ProductVariant[]; // Each color variant has its own image and size stocks
  featured: boolean;
  bestSeller: boolean;
  createdAt: Timestamp | Date;
}

export interface ProductVariant {
  colorName: string;
  colorHex: string;
  image: string; // Cloudinary URL for this specific color
  sizes: SizeStock[]; // Specific sizes and stock levels for this color
}

export interface SizeStock {
  size: string;
  stock: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize: string;
  selectedColor: {
    name: string;
    hex: string;
    image: string;
  };
}

export interface ProductFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  sizes?: string[];
  colors?: string[];
  featured?: boolean;
  bestSeller?: boolean;
}
