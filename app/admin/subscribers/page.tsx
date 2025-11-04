"use client";

import { useState, useEffect, useCallback } from "react";
import { Mail, Search, Users, CheckCircle2, XCircle, Download } from "lucide-react";

interface Subscriber {
  id: string;
  email: string;
  name: string;
  source: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface SubscriberData {
  subscribers: Subscriber[];
  summary: {
    total: number;
    active: number;
    inactive: number;
  };
}

interface ErrorState {
  message: string;
  details?: string;
}

export default function SubscribersPage() {
  const [data, setData] = useState<SubscriberData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ErrorState | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const fetchSubscribers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const params = new URLSearchParams();
      if (searchTerm) params.append("search", searchTerm);
      if (statusFilter !== "all") params.append("status", statusFilter);

      const response = await fetch(`/api/admin/subscribers?${params}`, {
        credentials: "include",
      });
      const result = await response.json();

      if (response.ok && result.data) {
        setData({
          subscribers: result.data,
          summary: result.summary,
        });
        setError(null);
      } else {
        console.error("Error fetching subscribers:", result.error || "Unknown error");
        setData(null);
        setError({
          message: result.error || "Failed to fetch subscribers",
          details: result.details,
        });
      }
    } catch (err: any) {
      console.error("Error fetching subscribers:", err);
      setData(null);
      setError({
        message: "Failed to fetch subscribers",
        details: err.message,
      });
    } finally {
      setLoading(false);
    }
  }, [searchTerm, statusFilter]);

  useEffect(() => {
    fetchSubscribers();
  }, [fetchSubscribers]);

  const exportToCSV = () => {
    if (!data || !data.subscribers || !data.subscribers.length) return;

    const headers = ["Name", "Email", "Source", "Status", "Subscribed Date"];
    const rows = data.subscribers.map((sub) => [
      sub.name,
      sub.email,
      sub.source || "N/A",
      sub.isActive ? "Active" : "Inactive",
      new Date(sub.createdAt).toLocaleDateString(),
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `subscribers-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading && !data) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <p>Loading subscribers...</p>
        </div>
      </div>
    );
  }

  if (!loading && !data && error) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center max-w-md">
          <p className="text-red-600 mb-2 font-semibold">{error.message}</p>
          {error.details && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              {error.details}
            </p>
          )}
          <button
            onClick={fetchSubscribers}
            className="px-4 py-2 bg-[var(--accent)] text-[var(--background)] rounded-md"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Email Subscribers</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Manage your VIP list and newsletter subscribers
          </p>
        </div>

        <button
          onClick={exportToCSV}
          disabled={!data || !data.subscribers || data.subscribers.length === 0}
          className="flex items-center gap-2 px-4 py-2 bg-[var(--accent)] text-[var(--background)] rounded-md font-medium hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Download className="w-4 h-4" />
          Export CSV
        </button>
      </div>

      {/* Summary Cards */}
      {data && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-[var(--background)] rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">Total Subscribers</span>
              <Users className="w-5 h-5 text-blue-500" />
            </div>
            <p className="text-2xl font-bold">{data.summary.total}</p>
          </div>

          <div className="bg-[var(--background)] rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">Active</span>
              <CheckCircle2 className="w-5 h-5 text-green-500" />
            </div>
            <p className="text-2xl font-bold">{data.summary.active}</p>
          </div>

          <div className="bg-[var(--background)] rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">Inactive</span>
              <XCircle className="w-5 h-5 text-red-500" />
            </div>
            <p className="text-2xl font-bold">{data.summary.inactive}</p>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-[var(--background)] rounded-lg shadow-md p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-md border border-[var(--border)] bg-transparent"
              />
            </div>
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 rounded-md border border-[var(--border)] bg-transparent"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Subscribers Table */}
      <div className="bg-[var(--background)] rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[var(--muted)] border-b border-[var(--border)]">
              <tr>
                <th className="text-left py-3 px-4 font-semibold">Name</th>
                <th className="text-left py-3 px-4 font-semibold">Email</th>
                <th className="text-left py-3 px-4 font-semibold">Source</th>
                <th className="text-left py-3 px-4 font-semibold">Status</th>
                <th className="text-left py-3 px-4 font-semibold">Subscribed</th>
              </tr>
            </thead>
            <tbody>
              {data && data.subscribers.length > 0 ? (
                data.subscribers.map((subscriber) => (
                  <tr
                    key={subscriber.id}
                    className="border-b border-[var(--border)] hover:bg-[var(--muted)]"
                  >
                    <td className="py-3 px-4">{subscriber.name}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-gray-400" />
                        {subscriber.email}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-xs px-2 py-1 rounded bg-gray-100 dark:bg-gray-800">
                        {subscriber.source || "N/A"}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {subscriber.isActive ? (
                        <span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200">
                          <CheckCircle2 className="w-3 h-3" />
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200">
                          <XCircle className="w-3 h-3" />
                          Inactive
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">
                      {new Date(subscriber.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-gray-600 dark:text-gray-400">
                    No subscribers found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
