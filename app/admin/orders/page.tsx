"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Package,
  Search,
  Filter,
  ExternalLink,
  Edit,
  Check,
  X,
  Loader2,
} from "lucide-react";

interface OrderItem {
  id: string;
  productName: string;
  productImage: string;
  quantity: number;
  price: number;
  product: {
    id: string;
    name: string;
    aliexpressUrl?: string;
  };
}

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  total: number;
  shippingName: string;
  shippingEmail: string;
  shippingAddress: string;
  shippingCity: string;
  shippingState: string;
  shippingZip: string;
  shippingCountry: string;
  trackingNumber?: string;
  trackingUrl?: string;
  aliexpressOrderId?: string;
  aliexpressOrderUrl?: string;
  adminNotes?: string;
  createdAt: string;
  orderItems: OrderItem[];
}

const ORDER_STATUSES = [
  { value: "PENDING", label: "Pending", color: "bg-gray-500" },
  { value: "PAID", label: "Paid", color: "bg-blue-500" },
  { value: "PROCESSING", label: "Processing", color: "bg-yellow-500" },
  { value: "ORDERED_SUPPLIER", label: "Ordered from AliExpress", color: "bg-purple-500" },
  { value: "SHIPPED", label: "Shipped", color: "bg-green-500" },
  { value: "DELIVERED", label: "Delivered", color: "bg-green-700" },
  { value: "CANCELLED", label: "Cancelled", color: "bg-red-500" },
  { value: "REFUNDED", label: "Refunded", color: "bg-red-700" },
];

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    status: "",
    trackingNumber: "",
    trackingUrl: "",
    aliexpressOrderId: "",
    aliexpressOrderUrl: "",
    adminNotes: "",
  });
  const [updating, setUpdating] = useState(false);

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (statusFilter !== "all") params.append("status", statusFilter);
      if (searchTerm) params.append("search", searchTerm);

      const response = await fetch(`/api/admin/orders-test?${params}`);
      const data = await response.json();
      setOrders(data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  }, [statusFilter, searchTerm]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const openEditModal = (order: Order) => {
    setSelectedOrder(order);
    setEditForm({
      status: order.status,
      trackingNumber: order.trackingNumber || "",
      trackingUrl: order.trackingUrl || "",
      aliexpressOrderId: order.aliexpressOrderId || "",
      aliexpressOrderUrl: order.aliexpressOrderUrl || "",
      adminNotes: order.adminNotes || "",
    });
    setIsEditModalOpen(true);
  };

  const handleUpdateOrder = async () => {
    if (!selectedOrder) return;

    try {
      setUpdating(true);
      const response = await fetch(`/api/admin/orders/${selectedOrder.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });

      if (response.ok) {
        await fetchOrders();
        setIsEditModalOpen(false);
        setSelectedOrder(null);
      } else {
        alert("Failed to update order");
      }
    } catch (error) {
      console.error("Error updating order:", error);
      alert("Failed to update order");
    } finally {
      setUpdating(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = ORDER_STATUSES.find(s => s.value === status);
    return (
      <span className={`px-2 py-1 rounded-full text-xs text-white ${statusConfig?.color || 'bg-gray-500'}`}>
        {statusConfig?.label || status}
      </span>
    );
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Order Management</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Manage and fulfill customer orders
        </p>
      </div>

      {/* Filters */}
      <div className="bg-[var(--background)] rounded-lg shadow-sm p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium mb-2">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Order number, email, or name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-md border border-[var(--border)] bg-transparent"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium mb-2">Filter by Status</label>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-md border border-[var(--border)] bg-transparent"
              >
                <option value="all">All Orders</option>
                {ORDER_STATUSES.map(status => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Orders List */}
      {loading ? (
        <div className="text-center py-12">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p>Loading orders...</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-[var(--background)] rounded-lg shadow-sm p-12 text-center">
          <Package className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h3 className="text-xl font-semibold mb-2">No orders found</h3>
          <p className="text-gray-600 dark:text-gray-400">
            {searchTerm || statusFilter !== "all"
              ? "Try adjusting your filters"
              : "Orders will appear here when customers make purchases"}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-[var(--background)] rounded-lg shadow-sm p-6"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold mb-1">
                    {order.orderNumber}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {new Date(order.createdAt).toLocaleString()}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  {getStatusBadge(order.status)}
                  <button
                    onClick={() => openEditModal(order)}
                    className="p-2 rounded-md hover:bg-[var(--muted)] transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Customer</p>
                  <p className="font-medium">{order.shippingName}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {order.shippingEmail}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Shipping Address</p>
                  <p className="text-sm">
                    {order.shippingAddress}<br />
                    {order.shippingCity}, {order.shippingState} {order.shippingZip}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total</p>
                  <p className="text-xl font-bold">${order.total.toFixed(2)}</p>
                </div>
              </div>

              {/* Order Items */}
              <div className="border-t border-[var(--border)] pt-4">
                <p className="text-sm font-medium mb-2">Items ({order.orderItems.length})</p>
                <div className="space-y-2">
                  {order.orderItems.map((item) => (
                    <div key={item.id} className="flex justify-between items-center text-sm">
                      <div className="flex items-center gap-2">
                        <span>{item.productName}</span>
                        {item.product.aliexpressUrl && (
                          <a
                            href={item.product.aliexpressUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 hover:text-blue-600"
                          >
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                      <span>
                        {item.quantity} × ${item.price.toFixed(2)} = ${(item.quantity * item.price).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tracking Info */}
              {order.trackingNumber && (
                <div className="border-t border-[var(--border)] pt-4 mt-4">
                  <p className="text-sm font-medium mb-1">Tracking Number</p>
                  <div className="flex items-center gap-2">
                    <code className="text-sm bg-[var(--muted)] px-2 py-1 rounded">
                      {order.trackingNumber}
                    </code>
                    {order.trackingUrl && (
                      <a
                        href={order.trackingUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:text-blue-600 text-sm flex items-center gap-1"
                      >
                        Track Package <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Edit Order Modal */}
      {isEditModalOpen && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-[var(--background)] rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">
                  Update Order {selectedOrder.orderNumber}
                </h2>
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  className="p-2 rounded-md hover:bg-[var(--muted)]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                {/* Status */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Order Status
                  </label>
                  <select
                    value={editForm.status}
                    onChange={(e) =>
                      setEditForm({ ...editForm, status: e.target.value })
                    }
                    className="w-full px-4 py-2 rounded-md border border-[var(--border)] bg-transparent"
                  >
                    {ORDER_STATUSES.map((status) => (
                      <option key={status.value} value={status.value}>
                        {status.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Tracking Number */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Tracking Number
                  </label>
                  <input
                    type="text"
                    value={editForm.trackingNumber}
                    onChange={(e) =>
                      setEditForm({ ...editForm, trackingNumber: e.target.value })
                    }
                    placeholder="1Z999AA10123456784"
                    className="w-full px-4 py-2 rounded-md border border-[var(--border)] bg-transparent"
                  />
                </div>

                {/* Tracking URL */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Tracking URL
                  </label>
                  <input
                    type="url"
                    value={editForm.trackingUrl}
                    onChange={(e) =>
                      setEditForm({ ...editForm, trackingUrl: e.target.value })
                    }
                    placeholder="https://tools.usps.com/go/TrackConfirmAction?tLabels=..."
                    className="w-full px-4 py-2 rounded-md border border-[var(--border)] bg-transparent"
                  />
                </div>

                {/* AliExpress Order ID */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    AliExpress Order ID
                  </label>
                  <input
                    type="text"
                    value={editForm.aliexpressOrderId}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        aliexpressOrderId: e.target.value,
                      })
                    }
                    placeholder="8012345678901234"
                    className="w-full px-4 py-2 rounded-md border border-[var(--border)] bg-transparent"
                  />
                </div>

                {/* AliExpress Order URL */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    AliExpress Order URL
                  </label>
                  <input
                    type="url"
                    value={editForm.aliexpressOrderUrl}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        aliexpressOrderUrl: e.target.value,
                      })
                    }
                    placeholder="https://www.aliexpress.com/p/order/detail.html?orderId=..."
                    className="w-full px-4 py-2 rounded-md border border-[var(--border)] bg-transparent"
                  />
                </div>

                {/* Admin Notes */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Internal Notes
                  </label>
                  <textarea
                    value={editForm.adminNotes}
                    onChange={(e) =>
                      setEditForm({ ...editForm, adminNotes: e.target.value })
                    }
                    rows={4}
                    placeholder="Internal notes about this order..."
                    className="w-full px-4 py-2 rounded-md border border-[var(--border)] bg-transparent"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleUpdateOrder}
                  disabled={updating}
                  className="flex-1 bg-[var(--accent)] text-[var(--background)] py-3 rounded-md font-medium hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {updating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      Update Order
                    </>
                  )}
                </button>
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  disabled={updating}
                  className="px-6 py-3 rounded-md border border-[var(--border)] hover:bg-[var(--muted)] transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
