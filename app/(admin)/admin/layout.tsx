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
  MessageSquare,
  LogOut,
  ChevronRight,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { signOut } from "@/lib/firebase/auth";
import { toast } from "sonner";
import { useAuth } from "@/features/auth/AuthProvider";
import { Spinner } from "@/components/ui/Spinner";

const navItems = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/messages", label: "Messages & Complaints", icon: MessageSquare },
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

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-white">
        <div className="text-center space-y-4">
          <Spinner size="lg" className="border-white border-t-transparent" />
          <p className="text-xs text-zinc-400 font-bold tracking-[0.2em] uppercase">Initializing NXT Admin Console</p>
        </div>
      </div>
    );
  }

  if (!user || user.email !== "nxteraa953@gmail.com") {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex text-zinc-950 font-sans selection:bg-zinc-900 selection:text-white">
      {/* Sidebar - ui-ux-pro-max Obsidian & High-Contrast Console */}
      <aside className="w-64 bg-zinc-950 border-r border-zinc-900 flex flex-col fixed top-0 bottom-0 left-0 z-30 shadow-2xl text-white">
        {/* Logo and Console Indicator */}
        <div className="px-6 py-6 border-b border-zinc-900 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="NXT Logo" className="h-6 w-auto object-contain invert group-hover:scale-105 transition-transform" />
          </Link>
          <span className="text-[9px] tracking-widest bg-amber-500/10 text-amber-400 border border-amber-500/20 font-extrabold uppercase px-2.5 py-0.5 rounded-full flex items-center gap-1">
            <Sparkles size={10} />
            Console
          </span>
        </div>

        {/* User Info Capsule */}
        <div className="px-4 py-4 border-b border-zinc-900 bg-zinc-900/40">
          <div className="flex items-center gap-3 px-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-300 text-zinc-950 flex items-center justify-center text-xs font-black shadow-md">
              A
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold truncate text-zinc-100">Admin Account</p>
              <p className="text-[10px] text-zinc-400 truncate font-mono">nxteraa953@gmail.com</p>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
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
                    ? "bg-white text-zinc-950 shadow-lg shadow-white/10"
                    : "text-zinc-400 hover:bg-zinc-900 hover:text-white"
                }`}
              >
                <Icon
                  size={16}
                  className={`transition-transform duration-300 group-hover:scale-110 ${
                    isActive ? "text-zinc-950" : "text-zinc-400 group-hover:text-amber-400"
                  }`}
                />
                {label}
                {isActive && (
                  <motion.div
                    layoutId="activeIndicatorAdmin"
                    className="absolute right-3 w-1.5 h-1.5 rounded-full bg-zinc-950"
                    transition={{ type: "spring", stiffness: 380, damping: 28 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer actions inside sidebar */}
        <div className="px-3 pb-6 border-t border-zinc-900 pt-4">
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold text-zinc-400 hover:bg-red-950/40 hover:text-red-400 transition-all duration-300"
          >
            <LogOut size={16} className="text-zinc-400 group-hover:text-red-400" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 ml-64 min-h-screen flex flex-col">
        {/* Top Header Bar */}
        <header className="h-16 border-b border-zinc-200/80 bg-white/80 backdrop-blur-md sticky top-0 z-20 px-8 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2 text-zinc-400 text-xs font-medium">
            <span className="font-bold text-zinc-400 uppercase tracking-wider text-[10px]">Dashboard</span>
            <ChevronRight size={12} />
            <span className="text-zinc-900 font-bold capitalize">
              {pathname.split("/").filter(Boolean).slice(1).join(" / ") || "Overview"}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200/60 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm">
              <ShieldCheck size={12} />
              Secure Console Active
            </div>
          </div>
        </header>

        {/* Content Wrapper */}
        <main className="flex-1 p-8 md:p-10 max-w-7xl w-full mx-auto">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
