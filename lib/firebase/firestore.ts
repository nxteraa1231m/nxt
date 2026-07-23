import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  setDoc,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
  type QueryConstraint,
} from "firebase/firestore";
import { db } from "./config";
import type { Product } from "@/types/product";
import type { Order, OrderStatus, CreateOrderInput } from "@/types/order";
import type { Category } from "@/types/category";
import { deleteFromCloudinary } from "../cloudinary";

// ─── Products ──────────────────────────────────────────

export async function getProducts(filters?: {
  featured?: boolean;
  bestSeller?: boolean;
  category?: string;
  limitCount?: number;
}): Promise<Product[]> {
  const constraints: QueryConstraint[] = [orderBy("createdAt", "desc")];

  if (filters?.featured) constraints.push(where("featured", "==", true));
  if (filters?.bestSeller) constraints.push(where("bestSeller", "==", true));
  if (filters?.category) constraints.push(where("category", "==", filters.category));
  if (filters?.limitCount) constraints.push(limit(filters.limitCount));

  const q = query(collection(db, "products"), ...constraints);
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as Product);
}

export async function getProductBySlug(slugParam: string): Promise<Product | null> {
  // The URL param could be "slug-NXT-XXXX" or just "slug"
  // Try to find by full slug first, then strip the SKU suffix (last 8 chars: -NXT-XXXX)
  const skuPattern = /-nxt-[a-z0-9]{4}$/i;
  const cleanSlug = slugParam.replace(skuPattern, "");

  // Try with full param first (for existing slugs without SKU)
  const q1 = query(collection(db, "products"), where("slug", "==", slugParam), limit(1));
  const snap1 = await getDocs(q1);
  if (!snap1.empty) {
    const d = snap1.docs[0];
    return { id: d.id, ...d.data() } as Product;
  }

  // Try with clean slug (stripped SKU)
  const q2 = query(collection(db, "products"), where("slug", "==", cleanSlug), limit(1));
  const snap2 = await getDocs(q2);
  if (!snap2.empty) {
    const d = snap2.docs[0];
    return { id: d.id, ...d.data() } as Product;
  }

  return null;
}


export async function getProductById(id: string): Promise<Product | null> {
  const docRef = doc(db, "products", id);
  const snapshot = await getDoc(docRef);
  if (!snapshot.exists()) return null;
  return { id: snapshot.id, ...snapshot.data() } as Product;
}

export async function createProduct(
  data: Omit<Product, "id" | "createdAt">
): Promise<string> {
  const docRef = await addDoc(collection(db, "products"), {
    ...data,
    createdAt: Timestamp.now(),
  });
  return docRef.id;
}

export async function updateProduct(
  id: string,
  data: Partial<Omit<Product, "id" | "createdAt">>
): Promise<void> {
  await updateDoc(doc(db, "products", id), data);
}

export async function deleteProduct(id: string): Promise<void> {
  // Fetch product to collect image URLs before deletion
  try {
    const product = await getProductById(id);
    if (product) {
      const allImages = [
        product.mainImage,
        ...(product.variants?.map((v) => v.image) || []),
      ].filter(Boolean) as string[];

      if (allImages.length > 0) {
        deleteFromCloudinary(allImages).catch(console.error);
      }
    }
  } catch (err) {
    console.error("Error collecting product images for Cloudinary deletion:", err);
  }

  await deleteDoc(doc(db, "products", id));
}

// ─── Orders ─────────────────────────────────────────────

export async function createOrder(data: CreateOrderInput): Promise<string> {
  const docRef = await addDoc(collection(db, "orders"), {
    ...data,
    status: "pending" as OrderStatus,
    createdAt: Timestamp.now(),
  });
  return docRef.id;
}

export async function getOrders(statusFilter?: OrderStatus): Promise<Order[]> {
  const constraints: QueryConstraint[] = [orderBy("createdAt", "desc")];
  if (statusFilter) constraints.push(where("status", "==", statusFilter));

  const q = query(collection(db, "orders"), ...constraints);
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as Order);
}

export async function getOrderById(id: string): Promise<Order | null> {
  const docRef = doc(db, "orders", id);
  const snapshot = await getDoc(docRef);
  if (!snapshot.exists()) return null;
  return { id: snapshot.id, ...snapshot.data() } as Order;
}

export async function updateOrderStatus(
  id: string,
  status: OrderStatus
): Promise<void> {
  await updateDoc(doc(db, "orders", id), { status });
}

export async function deleteOrder(id: string): Promise<void> {
  await deleteDoc(doc(db, "orders", id));
}

// ─── Categories ──────────────────────────────────────────

