import Link from "next/link";
import { Facebook, Twitter, Instagram, Youtube } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--muted)] mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand Section */}
          <div>
            <Link href="/" className="text-xl font-bold tracking-tight">
              Sellery
            </Link>
            <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
              Your destination for quality products at great prices. Fast shipping, easy returns, and exceptional customer service.
            </p>
            <div className="mt-6 flex gap-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-[var(--accent)] transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-[var(--accent)] transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-[var(--accent)] transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-[var(--accent)] transition-colors"
                aria-label="YouTube"
              >
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Shop Section */}
          <div>
            <h3 className="font-semibold mb-4">Shop</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/" className="text-gray-600 hover:text-[var(--accent)] transition-colors">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/?category=Electronics+%26+Gadgets" className="text-gray-600 hover:text-[var(--accent)] transition-colors">
                  Electronics & Gadgets
                </Link>
              </li>
              <li>
                <Link href="/?category=Sports+%26+Fitness" className="text-gray-600 hover:text-[var(--accent)] transition-colors">
                  Sports & Fitness
                </Link>
              </li>
              <li>
                <Link href="/?category=Home+%26+Kitchen" className="text-gray-600 hover:text-[var(--accent)] transition-colors">
                  Home & Kitchen
                </Link>
              </li>
              <li>
                <Link href="/?category=Home+%26+Garden" className="text-gray-600 hover:text-[var(--accent)] transition-colors">
                  Home & Garden
                </Link>
              </li>
              <li>
                <Link href="/?category=Health+%26+Wellness" className="text-gray-600 hover:text-[var(--accent)] transition-colors">
                  Health & Wellness
                </Link>
              </li>
              <li>
                <Link href="/?category=Jewelry+%26+Accessories" className="text-gray-600 hover:text-[var(--accent)] transition-colors">
                  Jewelry & Accessories
                </Link>
              </li>
              <li>
                <Link href="/?category=Digital+Products" className="text-gray-600 hover:text-[var(--accent)] transition-colors">
                  Digital Products
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service Section */}
          <div>
            <h3 className="font-semibold mb-4">Customer Service</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/contact" className="text-gray-600 hover:text-[var(--accent)] transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="text-gray-600 hover:text-[var(--accent)] transition-colors">
                  Shipping Information
                </Link>
              </li>
              <li>
                <Link href="/returns" className="text-gray-600 hover:text-[var(--accent)] transition-colors">
                  Returns & Exchanges
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-600 hover:text-[var(--accent)] transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/track-order" className="text-gray-600 hover:text-[var(--accent)] transition-colors">
                  Track Your Order
                </Link>
              </li>
              <li>
                <Link href="/size-guide" className="text-gray-600 hover:text-[var(--accent)] transition-colors">
                  Size Guide
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Section */}
          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/about" className="text-gray-600 hover:text-[var(--accent)] transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/careers" className="text-gray-600 hover:text-[var(--accent)] transition-colors">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-600 hover:text-[var(--accent)] transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/sustainability" className="text-gray-600 hover:text-[var(--accent)] transition-colors">
                  Sustainability
                </Link>
              </li>
              <li>
                <Link href="/press" className="text-gray-600 hover:text-[var(--accent)] transition-colors">
                  Press
                </Link>
              </li>
              <li>
                <Link href="/affiliates" className="text-gray-600 hover:text-[var(--accent)] transition-colors">
                  Affiliate Program
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="mt-12 border-t border-[var(--border)] pt-8">
          <div className="max-w-md">
            <h3 className="font-semibold mb-2">Subscribe to our newsletter</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Get the latest updates on new products and upcoming sales
            </p>
            <form className="flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 rounded-md border border-[var(--border)] bg-transparent px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
              />
              <button
                type="submit"
                className="rounded-md bg-[var(--accent)] px-6 py-2 text-sm font-medium text-[var(--background)] hover:opacity-90 transition-opacity"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 border-t border-[var(--border)] pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            © {new Date().getFullYear()} Sellery. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm">
            <Link href="/privacy" className="text-gray-600 hover:text-[var(--accent)] transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-gray-600 hover:text-[var(--accent)] transition-colors">
              Terms of Service
            </Link>
            <Link href="/cookies" className="text-gray-600 hover:text-[var(--accent)] transition-colors">
              Cookie Policy
            </Link>
            <Link href="/sitemap.xml" className="text-gray-600 hover:text-[var(--accent)] transition-colors">
              Sitemap
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
