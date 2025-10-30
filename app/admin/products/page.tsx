"use client";

import { useState } from "react";
import Image from "next/image";
import { Package, Plus, AlertCircle, CheckCircle2, DollarSign, X, Sparkles, Copy } from "lucide-react";

interface ProductFormData {
  name: string;
  basePrice: string;
  profitMargin: string;
  finalPrice: string;
  image: string;
  category: string;
  rating: string;
  reviews: string;
  description: string;
  features: string[];
  inStock: boolean;
}

interface AliExpressData {
  title: string;
  description: string;
  features: string;
}

interface OptimizedData {
  keywords: string[];
  title: string;
  description: string;
  features: string[];
}

export default function AdminProductsPage() {
  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    basePrice: "",
    profitMargin: "40",
    finalPrice: "",
    image: "",
    category: "Electronics & Gadgets",
    rating: "4.5",
    reviews: "0",
    description: "",
    features: [""],
    inStock: true,
  });

  const [aliExpressData, setAliExpressData] = useState<AliExpressData>({
    title: "",
    description: "",
    features: "",
  });

  const [optimizedData, setOptimizedData] = useState<OptimizedData | null>(null);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [addedProduct, setAddedProduct] = useState<any | null>(null);

  const categories = [
    "Electronics & Gadgets",
    "Sports & Fitness",
    "Home & Kitchen",
    "Home & Garden",
    "Health & Wellness",
    "Jewelry & Accessories",
    "Digital Products",
  ];

  // Calculate final price whenever base price or profit margin changes
  const calculateFinalPrice = (base: string, margin: string) => {
    const basePrice = parseFloat(base) || 0;
    const profitPercent = parseFloat(margin) || 0;
    const finalPrice = basePrice * (1 + profitPercent / 100);
    return finalPrice.toFixed(2);
  };

  const handleBasePriceChange = (value: string) => {
    setFormData((prev) => {
      const finalPrice = calculateFinalPrice(value, prev.profitMargin);
      return { ...prev, basePrice: value, finalPrice };
    });
  };

  const handleProfitMarginChange = (value: string) => {
    setFormData((prev) => {
      const finalPrice = calculateFinalPrice(prev.basePrice, value);
      return { ...prev, profitMargin: value, finalPrice };
    });
  };

  const handleFeatureChange = (index: number, value: string) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = value;
    setFormData({ ...formData, features: newFeatures });
  };

  const addFeature = () => {
    setFormData({ ...formData, features: [...formData.features, ""] });
  };

  const removeFeature = (index: number) => {
    const newFeatures = formData.features.filter((_, i) => i !== index);
    setFormData({ ...formData, features: newFeatures });
  };

  const handleOptimize = async () => {
    if (!aliExpressData.title) {
      setMessage({ type: "error", text: "Please enter at least a product title to optimize" });
      return;
    }

    setIsOptimizing(true);
    setMessage(null);

    try {
      const featuresList = aliExpressData.features
        .split("\n")
        .filter((f) => f.trim().length > 0);

      const response = await fetch("/api/admin/optimize-seo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: aliExpressData.title,
          description: aliExpressData.description,
          features: featuresList,
          category: formData.category,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to optimize product data");
      }

      setOptimizedData(result.data);
      setMessage({ type: "success", text: "SEO optimization complete! Review and apply suggestions below." });
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || "Failed to optimize product data" });
    } finally {
      setIsOptimizing(false);
    }
  };

  const applyOptimizedData = () => {
    if (!optimizedData) return;

    setFormData({
      ...formData,
      name: optimizedData.title,
      description: optimizedData.description,
      features: optimizedData.features,
    });

    setMessage({ type: "success", text: "Optimized data applied to form! Adjust as needed and submit." });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setIsLoading(true);

    // Validate required fields
    if (!formData.name || !formData.finalPrice || !formData.image || !formData.description) {
      setMessage({
        type: "error",
        text: "Please fill in all required fields: Product Name, Image URL, Description, and Price",
      });
      setIsLoading(false);
      return;
    }

    // Filter out empty features
    const validFeatures = formData.features.filter((f) => f.trim().length > 0);

    if (validFeatures.length === 0) {
      setMessage({
        type: "error",
        text: "Please add at least one product feature",
      });
      setIsLoading(false);
      return;
    }

    try {
      const productData = {
        name: formData.name,
        price: parseFloat(formData.finalPrice),
        image: formData.image,
        category: formData.category,
        rating: parseFloat(formData.rating),
        reviews: parseInt(formData.reviews),
        description: formData.description,
        features: validFeatures,
        inStock: formData.inStock,
      };

      const response = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to add product");
      }

      setMessage({ type: "success", text: "Product added successfully!" });
      setAddedProduct(result.product);

      // Reset form
      setFormData({
        name: "",
        basePrice: "",
        profitMargin: "40",
        finalPrice: "",
        image: "",
        category: "Electronics & Gadgets",
        rating: "4.5",
        reviews: "0",
        description: "",
        features: [""],
        inStock: true,
      });
      setAliExpressData({ title: "", description: "", features: "" });
      setOptimizedData(null);
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || "Failed to add product" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Package className="w-8 h-8 text-[var(--accent)]" />
          <div>
            <h1 className="text-3xl font-bold">Add New Product</h1>
            <p className="text-gray-600 dark:text-gray-400">AI-powered SEO optimization + manual creation</p>
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

      {/* AI SEO Optimizer */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg shadow-md p-6 border border-purple-200 dark:border-purple-800">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-6 h-6 text-purple-600" />
          <h2 className="text-xl font-bold text-purple-900 dark:text-purple-100">AI SEO Optimizer</h2>
          <span className="ml-2 px-2 py-1 bg-purple-600 text-white text-xs font-semibold rounded">BETA</span>
        </div>

        <p className="text-sm text-purple-800 dark:text-purple-200 mb-4">
          Paste your AliExpress product data and let AI generate viral longtail keywords, SEO-optimized titles, and conversion-focused descriptions!
        </p>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">AliExpress Title</label>
            <input
              type="text"
              value={aliExpressData.title}
              onChange={(e) => setAliExpressData({ ...aliExpressData, title: e.target.value })}
              placeholder="e.g., TWS Wireless Bluetooth Earphones 5.0 Stereo Bass..."
              className="w-full px-4 py-3 rounded-md border border-purple-300 dark:border-purple-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">AliExpress Description (optional)</label>
            <textarea
              value={aliExpressData.description}
              onChange={(e) => setAliExpressData({ ...aliExpressData, description: e.target.value })}
              placeholder="Paste the product description from AliExpress..."
              rows={3}
              className="w-full px-4 py-3 rounded-md border border-purple-300 dark:border-purple-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">AliExpress Features (optional, one per line)</label>
            <textarea
              value={aliExpressData.features}
              onChange={(e) => setAliExpressData({ ...aliExpressData, features: e.target.value })}
              placeholder="Bluetooth 5.0&#10;Battery: 2000mAh&#10;IPX7 Waterproof"
              rows={4}
              className="w-full px-4 py-3 rounded-md border border-purple-300 dark:border-purple-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <button
            type="button"
            onClick={handleOptimize}
            disabled={isOptimizing || !aliExpressData.title}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-md font-medium hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Sparkles className="w-5 h-5" />
            {isOptimizing ? "Optimizing with AI..." : "Generate SEO-Optimized Content"}
          </button>
        </div>

        {/* Optimized Results */}
        {optimizedData && (
          <div className="mt-6 p-4 bg-white dark:bg-gray-800 rounded-lg border border-purple-300 dark:border-purple-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-lg">✨ AI-Generated Results</h3>
              <button
                type="button"
                onClick={applyOptimizedData}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-md text-sm font-medium hover:bg-purple-700 transition-colors"
              >
                <Copy className="w-4 h-4" />
                Apply to Form
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <span className="text-xs font-semibold text-purple-600 uppercase">Longtail Keywords</span>
                <div className="mt-1 flex flex-wrap gap-2">
                  {optimizedData.keywords.map((keyword, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200 text-xs rounded-full"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-xs font-semibold text-purple-600 uppercase">Optimized Title</span>
                <p className="mt-1 text-sm font-medium">{optimizedData.title}</p>
              </div>

              <div>
                <span className="text-xs font-semibold text-purple-600 uppercase">Optimized Description</span>
                <p className="mt-1 text-sm">{optimizedData.description}</p>
              </div>

              <div>
                <span className="text-xs font-semibold text-purple-600 uppercase">Optimized Features</span>
                <ul className="mt-1 space-y-1">
                  {optimizedData.features.map((feature, idx) => (
                    <li key={idx} className="text-sm flex items-start gap-2">
                      <span className="text-purple-600">•</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Product Form */}
      <form onSubmit={handleSubmit} className="bg-[var(--background)] rounded-lg shadow-md p-6">
        <div className="space-y-6">
          {/* Product Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-2">
              Product Name <span className="text-red-500">*</span>
            </label>
            <input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Wireless Bluetooth Earbuds"
              className="w-full px-4 py-3 rounded-md border border-[var(--border)] bg-transparent focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
              required
            />
          </div>

          {/* Pricing Section with Profit Calculator */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-4">
              <DollarSign className="w-5 h-5 text-blue-600" />
              <h3 className="font-semibold text-blue-900 dark:text-blue-100">Pricing & Profit Calculator</h3>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="basePrice" className="block text-sm font-medium mb-2">
                  Base Price (AliExpress) <span className="text-red-500">*</span>
                </label>
                <input
                  id="basePrice"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.basePrice}
                  onChange={(e) => handleBasePriceChange(e.target.value)}
                  placeholder="0.00"
                  className="w-full px-4 py-3 rounded-md border border-[var(--border)] bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                  required
                />
              </div>

              <div>
                <label htmlFor="profitMargin" className="block text-sm font-medium mb-2">
                  Profit Margin (%)
                </label>
                <input
                  id="profitMargin"
                  type="number"
                  step="1"
                  min="0"
                  max="500"
                  value={formData.profitMargin}
                  onChange={(e) => handleProfitMarginChange(e.target.value)}
                  className="w-full px-4 py-3 rounded-md border border-[var(--border)] bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                />
              </div>

              <div>
                <label htmlFor="finalPrice" className="block text-sm font-medium mb-2">
                  Final Flanagan Price
                </label>
                <input
                  id="finalPrice"
                  type="text"
                  value={`$${formData.finalPrice || "0.00"}`}
                  readOnly
                  className="w-full px-4 py-3 rounded-md border border-green-300 bg-green-50 dark:bg-green-900/30 dark:border-green-700 font-bold text-green-700 dark:text-green-300"
                />
              </div>
            </div>
          </div>

          {/* Image URL */}
          <div>
            <label htmlFor="image" className="block text-sm font-medium mb-2">
              Product Image URL <span className="text-red-500">*</span>
            </label>
            <input
              id="image"
              type="url"
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              placeholder="https://ae01.alicdn.com/kf/..."
              className="w-full px-4 py-3 rounded-md border border-[var(--border)] bg-transparent focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
              required
            />
            {formData.image && (
              <div className="mt-3">
                <Image
                  src={formData.image}
                  alt="Preview"
                  width={128}
                  height={128}
                  className="w-32 h-32 object-cover rounded-md border border-[var(--border)]"
                />
              </div>
            )}
          </div>

          {/* Category */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium mb-2">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              id="category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-3 rounded-md border border-[var(--border)] bg-transparent focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
              required
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium mb-2">
              Product Description <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe the product features, benefits, and what makes it special..."
              rows={4}
              className="w-full px-4 py-3 rounded-md border border-[var(--border)] bg-transparent focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
              required
            />
          </div>

          {/* Features */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Product Features <span className="text-red-500">*</span>
            </label>
            <div className="space-y-3">
              {formData.features.map((feature, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={feature}
                    onChange={(e) => handleFeatureChange(index, e.target.value)}
                    placeholder={`Feature ${index + 1}`}
                    className="flex-1 px-4 py-3 rounded-md border border-[var(--border)] bg-transparent focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                  />
                  {formData.features.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeFeature(index)}
                      className="px-3 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addFeature}
                className="flex items-center gap-2 px-4 py-2 text-sm text-[var(--accent)] hover:bg-[var(--muted)] rounded-md transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Feature
              </button>
            </div>
          </div>

          {/* Rating and Reviews */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="rating" className="block text-sm font-medium mb-2">
                Rating (0-5)
              </label>
              <input
                id="rating"
                type="number"
                step="0.1"
                min="0"
                max="5"
                value={formData.rating}
                onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                className="w-full px-4 py-3 rounded-md border border-[var(--border)] bg-transparent focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
              />
            </div>

            <div>
              <label htmlFor="reviews" className="block text-sm font-medium mb-2">
                Number of Reviews
              </label>
              <input
                id="reviews"
                type="number"
                min="0"
                value={formData.reviews}
                onChange={(e) => setFormData({ ...formData, reviews: e.target.value })}
                className="w-full px-4 py-3 rounded-md border border-[var(--border)] bg-transparent focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
              />
            </div>
          </div>

          {/* In Stock */}
          <div className="flex items-center gap-3">
            <input
              id="inStock"
              type="checkbox"
              checked={formData.inStock}
              onChange={(e) => setFormData({ ...formData, inStock: e.target.checked })}
              className="w-5 h-5 rounded border-[var(--border)] text-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]"
            />
            <label htmlFor="inStock" className="text-sm font-medium">
              Product is in stock
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-[var(--accent)] text-[var(--background)] rounded-md font-medium text-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="w-5 h-5" />
            {isLoading ? "Adding Product..." : "Add Product to Store"}
          </button>
        </div>
      </form>

      {/* Success Preview */}
      {addedProduct && (
        <div className="bg-[var(--background)] rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <CheckCircle2 className="w-6 h-6 text-green-600" />
            Product Added Successfully
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            {addedProduct.image && (
              <div className="relative w-full h-64">
                <Image
                  src={addedProduct.image}
                  alt={addedProduct.name}
                  fill
                  className="object-cover rounded-lg"
                />
              </div>
            )}

            <div className="space-y-3">
              <div>
                <span className="text-sm text-gray-500 dark:text-gray-400">ID</span>
                <p className="font-medium">{addedProduct.id}</p>
              </div>
              <div>
                <span className="text-sm text-gray-500 dark:text-gray-400">Name</span>
                <p className="font-medium">{addedProduct.name}</p>
              </div>
              <div>
                <span className="text-sm text-gray-500 dark:text-gray-400">Price</span>
                <p className="font-medium text-green-600">${addedProduct.price}</p>
              </div>
              <div>
                <span className="text-sm text-gray-500 dark:text-gray-400">Category</span>
                <p className="font-medium">{addedProduct.category}</p>
              </div>
              <div>
                <span className="text-sm text-gray-500 dark:text-gray-400">Rating</span>
                <p className="font-medium">{addedProduct.rating} ⭐ ({addedProduct.reviews} reviews)</p>
              </div>
            </div>
          </div>

          {addedProduct.features && addedProduct.features.length > 0 && (
            <div className="mt-4">
              <span className="text-sm text-gray-500 dark:text-gray-400">Features</span>
              <ul className="mt-2 list-disc list-inside space-y-1">
                {addedProduct.features.map((feature: string, idx: number) => (
                  <li key={idx} className="text-sm">
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
