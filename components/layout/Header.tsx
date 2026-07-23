"use client";

import Link from "next/link";
import { ShoppingBag, Menu, X, Sun, Moon, Heart, Minus, Plus, Trash2, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useScroll } from "@/hooks/useScroll";
import { useCart } from "@/features/cart/CartProvider";
import { useTheme } from "@/features/theme/ThemeProvider";
import { useWishlist } from "@/features/wishlist/WishlistProvider";
import { cn, formatPrice } from "@/lib/utils";
import { Logo3D } from "@/components/ui/Logo3D";
import { Eye } from "lucide-react";
import { useRouter } from "next/navigation";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/#products", label: "Shop" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  const router = useRouter();
  const { scrolled } = useScroll(40);
  const { totalItems, toggleCart, isOpen: cartOpen, closeCart, items, removeItem, updateQuantity, totalPrice } = useCart();
  const { theme, toggleTheme } = useTheme();
  const { wishlist, toggleWishlistDrawer, isOpen: wishlistOpen, closeWishlist, toggleWishlist } = useWishlist();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      <header
        className={cn(
          "sticky top-0 left-0 right-0 z-40 transition-all duration-300 backdrop-blur-md",
          scrolled
            ? "bg-white/90 dark:bg-black/90 border-b border-gray-200/60 dark:border-zinc-800/60 shadow-md py-1"
            : "bg-white/70 dark:bg-black/70 border-b border-transparent py-2 sm:py-3"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={cn("flex items-center justify-between transition-all duration-300", scrolled ? "h-14 sm:h-16 md:h-18" : "h-18 sm:h-22 md:h-24")}>
            {/* Left Section: Theme + Wishlist + Desktop Nav */}
            <div className="flex items-center gap-2 sm:gap-4 z-20">
              {/* Theme Toggle */}
              <motion.button
                onClick={toggleTheme}
                className={cn(
                  "p-2 transition-all duration-300 rounded-xl hover:bg-black/5 dark:hover:bg-white/5",
                  scrolled || theme === "light" ? "text-black dark:text-white" : "text-white"
                )}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Toggle theme"
              >
                {mounted ? (theme === "dark" ? <Sun size={20} className="sm:w-6 sm:h-6" /> : <Moon size={20} className="sm:w-6 sm:h-6" />) : <div className="w-5 h-5 sm:w-6 sm:h-6" />}
              </motion.button>

              {/* Wishlist Toggle */}
              <motion.button
                onClick={toggleWishlistDrawer}
                className={cn(
                  "relative p-2 transition-all duration-300 rounded-xl hover:bg-black/5 dark:hover:bg-white/5",
                  scrolled || theme === "light" ? "text-black dark:text-white" : "text-white"
                )}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Wishlist"
              >
                <Heart size={20} className={cn("sm:w-6 sm:h-6", wishlist.length > 0 ? "fill-red-500 text-red-500" : "")} />
                <AnimatePresence>
                  {wishlist.length > 0 && (
                    <motion.span
                      key="wishlist-badge"
                      className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-red-500 text-white text-[9px] sm:text-[10px] font-bold rounded-full flex items-center justify-center"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    >
                      {wishlist.length}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>

              {/* Desktop Navigation Links */}
              <nav className="hidden lg:flex items-center gap-6 ml-4">
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
            </div>

            {/* Center: Logo */}
            <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center pointer-events-auto transition-all duration-300">
              <Link href="/">
                <motion.div
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative flex items-center justify-center py-1 transition-all duration-300"
                >
                  <div className="block md:hidden">
                    <Logo3D size={scrolled ? 65 : 80} layers={14} className={theme === "dark" ? "invert" : "invert-0"} />
                  </div>
                  <div className="hidden md:block">
                    <Logo3D size={scrolled ? 85 : 115} layers={14} className={theme === "dark" ? "invert" : "invert-0"} />
                  </div>
                </motion.div>
              </Link>
            </div>

            {/* Right Section: Cart + Mobile Menu */}
            <div className="flex items-center gap-2 sm:gap-4 z-20">
              {/* Cart Toggle */}
              <motion.button
                onClick={toggleCart}
                className={cn(
                  "relative p-2 transition-all duration-300 rounded-xl hover:bg-black/5 dark:hover:bg-white/5",
                  scrolled || theme === "light" ? "text-black dark:text-white" : "text-white"
                )}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Shopping cart"
              >
                <ShoppingBag size={22} className="sm:w-6 sm:h-6" />
                <AnimatePresence>
                  {totalItems > 0 && (
                    <motion.span
                      key="badge"
                      className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-black text-white dark:bg-white dark:text-black text-[9px] sm:text-[10px] font-bold rounded-full flex items-center justify-center"
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
                  "p-2 transition-colors rounded-xl hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer",
                  scrolled || theme === "light" ? "text-black dark:text-white" : "text-white"
                )}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setMobileOpen((prev) => !prev);
                }}
                aria-label="Toggle menu"
              >
                {mobileOpen ? <X size={22} className="sm:w-6 sm:h-6" /> : <Menu size={22} className="sm:w-6 sm:h-6" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ─── Mobile Navigation Drawer ─────────────────────────── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[99998]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
            />
            <motion.nav
              className="fixed top-0 left-0 bottom-0 w-80 bg-white dark:bg-zinc-950 border-r border-gray-100 dark:border-zinc-900 z-[99999] flex flex-col pt-20 px-6 shadow-2xl"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
            >
              <div className="flex items-center justify-between absolute top-6 left-6 right-6 border-b border-gray-100 dark:border-zinc-900 pb-4">
                <span className="text-xl font-black tracking-tighter text-foreground">NXT MENU</span>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="p-2 rounded-xl bg-gray-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400"
                >
                  <X size={18} />
                </button>
              </div>
              <div className="flex flex-col gap-1 mt-4">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Link
                      href={link.href}
                      className="block py-4 text-base font-bold border-b border-gray-100 dark:border-zinc-900 text-foreground hover:opacity-60 transition-opacity"
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

      {/* ─── Cart Drawer (same pattern as mobile menu) ───────── */}
      <AnimatePresence>
        {cartOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[99998]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeCart}
            />
            <motion.aside
              className="fixed top-0 right-0 bottom-0 w-full max-w-sm sm:max-w-md bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 z-[99999] flex flex-col shadow-2xl border-l border-zinc-200 dark:border-zinc-800"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 350 }}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-200 dark:border-zinc-800 flex-shrink-0 bg-white dark:bg-zinc-950">
                <div className="flex items-center gap-2.5">
                  <ShoppingBag size={20} />
                  <h2 className="font-extrabold text-sm uppercase tracking-wider">سلة الشراء</h2>
                  {totalItems > 0 && (
                    <span className="bg-black text-white dark:bg-white dark:text-black text-[10px] font-black px-2 py-0.5 rounded-full">
                      {totalItems}
                    </span>
                  )}
                </div>
                <button type="button" onClick={closeCart} className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors cursor-pointer">
                  <X size={18} />
                </button>
              </div>

              {/* Items — scrolls internally only */}
              <div className="flex-1 min-h-0 overflow-y-auto px-4 py-4 space-y-3">
                {items.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center gap-4 py-16">
                    <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-900 rounded-full flex items-center justify-center text-zinc-400">
                      <ShoppingBag size={28} />
                    </div>
                    <div>
                      <p className="font-bold text-sm">سلة الشراء فارغة</p>
                      <p className="text-xs text-zinc-400 mt-1">أضف منتجاتك المفضلة لبدء التسوق الآن</p>
                    </div>
                    <button type="button" onClick={() => { closeCart(); router.push("/shop"); }} className="px-6 py-2.5 bg-black text-white dark:bg-white dark:text-black rounded-xl text-xs font-bold hover:opacity-90 transition-all cursor-pointer">
                      تصفح المنتجات
                    </button>
                  </div>
                ) : (
                  items.map((item) => {
                    const key = `${item.product.id}-${item.selectedSize}-${item.selectedColor.hex}`;
                    const price = item.product.salePrice ?? item.product.price;
                    return (
                      <motion.div key={key} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} className="flex items-center gap-3 p-3 bg-zinc-50 dark:bg-zinc-900/60 rounded-xl border border-zinc-200/60 dark:border-zinc-800">
                        <div className="w-14 h-14 rounded-lg overflow-hidden bg-white dark:bg-zinc-900 flex-shrink-0 p-1 border border-zinc-200/60 dark:border-zinc-800">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={item.selectedColor.image || item.product.mainImage || "/placeholder.jpg"} alt={item.product.name} className="w-full h-full object-contain" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1">
                            <h4 className="font-bold text-xs truncate">{item.product.name}</h4>
                            <button type="button" onClick={() => removeItem(item.product.id, item.selectedSize, item.selectedColor.hex)} className="text-zinc-400 hover:text-red-500 transition-colors p-0.5 cursor-pointer flex-shrink-0"><Trash2 size={14} /></button>
                          </div>
                          <div className="flex items-center gap-2 mt-0.5">
                            <div className="flex items-center gap-1">
                              <span className="w-2.5 h-2.5 rounded-full border border-zinc-300 dark:border-zinc-700" style={{ backgroundColor: item.selectedColor.hex }} />
                              <span className="text-[10px] text-zinc-500 dark:text-zinc-400 font-medium">{item.selectedColor.name}</span>
                            </div>
                            <span className="text-[10px] font-bold bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 px-1.5 rounded">{item.selectedSize}</span>
                          </div>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-xs font-black">{formatPrice(price * item.quantity)}</span>
                            <div className="flex items-center gap-1.5 bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 px-1.5 py-0.5 shadow-sm">
                              <button type="button" onClick={() => updateQuantity(item.product.id, item.selectedSize, item.selectedColor.hex, item.quantity - 1)} className="w-4 h-4 flex items-center justify-center hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded cursor-pointer"><Minus size={10} /></button>
                              <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                              <button type="button" onClick={() => updateQuantity(item.product.id, item.selectedSize, item.selectedColor.hex, item.quantity + 1)} className="w-4 h-4 flex items-center justify-center hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded cursor-pointer"><Plus size={10} /></button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })
                )}
              </div>

              {/* Pinned Checkout Footer */}
              {items.length > 0 && (
                <div className="px-5 py-4 border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 flex-shrink-0 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-zinc-500 dark:text-zinc-400 font-bold uppercase tracking-wider">المجموع الكلي</span>
                    <span className="font-black text-base">{formatPrice(totalPrice)}</span>
                  </div>
                  <Link href="/checkout" onClick={closeCart} className="flex items-center justify-center gap-2 w-full py-3.5 bg-black text-white dark:bg-white dark:text-black rounded-xl font-bold text-xs hover:opacity-90 transition-all shadow-lg cursor-pointer">
                    <span>إتمام الشراء الآن</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
              )}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ─── Wishlist Drawer (same pattern as mobile menu) ────── */}
      <AnimatePresence>
        {wishlistOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[99998]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeWishlist}
            />
            <motion.aside
              className="fixed top-0 right-0 bottom-0 w-full max-w-sm bg-white dark:bg-zinc-950 z-[99999] shadow-2xl border-l border-zinc-100 dark:border-zinc-900 flex flex-col overflow-hidden"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 350 }}
            >
              {/* Header */}
              <div className="px-5 py-4 border-b border-zinc-100 dark:border-zinc-900 flex items-center justify-between flex-shrink-0 bg-white dark:bg-zinc-950">
                <div className="flex items-center gap-2">
                  <Heart size={18} className="fill-zinc-900 dark:fill-white text-zinc-900 dark:text-white" />
                  <h2 className="text-sm font-extrabold uppercase tracking-wider">المفضلة ({wishlist.length})</h2>
                </div>
                <button onClick={closeWishlist} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-all cursor-pointer">
                  <X size={16} />
                </button>
              </div>

              {/* Body */}
              <div className="flex-1 min-h-0 overflow-y-auto px-4 py-3 space-y-2.5">
                {wishlist.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center space-y-3 py-10">
                    <div className="w-14 h-14 rounded-full bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center text-zinc-400">
                      <Heart size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm">قائمة المفضلة فارغة</h3>
                      <p className="text-xs text-zinc-400 mt-1 max-w-[220px] mx-auto">احفظ المنتجات التي تحبها هنا لتتمكن من العثور عليها بسهولة!</p>
                    </div>
                    <button onClick={closeWishlist} className="px-5 py-2 bg-black text-white dark:bg-white dark:text-black rounded-xl text-xs font-bold hover:opacity-90 transition-all cursor-pointer">
                      تصفح المنتجات
                    </button>
                  </div>
                ) : (
                  wishlist.map((product) => {
                    const displayPrice = product.salePrice ?? product.price;
                    return (
                      <motion.div key={product.id} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3 p-2.5 bg-zinc-50 dark:bg-zinc-900/60 rounded-xl border border-zinc-100 dark:border-zinc-900">
                        <div className="w-14 h-14 rounded-lg overflow-hidden bg-white dark:bg-zinc-950 flex-shrink-0 p-1 border border-zinc-100 dark:border-zinc-800">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={product.mainImage || "/placeholder.jpg"} alt={product.name} className="w-full h-full object-contain" />
                        </div>
                        <div className="flex-1 min-w-0 flex flex-col justify-between">
                          <div className="flex justify-between items-start gap-1">
                            <h4 className="font-bold text-xs truncate">{product.name}</h4>
                            <button onClick={() => toggleWishlist(product)} className="text-zinc-400 hover:text-red-500 transition-colors p-0.5 cursor-pointer flex-shrink-0"><X size={13} /></button>
                          </div>
                          <div className="flex items-center justify-between mt-1.5">
                            <span className="text-xs font-black">{formatPrice(displayPrice)}</span>
                            <button
                              type="button"
                              onClick={() => {
                                closeWishlist();
                                router.push(`/products?id=${encodeURIComponent(product.id)}`);
                              }}
                              className="inline-flex items-center gap-1 bg-black text-white dark:bg-white dark:text-black px-2.5 py-1.5 rounded-lg text-[9px] font-black hover:opacity-90 transition-all cursor-pointer shadow-sm"
                            >
                              <Eye size={10} />
                              عرض المنتج
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })
                )}
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
