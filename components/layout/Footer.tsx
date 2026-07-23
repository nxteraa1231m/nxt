import Link from "next/link";
import { Instagram, Facebook, Tiktok } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <span className="text-3xl font-black tracking-tighter">NXT</span>
            <p className="mt-4 text-gray-400 text-sm leading-relaxed max-w-sm">
              Premium fashion for modern people. Elevate your style with our
              curated collections of high-quality clothing and accessories.
            </p>
            <div className="flex gap-4 mt-6">
              {[
                {
                  icon: Instagram,
                  label: "Instagram",
                  href: "https://www.instagram.com/nxt_era11?igsh=a24waXR2OXQwdmhv&utm_source=qr",
                },
                {
                  icon: Facebook,
                  label: "Facebook",
                  href: "https://www.facebook.com/share/1D4P25PPrn/?mibextid=wwXIfr",
                },
                {
                  icon: Tiktok,
                  label: "TikTok",
                  href: "https://www.tiktok.com/@nxt_eraa?_r=1&_t=ZS-98G939LYUoU",
                },
              ].map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center hover:bg-white/20 transition-colors"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="font-bold text-sm tracking-widest uppercase mb-4">
              Shop
            </h4>
            <ul className="space-y-3 text-sm text-gray-400">
              {[
                { href: "/shop", label: "All Products" },
                { href: "/shop?category=men", label: "Men" },
                { href: "/shop?category=women", label: "Women" },
                { href: "/shop?featured=true", label: "New Arrivals" },
                { href: "/shop?bestSeller=true", label: "Best Sellers" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Info */}
          <div>
            <h4 className="font-bold text-sm tracking-widest uppercase mb-4">
              Info
            </h4>
            <ul className="space-y-3 text-sm text-gray-400">
              {[
                { href: "/contact", label: "Contact Us" },
                { href: "/privacy", label: "Privacy Policy" },
                { href: "/terms", label: "Terms of Service" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <p className="font-semibold">Stay in the loop</p>
              <p className="text-gray-400 text-sm">
                Subscribe for exclusive drops and early access.
              </p>
            </div>
            <form className="flex gap-2 w-full md:w-auto">
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 md:w-64 px-4 py-3 bg-white/10 rounded-xl text-sm text-white placeholder:text-gray-500 border border-white/10 focus:outline-none focus:border-white/30 transition-colors"
              />
              <button
                type="submit"
                className="px-5 py-3 bg-white text-black rounded-xl text-sm font-semibold hover:bg-gray-100 transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-8 pt-6 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-gray-500">
          <p>© {new Date().getFullYear()} NXT. All rights reserved.</p>
          <p>Designed with ♥ for modern fashion</p>
        </div>
      </div>
    </footer>
  );
}