export async function getCategories(): Promise<Category[]> {
  const q = query(collection(db, "categories"), orderBy("order", "asc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as Category);
}

export async function createCategory(
  data: Omit<Category, "id">
): Promise<string> {
  const docRef = await addDoc(collection(db, "categories"), data);
  return docRef.id;
}

export async function deleteCategory(id: string): Promise<void> {
  await deleteDoc(doc(db, "categories", id));
}

// ─── Site Settings (CMS) ─────────────────────────────────

export interface SiteSettings {
  storeName?: string;
  heroTagline?: string;
  heroButtonText?: string;
  heroMediaType?: "image" | "video";
  heroVideoUrlLight?: string;
  heroVideoUrlDark?: string;
  heroImagesLight?: string[];
  heroImagesDark?: string[];
  featuredTitle?: string;
  featuredSubtitle?: string;
  introTagline?: string;
  introImages?: string[];
  footerDescription?: string;
  storeEmail?: string;
  storePhone?: string;
  vodafoneCash?: string;
  instapayUsername?: string;
  onlinePaymentEnabled?: boolean;  // تفعيل/إيقاف الدفع الأونلاين
  instagramUrl?: string;
  facebookUrl?: string;
  tiktokUrl?: string;
  currency?: string;

  // About Page CMS
  aboutTitle?: string;
  aboutSubtitle?: string;
  aboutSection1Title?: string;
  aboutSection1Text?: string;
  aboutSection1Image?: string;
  aboutSection2Title?: string;
  aboutSection2Text?: string;
  aboutSection2Image?: string;

  // Legal & Privacy CMS
  privacyPolicyText?: string;
  termsOfServiceText?: string;
}

export async function getSiteSettings(): Promise<SiteSettings | null> {
  try {
    const docRef = doc(db, "site_settings", "general");
    const snapshot = await getDoc(docRef);
    if (!snapshot.exists()) return null;
    return snapshot.data() as SiteSettings;
  } catch (err) {
    console.error("Failed to fetch site settings:", err);
    return null;
  }
}

export async function updateSiteSettings(
  data: Partial<SiteSettings>
): Promise<void> {
  const docRef = doc(db, "site_settings", "general");
  await setDoc(docRef, data, { merge: true });
}

// ─── Shipping Rates (Governorates) ──────────────────────

import { DEFAULT_EGYPT_GOVERNORATES, type GovernorateRate } from "@/constants/governorates";

export async function getShippingRates(): Promise<GovernorateRate[]> {
  try {
    const docRef = doc(db, "site_settings", "shipping");
    const snapshot = await getDoc(docRef);
    if (!snapshot.exists()) return DEFAULT_EGYPT_GOVERNORATES;
    const data = snapshot.data();
    if (data?.rates && Array.isArray(data.rates)) {
      return data.rates as GovernorateRate[];
    }
    return DEFAULT_EGYPT_GOVERNORATES;
  } catch (err) {
    console.error("Failed to fetch shipping rates:", err);
    return DEFAULT_EGYPT_GOVERNORATES;
  }
}

export async function updateShippingRates(rates: GovernorateRate[]): Promise<void> {
  const docRef = doc(db, "site_settings", "shipping");
  await setDoc(docRef, { rates, updatedAt: Timestamp.now() }, { merge: true });
}

// ─── Contact Messages & Complaints ──────────────────────

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  status: "unread" | "read";
  createdAt: any;
}

export async function createContactMessage(data: {
  name: string;
  email: string;
  message: string;
}): Promise<string> {
  const docRef = await addDoc(collection(db, "contact_messages"), {
    ...data,
    status: "unread",
    createdAt: Timestamp.now(),
  });
  return docRef.id;
}

export async function getContactMessages(): Promise<ContactMessage[]> {
  try {
    const q = query(collection(db, "contact_messages"), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as ContactMessage);
  } catch (err) {
    console.error("Failed to load contact messages:", err);
    return [];
  }
}

export async function updateContactMessageStatus(
  id: string,
  status: "unread" | "read"
): Promise<void> {
  await updateDoc(doc(db, "contact_messages", id), { status });
}

export async function deleteContactMessage(id: string): Promise<void> {
  await deleteDoc(doc(db, "contact_messages", id));
}

// ─── System Error Logs ─────────────────────────────────

export interface SystemErrorLog {
  id: string;
  message: string;
  stack?: string;
  url?: string;
  userAgent?: string;
  context?: string;
  resolved: boolean;
  createdAt: any;
}

export async function createSystemErrorLog(data: {
  message: string;
  stack?: string;
  url?: string;
  userAgent?: string;
  context?: string;
}): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, "system_errors"), {
      message: data.message || "Unknown Runtime Error",
      stack: data.stack || "",
      url: data.url || (typeof window !== "undefined" ? window.location.href : ""),
      userAgent: data.userAgent || (typeof navigator !== "undefined" ? navigator.userAgent : ""),
      context: data.context || "Client Runtime",
      resolved: false,
      createdAt: Timestamp.now(),
    });
    return docRef.id;
  } catch (err) {
    console.error("Failed to log system error to Firestore:", err);
    return "";
  }
}

export async function getSystemErrorLogs(): Promise<SystemErrorLog[]> {
  try {
    const q = query(collection(db, "system_errors"), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as SystemErrorLog);
  } catch (err) {
    console.error("Failed to fetch system errors:", err);
    return [];
  }
}

export async function updateSystemErrorStatus(
  id: string,
  resolved: boolean
): Promise<void> {
  await updateDoc(doc(db, "system_errors", id), { resolved });
}

export async function deleteSystemErrorLog(id: string): Promise<void> {
  await deleteDoc(doc(db, "system_errors", id));
}

export async function clearAllSystemErrors(): Promise<void> {
  const snapshot = await getDocs(collection(db, "system_errors"));
  const deletePromises = snapshot.docs.map((docItem) => deleteDoc(docItem.ref));
  await Promise.all(deletePromises);
}
