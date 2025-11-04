"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { User, Package, MapPin, Heart, Settings, LogOut } from "lucide-react";

export default function AccountPage() {
  const router = useRouter();
  const { customer, isAuthenticated, isLoading, logout } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--accent)] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!customer) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">My Account</h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Sidebar */}
            <div className="md:col-span-1">
              <div className="bg-[var(--muted)] rounded-lg p-6 sticky top-24">
                <div className="flex items-center gap-4 mb-6 pb-6 border-b border-[var(--border)]">
                  <div className="w-16 h-16 rounded-full bg-[var(--accent)] flex items-center justify-center text-[var(--background)] text-2xl font-bold">
                    {customer.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-semibold">{customer.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{customer.email}</p>
                  </div>
                </div>

                <nav className="space-y-2">
                  <Link
                    href="/account"
                    className="flex items-center gap-3 px-4 py-2 rounded-md bg-[var(--accent)]/10 text-[var(--accent)] font-medium"
                  >
                    <User className="h-5 w-5" />
                    Profile
                  </Link>
                  <Link
                    href="/account/orders"
                    className="flex items-center gap-3 px-4 py-2 rounded-md hover:bg-[var(--background)] transition-colors"
                  >
                    <Package className="h-5 w-5" />
                    Orders
                  </Link>
                  <Link
                    href="/account/addresses"
                    className="flex items-center gap-3 px-4 py-2 rounded-md hover:bg-[var(--background)] transition-colors"
                  >
                    <MapPin className="h-5 w-5" />
                    Addresses
                  </Link>
                  <Link
                    href="/account/wishlist"
                    className="flex items-center gap-3 px-4 py-2 rounded-md hover:bg-[var(--background)] transition-colors"
                  >
                    <Heart className="h-5 w-5" />
                    Wishlist
                  </Link>
                  <Link
                    href="/account/settings"
                    className="flex items-center gap-3 px-4 py-2 rounded-md hover:bg-[var(--background)] transition-colors"
                  >
                    <Settings className="h-5 w-5" />
                    Settings
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 transition-colors"
                  >
                    <LogOut className="h-5 w-5" />
                    Logout
                  </button>
                </nav>
              </div>
            </div>

            {/* Main Content */}
            <div className="md:col-span-2 space-y-6">
              {/* Welcome Card */}
              <div className="bg-gradient-to-r from-[var(--accent)] to-blue-600 rounded-lg p-8 text-white">
                <h2 className="text-2xl font-bold mb-2">Welcome back, {customer.name}! 👋</h2>
                <p className="opacity-90">Manage your orders, addresses, and account settings</p>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-[var(--muted)] rounded-lg p-6">
                  <Package className="h-8 w-8 text-[var(--accent)] mb-3" />
                  <div className="text-2xl font-bold">0</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Total Orders</div>
                </div>
                <div className="bg-[var(--muted)] rounded-lg p-6">
                  <MapPin className="h-8 w-8 text-[var(--accent)] mb-3" />
                  <div className="text-2xl font-bold">0</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Saved Addresses</div>
                </div>
                <div className="bg-[var(--muted)] rounded-lg p-6">
                  <Heart className="h-8 w-8 text-[var(--accent)] mb-3" />
                  <div className="text-2xl font-bold">0</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Wishlist Items</div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-[var(--muted)] rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Recent Orders</h3>
                <div className="text-center py-12 text-gray-500">
                  <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No orders yet</p>
                  <Link
                    href="/"
                    className="mt-4 inline-block text-[var(--accent)] hover:underline"
                  >
                    Start Shopping
                  </Link>
                </div>
              </div>

              {/* Account Info */}
              <div className="bg-[var(--muted)] rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Account Information</h3>
                <div className="space-y-4">
                  <div className="flex justify-between py-3 border-b border-[var(--border)]">
                    <span className="text-gray-600 dark:text-gray-400">Full Name</span>
                    <span className="font-medium">{customer.name}</span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-[var(--border)]">
                    <span className="text-gray-600 dark:text-gray-400">Email</span>
                    <span className="font-medium">{customer.email}</span>
                  </div>
                  <div className="flex justify-between py-3">
                    <span className="text-gray-600 dark:text-gray-400">Member Since</span>
                    <span className="font-medium">
                      {new Date(customer.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <Link
                  href="/account/settings"
                  className="mt-6 inline-block text-[var(--accent)] hover:underline"
                >
                  Edit Profile →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
