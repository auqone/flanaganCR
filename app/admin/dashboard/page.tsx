"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import {
  DollarSign,
  ShoppingCart,
  Users,
  TrendingUp,
  Package,
  RefreshCw,
  Calendar,
} from "lucide-react";

interface Analytics {
  period: number;
  summary: {
    totalRevenue: number;
    totalOrders: number;
    totalCustomers: number;
    avgOrderValue: number;
    totalProfit: number;
  };
  ordersByStatus: Array<{ status: string; _count: { status: number } }>;
  topProducts: Array<{
    id: string;
    name: string;
    price: number;
    image: string;
    totalSold: number;
    orderCount: number;
  }>;
  dailyRevenue: Array<{ date: string; revenue: number; orders: number }>;
  recentOrders: Array<{
    id: string;
    orderNumber: string;
    total: number;
    status: string;
    createdAt: string;
    customer: {
      name: string;
      email: string;
    };
  }>;
}

export default function DashboardPage() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState("30");

  const fetchAnalytics = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/analytics-test?period=${period}`, {
        credentials: "include",
      });
      const data = await response.json();
      setAnalytics(data);
    } catch (error) {
      console.error("Error fetching analytics:", error);
    } finally {
      setLoading(false);
    }
  }, [period]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <RefreshCw className="w-8 h-8 animate-spin text-[var(--accent)]" />
      </div>
    );
  }

  if (!analytics || !analytics.summary) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <p className="text-red-600 mb-4">Failed to load analytics data</p>
          <button
            onClick={fetchAnalytics}
            className="px-4 py-2 bg-[var(--accent)] text-[var(--background)] rounded-md"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const { summary, ordersByStatus, topProducts, dailyRevenue, recentOrders } = analytics;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Track your store&apos;s performance and sales
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="px-4 py-2 rounded-md border border-[var(--border)] bg-transparent"
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
            <option value="365">Last year</option>
          </select>

          <button
            onClick={fetchAnalytics}
            className="flex items-center gap-2 px-4 py-2 bg-[var(--accent)] text-[var(--background)] rounded-md font-medium hover:opacity-90"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Total Revenue */}
        <div className="bg-[var(--background)] rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">Total Revenue</span>
            <DollarSign className="w-5 h-5 text-green-500" />
          </div>
          <p className="text-2xl font-bold">${summary.totalRevenue.toFixed(2)}</p>
        </div>

        {/* Total Profit */}
        <div className="bg-[var(--background)] rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">Total Profit</span>
            <TrendingUp className="w-5 h-5 text-blue-500" />
          </div>
          <p className="text-2xl font-bold">${summary.totalProfit.toFixed(2)}</p>
          <p className="text-xs text-gray-500 mt-1">
            {summary.totalRevenue > 0
              ? `${((summary.totalProfit / summary.totalRevenue) * 100).toFixed(1)}% margin`
              : "N/A"}
          </p>
        </div>

        {/* Total Orders */}
        <div className="bg-[var(--background)] rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">Total Orders</span>
            <ShoppingCart className="w-5 h-5 text-purple-500" />
          </div>
          <p className="text-2xl font-bold">{summary.totalOrders}</p>
        </div>

        {/* Avg Order Value */}
        <div className="bg-[var(--background)] rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">Avg Order Value</span>
            <DollarSign className="w-5 h-5 text-yellow-500" />
          </div>
          <p className="text-2xl font-bold">${summary.avgOrderValue.toFixed(2)}</p>
        </div>

        {/* Total Customers */}
        <div className="bg-[var(--background)] rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">New Customers</span>
            <Users className="w-5 h-5 text-pink-500" />
          </div>
          <p className="text-2xl font-bold">{summary.totalCustomers}</p>
        </div>
      </div>

      {/* Orders by Status */}
      <div className="bg-[var(--background)] rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">Orders by Status</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
          {ordersByStatus.map((status) => (
            <div key={status.status} className="text-center">
              <p className="text-2xl font-bold">{status._count.status}</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">{status.status}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Selling Products */}
        <div className="bg-[var(--background)] rounded-lg shadow-md p-6">
          <div className="flex items-center gap-2 mb-4">
            <Package className="w-5 h-5 text-[var(--accent)]" />
            <h3 className="text-lg font-semibold">Top Selling Products</h3>
          </div>
          {topProducts.length === 0 ? (
            <p className="text-gray-600 dark:text-gray-400 text-center py-8">
              No sales data yet
            </p>
          ) : (
            <div className="space-y-3">
              {topProducts.map((product, index) => (
                <div key={product.id} className="flex items-center gap-3 p-3 rounded-md hover:bg-[var(--muted)]">
                  <span className="text-lg font-bold text-gray-400 w-6">{index + 1}</span>
                  <Image
                    src={product.image}
                    alt={product.name}
                    width={48}
                    height={48}
                    className="w-12 h-12 object-cover rounded"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{product.name}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      ${product.price.toFixed(2)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{product.totalSold} sold</p>
                    <p className="text-xs text-gray-500">{product.orderCount} orders</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Orders */}
        <div className="bg-[var(--background)] rounded-lg shadow-md p-6">
          <div className="flex items-center gap-2 mb-4">
            <ShoppingCart className="w-5 h-5 text-[var(--accent)]" />
            <h3 className="text-lg font-semibold">Recent Orders</h3>
          </div>
          {recentOrders.length === 0 ? (
            <p className="text-gray-600 dark:text-gray-400 text-center py-8">
              No orders yet
            </p>
          ) : (
            <div className="space-y-3">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-3 rounded-md hover:bg-[var(--muted)]">
                  <div>
                    <p className="font-medium">{order.orderNumber}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {order.customer.name}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">${order.total.toFixed(2)}</p>
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

      {/* Daily Revenue Chart */}
      <div className="bg-[var(--background)] rounded-lg shadow-md p-6">
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="w-5 h-5 text-[var(--accent)]" />
          <h3 className="text-lg font-semibold">Daily Revenue</h3>
        </div>
        {dailyRevenue.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-400 text-center py-8">
            No revenue data yet
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--border)]">
                  <th className="text-left py-2 px-3">Date</th>
                  <th className="text-right py-2 px-3">Revenue</th>
                  <th className="text-right py-2 px-3">Orders</th>
                </tr>
              </thead>
              <tbody>
                {dailyRevenue.map((day) => (
                  <tr key={day.date} className="border-b border-[var(--border)] hover:bg-[var(--muted)]">
                    <td className="py-2 px-3">
                      {new Date(day.date).toLocaleDateString()}
                    </td>
                    <td className="text-right py-2 px-3 font-semibold">
                      ${Number(day.revenue).toFixed(2)}
                    </td>
                    <td className="text-right py-2 px-3">
                      {day.orders}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
