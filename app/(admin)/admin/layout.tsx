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
  ShieldCheck,
} from "lucide-react";
import { signOut } from "@/lib/firebase/auth";
import { toast } from "sonner";
import { useAuth } from "@/features/auth/AuthProvider";
import { Spinner } from "@/components/ui/Spinner";

const navItems = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
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
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Spinner size="lg" />
          <p className="text-xs text-zinc-400 font-medium tracking-widest uppercase">Initializing NXT Admin</p>
        </div>
      </div>
    );
  }

  if (!user || user.email !== "nxteraa953@gmail.com") {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#FBFBFD] flex text-zinc-950 font-sans">
      {/* Sidebar - Premium Minimalist Float Panel */}
      <aside className="w-64 bg-white/70 backdrop-blur-lg border-r border-zinc-100 flex flex-col fixed top-0 bottom-0 left-0 z-30 shadow-[1px_0_10px_rgba(0,0,0,0.01)]">
        {/* Logo and Admin indicator */}
        <div className="px-6 py-6 border-b border-zinc-100 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="NXT Logo" className="h-6 w-auto object-contain" />
          </Link>
          <span className="text-[9px] tracking-widest bg-zinc-900 text-white font-bold uppercase px-2 py-0.5 rounded-md">
            Console
          </span>
        </div>

        {/* User Info Capsule */}
        <div className="px-4 py-4 border-b border-zinc-100/60 bg-zinc-50/40">
          <div className="flex items-center gap-2.5 px-2">
            <div className="w-7 h-7 rounded-full bg-zinc-900 flex items-center justify-center text-white text-xs font-bold shadow-md">
              A
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold truncate text-zinc-800">Admin Account</p>
              <p className="text-[10px] text-zinc-400 truncate font-mono">nxteraa953@gmail.com</p>
            </div>
          </div>
        </div>

        {/* Navigation - Spaced and clean items */}
        <nav className="flex-1 px-3 py-6 space-y-1.5 overflow-y-auto">
          {navItems.map(({ href, label, icon: Icon }) => {
            const isActive =
              href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(href);

            return (
              <Link
                key={href}
                href={href}
                className={`group flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 relative ${
                  isActive
                    ? "bg-zinc-900 text-white shadow-lg shadow-zinc-900/10"
                    : "text-zinc-500 hover:bg-zinc-100/80 hover:text-zinc-900"
                }`}
              >
                <Icon size={16} className={`transition-transform duration-300 group-hover:scale-105 ${isActive ? "text-white" : "text-zinc-400 group-hover:text-zinc-800"}`} />
                {label}
                {isActive && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute right-3 w-1 h-1 rounded-full bg-white"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer actions inside sidebar */}
        <div className="px-3 pb-6 border-t border-zinc-100/80 pt-4">
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold text-zinc-400 hover:bg-red-50/60 hover:text-red-600 transition-all duration-300"
          >
            <LogOut size={16} className="text-zinc-400 group-hover:text-red-500" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 ml-64 min-h-screen flex flex-col">
        {/* Top bar */}
        <header className="h-16 border-b border-zinc-100 bg-white/40 backdrop-blur-md sticky top-0 z-20 px-8 flex items-center justify-between">
          <div className="flex items-center gap-2 text-zinc-400 text-xs font-medium">
            <span>Dashboard</span>
            <ChevronRight size={12} />
            <span className="text-zinc-800 font-bold capitalize">
              {pathname.split("/").filter(Boolean).slice(1).join(" / ") || "Overview"}
            </span>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 bg-green-50 text-green-700 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
              <ShieldCheck size={12} />
              Secure Link
            </div>
          </div>
        </header>

        {/* Content Wrapper */}
        <main className="flex-1 p-8 md:p-10 max-w-7xl w-full mx-auto">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
