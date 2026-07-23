"use client";

import Link from "next/link";
import { ShoppingBag, Menu, X, Sun, Moon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useScroll } from "@/hooks/useScroll";
import { useCart } from "@/features/cart/CartProvider";
import { useTheme } from "@/features/theme/ThemeProvider";
import { cn } from "@/lib/utils";
import { Logo3D } from "@/components/ui/Logo3D";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/#products", label: "Shop" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  const { scrolled } = useScroll(40);
  const { totalItems, toggleCart } = useCart();
  const { theme, toggleTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-40 transition-all duration-500",
          scrolled
            ? "bg-white/95 dark:bg-black/95 backdrop-blur-md border-b border-gray-100 dark:border-zinc-900 shadow-sm"
            : "bg-transparent"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link href="/" className="flex-shrink-0 flex items-center">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative flex items-center justify-start"
              >
                <Logo3D size={44} layers={8} className={theme === "dark" ? "invert" : "invert-0"} />
              </motion.div>
            </Link>

            {/* Desktop Navigation — centered */}
            <nav className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "text-sm font-medium tracking-wide transition-all duration-300 hover:opacity-70",
                    scrolled || theme === "light" ? "text-black dark:text-white" : "text-white"
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-3">
              {/* Theme Toggle */}
              <motion.button
                onClick={toggleTheme}
                className={cn(
                  "p-2 transition-all duration-300 rounded-lg hover:bg-black/5 dark:hover:bg-white/5",
                  scrolled || theme === "light" ? "text-black dark:text-white" : "text-white"
                )}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Toggle theme"
              >
                {mounted ? (theme === "dark" ? <Sun size={20} /> : <Moon size={20} />) : <div className="w-5 h-5" />}
              </motion.button>

              {/* Cart */}
              <motion.button
                onClick={toggleCart}
                className={cn(
                  "relative p-2 transition-all duration-300",
                  scrolled || theme === "light" ? "text-black dark:text-white" : "text-white"
                )}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Shopping cart"
              >
                <ShoppingBag size={22} />
                <AnimatePresence>
                  {totalItems > 0 && (
                    <motion.span
                      key="badge"
                      className="absolute -top-1 -right-1 w-5 h-5 bg-black text-white dark:bg-white dark:text-black text-[10px] font-bold rounded-full flex items-center justify-center"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    >
                      {totalItems > 9 ? "9+" : totalItems}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>

              {/* Mobile Menu Button */}
              <button
                className={cn(
                  "md:hidden p-2 transition-colors",
                  scrolled || theme === "light" ? "text-black dark:text-white" : "text-white"
                )}
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label="Toggle menu"
              >
                {mobileOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/50 z-30 md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
            />
            <motion.nav
              className="fixed top-0 left-0 bottom-0 w-72 bg-white dark:bg-zinc-950 border-r border-gray-100 dark:border-zinc-900 z-40 md:hidden flex flex-col pt-20 px-6"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
            >
              <div className="absolute top-5 left-4">
                <span className="text-2xl font-black tracking-tighter text-foreground">NXT</span>
              </div>
              <div className="flex flex-col gap-1">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Link
                      href={link.href}
                      className="block py-4 text-lg font-semibold border-b border-gray-100 dark:border-zinc-900 text-foreground hover:opacity-60 transition-opacity"
                      onClick={() => setMobileOpen(false)}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
