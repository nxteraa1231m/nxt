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
  sizes: string[];
  colors: ProductColor[];
  stock: number;
  images: string[]; // Cloudinary URLs only
  featured: boolean;
  bestSeller: boolean;
  createdAt: Timestamp | Date;
}

export interface ProductColor {
  name: string;
  hex: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize: string;
  selectedColor: ProductColor;
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
