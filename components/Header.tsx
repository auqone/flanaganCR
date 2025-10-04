"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, Search, User, Menu, X } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import ThemeToggle from "./ThemeToggle";

const navItems = [
  { name: "All Products", href: "/" },
  { name: "Electronics & Gadgets", href: "/?category=Electronics+%26+Gadgets" },
  { name: "Sports & Fitness", href: "/?category=Sports+%26+Fitness" },
  { name: "Home & Kitchen", href: "/?category=Home+%26+Kitchen" },
  { name: "Home & Garden", href: "/?category=Home+%26+Garden" },
  { name: "Health & Wellness", href: "/?category=Health+%26+Wellness" },
  { name: "Jewelry & Accessories", href: "/?category=Jewelry+%26+Accessories" },
  { name: "Digital Products", href: "/?category=Digital+Products" },
];

export default function Header() {
  const { items } = useCartStore();
  const { isAuthenticated } = useAuth();
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const [isDark, setIsDark] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Check initial theme
    setIsDark(document.documentElement.classList.contains("dark"));

    // Watch for theme changes
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains("dark"));
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[var(--border)] bg-[var(--background)]/95 backdrop-blur supports-[backdrop-filter]:bg-[var(--background)]/60">
      <div className="container mx-auto px-4">
        <div className="flex h-32 items-center justify-between gap-8">
          <Link href="/" className="flex items-center">
            <Image
              src={isDark ? "/logo-light.png" : "/logo-dark.png"}
              alt="Sellery"
              width={150}
              height={150}
              className="object-contain"
            />
          </Link>

          <div className="relative flex-1 max-w-2xl hidden md:block">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              className="w-full rounded-md border border-[var(--border)] bg-transparent py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
            />
          </div>

          <div className="flex items-center gap-4 md:gap-6">
            <ThemeToggle />

            <Link
              href={isAuthenticated ? "/account" : "/login"}
              className="hover:opacity-70 transition-opacity"
            >
              <User className="h-5 w-5" />
            </Link>

            <Link href="/cart" className="relative hover:opacity-70 transition-opacity">
              <ShoppingCart className="h-5 w-5" />
              {itemCount > 0 && (
                <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-[var(--accent)] text-xs text-[var(--background)]">
                  {itemCount}
                </span>
              )}
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden hover:opacity-70 transition-opacity"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Navigation Menu - Second Row - Desktop */}
        <nav className="hidden lg:flex items-center gap-8 pb-3 border-t border-[var(--border)] pt-3">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-sm font-medium hover:text-[var(--accent)] transition-colors"
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <nav className="lg:hidden border-t border-[var(--border)] py-4">
            <div className="flex flex-col space-y-3">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-sm font-medium hover:text-[var(--accent)] transition-colors py-2"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
