import type { Metadata } from "next";
import { Outfit, Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/features/cart/CartProvider";
import { AuthProvider } from "@/features/auth/AuthProvider";
import { ThemeProvider } from "@/features/theme/ThemeProvider";
import { WishlistProvider } from "@/features/wishlist/WishlistProvider";
import { Toaster } from "sonner";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://nxt-store.vercel.app"
  ),
  title: {
    default: "NXT — Premium Fashion",
    template: "%s | NXT",
  },
  description:
    "Discover premium fashion for modern people. Shop the latest collections at NXT.",
  keywords: ["fashion", "clothing", "premium", "luxury", "NXT", "menswear", "womenswear"],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "NXT",
    title: "NXT — Premium Fashion",
    description:
      "Discover premium fashion for modern people. Shop the latest collections at NXT.",
  },
  twitter: {
    card: "summary_large_image",
    title: "NXT — Premium Fashion",
    description: "Discover premium fashion for modern people.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

import { ErrorTrackerProvider } from "@/components/ui/ErrorTrackerProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${outfit.variable} ${inter.variable}`} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var saved = localStorage.getItem('nxt-theme');
                  var system = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  if (saved === 'dark' || (!saved && system)) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="font-sans antialiased bg-background text-foreground transition-colors duration-300">
        <ErrorTrackerProvider>
          <AuthProvider>
            <ThemeProvider>
              <CartProvider>
                <WishlistProvider>
                  {children}
                  <Toaster
                    position="bottom-right"
                    toastOptions={{
                      style: {
                        background: "#000",
                        color: "#fff",
                        borderRadius: "12px",
                        border: "none",
                      },
                    }}
                  />
                </WishlistProvider>
              </CartProvider>
            </ThemeProvider>
          </AuthProvider>
        </ErrorTrackerProvider>
      </body>
    </html>
  );
}
