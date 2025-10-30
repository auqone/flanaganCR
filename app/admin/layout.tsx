"use client";

import { useState, useEffect, ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Lock, LogOut, Package, List, Plus, ShoppingCart, BarChart3, Users, Mail } from "lucide-react";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  // Skip auth check for login page
  const isLoginPage = pathname === '/admin/login';

  useEffect(() => {
    // Skip auth check if on login page
    if (isLoginPage) {
      setIsLoading(false);
      return;
    }

    // Check if already authenticated by checking if we have a valid session
    checkAuth();
  }, [isLoginPage]);

  const checkAuth = async () => {
    try {
      const response = await fetch("/api/admin/me-test");
      if (response.ok) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    } catch (err) {
      // Not authenticated
      setIsAuthenticated(false);
    }
    setIsLoading(false);
  };

  // Redirect to login if not authenticated (after auth check is done)
  useEffect(() => {
    if (!isLoading && !isLoginPage && !isAuthenticated) {
      router.push('/admin/login');
    }
  }, [isLoading, isLoginPage, isAuthenticated, router]);

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/auth-test", {
        method: "DELETE",
      });
      setIsAuthenticated(false);
      router.push("/");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  // If on login page, render it directly without auth checking
  if (isLoginPage) {
    return <>{children}</>;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Redirecting to login...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--muted)]">
      {/* Admin Navigation */}
      <nav className="bg-[var(--background)] border-b border-[var(--border)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-8">
              <Link href="/admin/dashboard" className="flex items-center gap-2">
                <Image
                  src="/logo.jpg"
                  alt="Flanagan Crafted Naturals"
                  width={120}
                  height={40}
                  className="h-10 w-auto"
                />
              </Link>

              <div className="flex gap-4">
                <Link
                  href="/admin/dashboard"
                  className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${
                    pathname === "/admin/dashboard"
                      ? "bg-[var(--accent)] text-[var(--background)]"
                      : "hover:bg-[var(--muted)]"
                  }`}
                >
                  <BarChart3 className="w-4 h-4" />
                  Dashboard
                </Link>

                <Link
                  href="/admin/orders"
                  className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${
                    pathname === "/admin/orders"
                      ? "bg-[var(--accent)] text-[var(--background)]"
                      : "hover:bg-[var(--muted)]"
                  }`}
                >
                  <ShoppingCart className="w-4 h-4" />
                  Orders
                </Link>

                <Link
                  href="/admin/products"
                  className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${
                    pathname === "/admin/products"
                      ? "bg-[var(--accent)] text-[var(--background)]"
                      : "hover:bg-[var(--muted)]"
                  }`}
                >
                  <Plus className="w-4 h-4" />
                  Add Product
                </Link>

                <Link
                  href="/admin/manage"
                  className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${
                    pathname === "/admin/manage"
                      ? "bg-[var(--accent)] text-[var(--background)]"
                      : "hover:bg-[var(--muted)]"
                  }`}
                >
                  <List className="w-4 h-4" />
                  Manage Products
                </Link>

                <Link
                  href="/admin/customers"
                  className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${
                    pathname === "/admin/customers"
                      ? "bg-[var(--accent)] text-[var(--background)]"
                      : "hover:bg-[var(--muted)]"
                  }`}
                >
                  <Users className="w-4 h-4" />
                  Customers
                </Link>

                <Link
                  href="/admin/subscribers"
                  className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${
                    pathname === "/admin/subscribers"
                      ? "bg-[var(--accent)] text-[var(--background)]"
                      : "hover:bg-[var(--muted)]"
                  }`}
                >
                  <Mail className="w-4 h-4" />
                  Subscribers
                </Link>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-[var(--muted)] transition-colors text-sm"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Admin Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
