"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useEffect } from "react";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Tag,
  Settings,
  LogOut,
  ChevronRight,
} from "lucide-react";
import { signOut } from "@/lib/firebase/auth";
import { toast } from "sonner";
import { useAuth } from "@/features/auth/AuthProvider";
import { Spinner } from "@/components/ui/Spinner";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/customers", label: "Customers", icon: Users },
  { href: "/admin/categories", label: "Categories", icon: Tag },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading } = useAuth();
  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    if (!loading && !isLoginPage) {
      if (!user || user.email !== "nxteraa953@gmail.com") {
        router.push("/admin/login");
      }
    }
  }, [user, loading, router, isLoginPage]);

  useEffect(() => {
    // Force Light Mode for the Admin Dashboard
    const html = document.documentElement;
    const isDark = html.classList.contains("dark");
    if (isDark) {
      html.classList.remove("dark");
    }

    return () => {
      // Restore user storefront theme when leaving admin panel
      const savedTheme = localStorage.getItem("nxt-theme");
      if (savedTheme === "dark") {
        html.classList.add("dark");
      }
    };
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut();
      // Clear session cookie
      await fetch("/api/admin/auth", { method: "DELETE" });
      router.push("/admin/login");
    } catch {
      toast.error("Sign out failed");
    }
  };

  // If it's the login page, render it directly without layout wrapper or loaders
  if (isLoginPage) {
    return <>{children}</>;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!user || user.email !== "nxteraa953@gmail.com") {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-100 flex flex-col fixed top-0 bottom-0 left-0 z-30">
        {/* Logo */}
        <div className="px-6 py-6 border-b border-gray-100">
          <Link href="/admin" className="flex items-center gap-2">
            <span className="text-xl font-black tracking-tighter">NXT</span>
            <span className="text-xs bg-black text-white px-2 py-0.5 rounded-full font-medium">
              Admin
            </span>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map(({ href, label, icon: Icon }) => {
            const isActive =
              href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(href);

            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-black text-white"
                    : "text-gray-600 hover:bg-gray-100 hover:text-black"
                }`}
              >
                <Icon size={18} />
                {label}
                {isActive && <ChevronRight size={14} className="ml-auto" />}
              </Link>
            );
          })}
        </nav>

        {/* Sign Out */}
        <div className="px-3 pb-4">
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-500 hover:bg-red-50 hover:text-red-600 transition-colors"
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8">
        <motion.div
          key={pathname}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
}
