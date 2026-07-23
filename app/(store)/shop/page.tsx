"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ShopPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the home page products section
    router.replace("/#products");
  }, [router]);

  return null;
}
