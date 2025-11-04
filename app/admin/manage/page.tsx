"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { List, Trash2, AlertCircle, CheckCircle2, RefreshCw, Edit, X, Plus, Minus } from "lucide-react";

interface Product {
  id: string;
  name: string;
  price: number;
  basePrice?: number;
  profitMargin?: number;
  image: string;
  images?: string[];
  category: string;
  rating: number;
  reviews: number;
  description: string;
  features: string[];
  inStock: boolean;
  stockQuantity?: number;
  sku?: string;
  aliexpressUrl?: string;
  aliexpressId?: string;
  keywords?: string[];
  metaDescription?: string;
}

const CATEGORIES = [
  "Jellies",
  "Foods",
  "Medicinal Tinctures",
  "Topical Items",
  "Teas",
  "Jewelry",
  "Pine Needle Crafts",
];

export default function ManageProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [editForm, setEditForm] = useState<Partial<Product>>({});
  const [updating, setUpdating] = useState(false);

  // Filter and sort state
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [stockFilter, setStockFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/products");
      const data = await response.json();
      setProducts(data || []);
    } catch (error) {
      setMessage({ type: "error", text: "Failed to load products" });
    } finally {
      setIsLoading(false);
    }
  };

  const openEditModal = (product: Product) => {
    setSelectedProduct(product);
    setEditForm({ ...product });
    setIsEditModalOpen(true);
  };

  const handleUpdateProduct = async () => {
    if (!selectedProduct) return;

    setUpdating(true);
    setMessage(null);

    try {
      const response = await fetch(`/api/admin/products/${selectedProduct.id}`, {
        credentials: "include",
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to update product");
      }

      setMessage({ type: "success", text: "Product updated successfully!" });
      setIsEditModalOpen(false);
      await fetchProducts();
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || "Failed to update product" });
    } finally {
      setUpdating(false);
    }
  };

  const handleFeatureChange = (index: number, value: string) => {
    const newFeatures = [...(editForm.features || [])];
    newFeatures[index] = value;
    setEditForm({ ...editForm, features: newFeatures });
  };

  const addFeature = () => {
    setEditForm({ ...editForm, features: [...(editForm.features || []), ""] });
  };

  const removeFeature = (index: number) => {
    const newFeatures = editForm.features?.filter((_, i) => i !== index);
    setEditForm({ ...editForm, features: newFeatures });
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Filter and sort products whenever filters or products change
  useEffect(() => {
    let result = [...products];

    // Search filter
    if (searchTerm) {
      result = result.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (categoryFilter !== "all") {
      result = result.filter(product => product.category === categoryFilter);
    }

    // Stock filter
    if (stockFilter === "in-stock") {
      result = result.filter(product => product.inStock);
    } else if (stockFilter === "out-of-stock") {
      result = result.filter(product => !product.inStock);
    }

    // Sorting
    switch (sortBy) {
      case "newest":
        // Already sorted by newest in API
        break;
      case "oldest":
        result.reverse();
        break;
      case "name-asc":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name-desc":
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case "price-asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result.sort((a, b) => b.price - a.price);
        break;
    }

    setFilteredProducts(result);
  }, [products, searchTerm, categoryFilter, stockFilter, sortBy]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product? This action cannot be undone.")) {
      return;
    }

    setDeletingId(id);
    setMessage(null);

    try {
      const response = await fetch(`/api/admin/products/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to delete product");
      }

      setMessage({ type: "success", text: "Product deleted successfully!" });
      // Remove the product from the list
      setProducts(products.filter((p) => p.id !== id));
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || "Failed to delete product" });
    } finally {
      setDeletingId(null);
    }
  };


  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <List className="w-8 h-8 text-[var(--accent)]" />
          <div>
            <h1 className="text-3xl font-bold">Manage Products</h1>
            <p className="text-gray-600 dark:text-gray-400">View, edit, and delete your product listings</p>
          </div>
        </div>
        <button
          onClick={fetchProducts}
          disabled={isLoading}
          className="flex items-center gap-2 px-4 py-2 bg-[var(--accent)] text-[var(--background)] rounded-md font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {/* Search and Filter Controls */}
      <div className="bg-[var(--background)] rounded-lg shadow-md p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium mb-2">Search Products</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Name, description, or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 rounded-md border border-[var(--border)] bg-transparent pl-10"
              />
              <List className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium mb-2">Category</label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-4 py-2 rounded-md border border-[var(--border)] bg-transparent"
            >
              <option value="all">All Categories</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Stock Filter */}
          <div>
            <label className="block text-sm font-medium mb-2">Stock Status</label>
            <select
              value={stockFilter}
              onChange={(e) => setStockFilter(e.target.value)}
              className="w-full px-4 py-2 rounded-md border border-[var(--border)] bg-transparent"
            >
              <option value="all">All Products</option>
              <option value="in-stock">In Stock</option>
              <option value="out-of-stock">Out of Stock</option>
            </select>
          </div>

          {/* Sort By */}
          <div>
            <label className="block text-sm font-medium mb-2">Sort By</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-4 py-2 rounded-md border border-[var(--border)] bg-transparent"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="name-asc">Name (A-Z)</option>
              <option value="name-desc">Name (Z-A)</option>
              <option value="price-asc">Price (Low to High)</option>
              <option value="price-desc">Price (High to Low)</option>
            </select>
          </div>
        </div>
      </div>

      {message && (
        <div
          className={`p-4 rounded-lg border flex items-start gap-3 ${
            message.type === "success"
              ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-800 dark:text-green-200"
              : "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200"
          }`}
        >
          {message.type === "success" ? (
            <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          )}
          <span className="text-sm">{message.text}</span>
        </div>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-[var(--accent)]" />
            <p className="text-gray-600 dark:text-gray-400">Loading products...</p>
          </div>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-12 bg-[var(--background)] rounded-lg shadow-md">
          <List className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h3 className="text-xl font-semibold mb-2">
            {products.length === 0 ? "No products yet" : "No products match your filters"}
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            {products.length === 0
              ? "Start by adding your first product!"
              : "Try adjusting your search or filter criteria"}
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-[var(--background)] rounded-lg shadow-md p-4 flex items-center gap-4"
            >
              <Image
                src={product.image || "https://via.placeholder.com/100?text=No+Image"}
                alt={product.name}
                width={96}
                height={96}
                className="w-24 h-24 object-cover rounded-md"
              />

              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-lg truncate">{product.name}</h3>
                <div className="flex items-center gap-4 mt-1 text-sm text-gray-600 dark:text-gray-400">
                  <span className="font-medium text-green-600">${product.price}</span>
                  <span>{product.category}</span>
                  <span>{product.rating} ⭐ ({product.reviews})</span>
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      product.inStock
                        ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200"
                        : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200"
                    }`}
                  >
                    {product.inStock ? "In Stock" : "Out of Stock"}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">ID: {product.id}</p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => openEditModal(product)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-colors"
                >
                  <Edit className="w-4 h-4" />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(product.id)}
                  disabled={deletingId === product.id}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-md font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Trash2 className="w-4 h-4" />
                  {deletingId === product.id ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Product Modal */}
      {isEditModalOpen && selectedProduct && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-[var(--background)] rounded-lg max-w-4xl w-full my-8">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Edit Product</h2>
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  className="p-2 rounded-md hover:bg-[var(--muted)]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
                {/* Product Name */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    value={editForm.name || ""}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="w-full px-4 py-2 rounded-md border border-[var(--border)] bg-transparent"
                    required
                  />
                </div>

                {/* Pricing */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Base Price (AliExpress)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={editForm.basePrice || ""}
                      onChange={(e) => setEditForm({ ...editForm, basePrice: parseFloat(e.target.value) })}
                      className="w-full px-4 py-2 rounded-md border border-[var(--border)] bg-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Profit Margin (%)
                    </label>
                    <input
                      type="number"
                      step="1"
                      value={editForm.profitMargin || ""}
                      onChange={(e) => setEditForm({ ...editForm, profitMargin: parseFloat(e.target.value) })}
                      className="w-full px-4 py-2 rounded-md border border-[var(--border)] bg-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Final Price * ($)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={editForm.price || ""}
                      onChange={(e) => setEditForm({ ...editForm, price: parseFloat(e.target.value) })}
                      className="w-full px-4 py-2 rounded-md border border-[var(--border)] bg-transparent"
                      required
                    />
                  </div>
                </div>

                {/* Image URL */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Main Image URL *
                  </label>
                  <input
                    type="url"
                    value={editForm.image || ""}
                    onChange={(e) => setEditForm({ ...editForm, image: e.target.value })}
                    className="w-full px-4 py-2 rounded-md border border-[var(--border)] bg-transparent"
                    required
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Category *
                  </label>
                  <select
                    value={editForm.category || ""}
                    onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                    className="w-full px-4 py-2 rounded-md border border-[var(--border)] bg-transparent"
                    required
                  >
                    <option value="">Select a category</option>
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Product Description *
                  </label>
                  <textarea
                    value={editForm.description || ""}
                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-2 rounded-md border border-[var(--border)] bg-transparent"
                    required
                  />
                </div>

                {/* Features */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Product Features *
                  </label>
                  <div className="space-y-2">
                    {(editForm.features || []).map((feature, index) => (
                      <div key={index} className="flex gap-2">
                        <input
                          type="text"
                          value={feature}
                          onChange={(e) => handleFeatureChange(index, e.target.value)}
                          placeholder={`Feature ${index + 1}`}
                          className="flex-1 px-4 py-2 rounded-md border border-[var(--border)] bg-transparent"
                        />
                        <button
                          onClick={() => removeFeature(index)}
                          className="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={addFeature}
                      className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                    >
                      <Plus className="w-4 h-4" />
                      Add Feature
                    </button>
                  </div>
                </div>

                {/* Stock & Rating */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Stock Quantity
                    </label>
                    <input
                      type="number"
                      value={editForm.stockQuantity || ""}
                      onChange={(e) => setEditForm({ ...editForm, stockQuantity: parseInt(e.target.value) })}
                      className="w-full px-4 py-2 rounded-md border border-[var(--border)] bg-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Rating (0-5)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="5"
                      value={editForm.rating || ""}
                      onChange={(e) => setEditForm({ ...editForm, rating: parseFloat(e.target.value) })}
                      className="w-full px-4 py-2 rounded-md border border-[var(--border)] bg-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Number of Reviews
                    </label>
                    <input
                      type="number"
                      value={editForm.reviews || ""}
                      onChange={(e) => setEditForm({ ...editForm, reviews: parseInt(e.target.value) })}
                      className="w-full px-4 py-2 rounded-md border border-[var(--border)] bg-transparent"
                    />
                  </div>
                </div>

                {/* AliExpress Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      AliExpress Product ID
                    </label>
                    <input
                      type="text"
                      value={editForm.aliexpressId || ""}
                      onChange={(e) => setEditForm({ ...editForm, aliexpressId: e.target.value })}
                      className="w-full px-4 py-2 rounded-md border border-[var(--border)] bg-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      AliExpress Product URL
                    </label>
                    <input
                      type="url"
                      value={editForm.aliexpressUrl || ""}
                      onChange={(e) => setEditForm({ ...editForm, aliexpressUrl: e.target.value })}
                      className="w-full px-4 py-2 rounded-md border border-[var(--border)] bg-transparent"
                    />
                  </div>
                </div>

                {/* In Stock Toggle */}
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="inStock"
                    checked={editForm.inStock || false}
                    onChange={(e) => setEditForm({ ...editForm, inStock: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <label htmlFor="inStock" className="text-sm font-medium">
                    Product is in stock
                  </label>
                </div>
              </div>

              <div className="flex gap-3 mt-6 pt-6 border-t border-[var(--border)]">
                <button
                  onClick={handleUpdateProduct}
                  disabled={updating}
                  className="flex-1 bg-[var(--accent)] text-[var(--background)] py-3 rounded-md font-medium hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {updating ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    "Update Product"
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

      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <p className="text-sm text-blue-800 dark:text-blue-200">
          <strong>Showing:</strong> {filteredProducts.length} of {products.length} products
        </p>
      </div>
    </div>
  );
}
