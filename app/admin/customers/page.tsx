"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Users,
  Search,
  Mail,
  MapPin,
  Phone,
  ShoppingBag,
  DollarSign,
  Calendar,
  RefreshCw,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

interface Order {
  id: string;
  orderNumber: string;
  total: number;
  status: string;
  createdAt: string;
}

interface Customer {
  id: string;
  email: string;
  name: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  createdAt: string;
  orders: Order[];
  totalSpent: number;
  orderCount: number;
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedCustomer, setExpandedCustomer] = useState<string | null>(null);

  const fetchCustomers = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (searchTerm) params.append("search", searchTerm);

      const response = await fetch(`/api/admin/customers?${params}`, {
        credentials: "include",
      });
      const result = await response.json();
      setCustomers(result.data || result);
    } catch (error) {
      console.error("Error fetching customers:", error);
    } finally {
      setLoading(false);
    }
  }, [searchTerm]);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const toggleCustomer = (id: string) => {
    setExpandedCustomer(expandedCustomer === id ? null : id);
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Customer Management</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          View and manage your customers and their order history
        </p>
      </div>

      {/* Search */}
      <div className="bg-[var(--background)] rounded-lg shadow-sm p-6 mb-6">
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium mb-2">Search Customers</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-md border border-[var(--border)] bg-transparent"
              />
            </div>
          </div>
          <div className="flex items-end">
            <button
              onClick={fetchCustomers}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-[var(--accent)] text-[var(--background)] rounded-md font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-[var(--background)] rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">Total Customers</span>
            <Users className="w-5 h-5 text-blue-500" />
          </div>
          <p className="text-2xl font-bold">{customers.length}</p>
        </div>

        <div className="bg-[var(--background)] rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">Total Orders</span>
            <ShoppingBag className="w-5 h-5 text-green-500" />
          </div>
          <p className="text-2xl font-bold">
            {customers.reduce((sum, c) => sum + c.orderCount, 0)}
          </p>
        </div>

        <div className="bg-[var(--background)] rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">Total Revenue</span>
            <DollarSign className="w-5 h-5 text-purple-500" />
          </div>
          <p className="text-2xl font-bold">
            ${customers.reduce((sum, c) => sum + c.totalSpent, 0).toFixed(2)}
          </p>
        </div>
      </div>

      {/* Customers List */}
      {loading ? (
        <div className="text-center py-12">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p>Loading customers...</p>
        </div>
      ) : customers.length === 0 ? (
        <div className="bg-[var(--background)] rounded-lg shadow-sm p-12 text-center">
          <Users className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h3 className="text-xl font-semibold mb-2">No customers found</h3>
          <p className="text-gray-600 dark:text-gray-400">
            {searchTerm
              ? "Try adjusting your search"
              : "Customers will appear here when they place orders"}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {customers.map((customer) => (
            <div
              key={customer.id}
              className="bg-[var(--background)] rounded-lg shadow-sm overflow-hidden"
            >
              <div
                className="p-6 cursor-pointer hover:bg-[var(--muted)] transition-colors"
                onClick={() => toggleCustomer(customer.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-[var(--accent)] flex items-center justify-center text-[var(--background)] font-bold text-lg">
                        {customer.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">{customer.name}</h3>
                        <div className="flex items-center gap-4 mt-1 text-sm text-gray-600 dark:text-gray-400">
                          <span className="flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            {customer.email}
                          </span>
                          {customer.phone && (
                            <span className="flex items-center gap-1">
                              <Phone className="w-3 h-3" />
                              {customer.phone}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-8">
                    <div className="text-right">
                      <p className="text-sm text-gray-600 dark:text-gray-400">Orders</p>
                      <p className="text-xl font-bold">{customer.orderCount}</p>
                    </div>

                    <div className="text-right">
                      <p className="text-sm text-gray-600 dark:text-gray-400">Total Spent</p>
                      <p className="text-xl font-bold text-green-600">
                        ${customer.totalSpent.toFixed(2)}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-sm text-gray-600 dark:text-gray-400">Joined</p>
                      <p className="text-sm">
                        {new Date(customer.createdAt).toLocaleDateString()}
                      </p>
                    </div>

                    {expandedCustomer === customer.id ? (
                      <ChevronUp className="w-5 h-5" />
                    ) : (
                      <ChevronDown className="w-5 h-5" />
                    )}
                  </div>
                </div>
              </div>

              {expandedCustomer === customer.id && (
                <div className="px-6 pb-6 pt-0 border-t border-[var(--border)]">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    {/* Shipping Address */}
                    {customer.address && (
                      <div>
                        <h4 className="font-semibold mb-2 flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          Shipping Address
                        </h4>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          <p>{customer.address}</p>
                          <p>
                            {customer.city}, {customer.state} {customer.zipCode}
                          </p>
                          <p>{customer.country}</p>
                        </div>
                      </div>
                    )}

                    {/* Order History */}
                    <div>
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <ShoppingBag className="w-4 h-4" />
                        Recent Orders
                      </h4>
                      {customer.orders.length === 0 ? (
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          No orders yet
                        </p>
                      ) : (
                        <div className="space-y-2">
                          {customer.orders.slice(0, 5).map((order) => (
                            <div
                              key={order.id}
                              className="flex items-center justify-between text-sm p-2 rounded hover:bg-[var(--muted)]"
                            >
                              <div>
                                <p className="font-medium">{order.orderNumber}</p>
                                <p className="text-xs text-gray-500">
                                  {new Date(order.createdAt).toLocaleDateString()}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="font-semibold">
                                  ${order.total.toFixed(2)}
                                </p>
                                <span className="text-xs px-2 py-1 rounded bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200">
                                  {order.status}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
