"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Package, Plus, AlertCircle, CheckCircle2, DollarSign, X, Sparkles, Copy, Upload, Loader, Folder, Search } from "lucide-react";

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
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [addedProduct, setAddedProduct] = useState<any | null>(null);
  const [showImageBrowser, setShowImageBrowser] = useState(false);
  const [publicImages, setPublicImages] = useState<any[]>([]);
  const [loadingImages, setLoadingImages] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

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
        credentials: "include",
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

  const loadPublicImages = async () => {
    setLoadingImages(true);
    try {
      const response = await fetch("/api/admin/list-images", {
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to load images");
      }

      const data = await response.json();
      setPublicImages(data.images || []);
    } catch (err: any) {
      setMessage({ type: "error", text: "Failed to load images from public folder" });
    } finally {
      setLoadingImages(false);
    }
  };

  const handleSelectImage = (imageUrl: string) => {
    setFormData({ ...formData, image: imageUrl });
    setShowImageBrowser(false);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file
    if (!file.type.startsWith("image/")) {
      setMessage({ type: "error", text: "File must be an image (PNG, JPG, GIF, etc.)" });
      return;
    }

    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
    if (file.size > MAX_FILE_SIZE) {
      setMessage({ type: "error", text: "File size must be less than 10MB" });
      return;
    }

    setIsUploading(true);
    setMessage(null);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("file", file);

      // Upload to private storage
      const response = await fetch("/api/admin/private-upload", {
        method: "POST",
        credentials: "include",
        body: formDataToSend,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to upload image");
      }

      setFormData({
        ...formData,
        image: result.url,
      });

      setMessage({
        type: "success",
        text: `Image uploaded successfully! (${(file.size / 1024 / 1024).toFixed(2)}MB)`
      });
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || "Failed to upload image" });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
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
        credentials: "include",
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

          {/* Image Hosting Section */}
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-lg p-6 border border-blue-200 dark:border-blue-800">
            <div className="flex items-center gap-2 mb-4">
              <Upload className="w-6 h-6 text-blue-600" />
              <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100">Private Product Image Hosting</h3>
            </div>

            <p className="text-sm text-blue-800 dark:text-blue-200 mb-4">
              Images are stored privately on your server at <code className="bg-blue-100 dark:bg-blue-900 px-2 py-1 rounded text-xs font-mono">/private-images</code>
            </p>

            <div className="space-y-4">
              {/* Upload Section */}
              <div>
                <label className="block text-sm font-medium text-blue-900 dark:text-blue-100 mb-3">
                  Upload Image to Your Server
                </label>
                <div className="relative">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={isUploading}
                    className="hidden"
                    aria-label="Upload product image"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-blue-300 dark:border-blue-700 rounded-lg bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isUploading ? (
                      <>
                        <Loader className="w-5 h-5 animate-spin text-blue-600" />
                        <span className="text-sm font-medium text-blue-900 dark:text-blue-100">Uploading to your server...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-5 h-5 text-blue-600" />
                        <span className="text-sm font-medium text-blue-900 dark:text-blue-100">Click to upload or drag & drop</span>
                      </>
                    )}
                  </button>
                  <p className="mt-2 text-xs text-blue-700 dark:text-blue-300">PNG, JPG, GIF, WebP up to 10MB • Stored on your server</p>
                </div>
              </div>

              {/* Divider */}
              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-blue-200 dark:bg-blue-800"></div>
                <span className="text-xs font-medium text-blue-600 dark:text-blue-400">OR</span>
                <div className="flex-1 h-px bg-blue-200 dark:bg-blue-800"></div>
              </div>

              {/* Browse Public Folder */}
              <div>
                <label className="block text-sm font-medium text-blue-900 dark:text-blue-100 mb-3">
                  Browse Images from Public Folder
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setShowImageBrowser(true);
                    loadPublicImages();
                  }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-blue-300 dark:border-blue-700 rounded-lg bg-blue-100 dark:bg-blue-900/30 hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
                >
                  <Folder className="w-5 h-5 text-blue-600" />
                  <span className="text-sm font-medium text-blue-900 dark:text-blue-100">Browse Public Folder</span>
                </button>
              </div>
            </div>

            {/* Image Preview */}
            {formData.image && (
              <div className="mt-4 pt-4 border-t border-blue-200 dark:border-blue-800">
                <p className="text-xs font-medium text-blue-700 dark:text-blue-300 mb-3">Preview</p>
                <div className="relative w-32 h-32">
                  <Image
                    src={formData.image}
                    alt="Product preview"
                    fill
                    className="object-cover rounded-md border-2 border-blue-300 dark:border-blue-700"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, image: "" })}
                  className="mt-2 text-xs text-red-600 dark:text-red-400 hover:underline"
                >
                  Clear image
                </button>
              </div>
            )}

            <div className="mt-4 p-3 bg-blue-100 dark:bg-blue-900/30 rounded border border-blue-300 dark:border-blue-700">
              <p className="text-xs text-blue-900 dark:text-blue-100">
                <strong>🔒 Private Hosting:</strong> Images uploaded here are stored on your server in <code className="bg-blue-200 dark:bg-blue-800 px-1 rounded text-xs font-mono">/public/private-images</code>. They&apos;re served through your domain at <code className="bg-blue-200 dark:bg-blue-800 px-1 rounded text-xs font-mono">/api/admin/private-images/[filename]</code>
              </p>
            </div>
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

      {/* Image Browser Modal */}
      {showImageBrowser && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg max-w-4xl w-full max-h-[80vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2">
                <Folder className="w-6 h-6 text-blue-600" />
                <h3 className="text-xl font-bold">Browse Public Images</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowImageBrowser(false)}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Search Bar */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search images..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Image Grid */}
            <div className="flex-1 overflow-y-auto p-4">
              {loadingImages ? (
                <div className="flex items-center justify-center h-full">
                  <div className="flex flex-col items-center gap-2">
                    <Loader className="w-8 h-8 animate-spin text-blue-600" />
                    <p className="text-sm text-gray-600 dark:text-gray-400">Loading images...</p>
                  </div>
                </div>
              ) : publicImages.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <p className="text-sm text-gray-600 dark:text-gray-400">No images found in public folder</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {publicImages
                    .filter((img) =>
                      img.filename.toLowerCase().includes(searchQuery.toLowerCase())
                    )
                    .map((image, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleSelectImage(image.url)}
                        className="relative group overflow-hidden rounded-lg border-2 border-gray-200 dark:border-gray-700 hover:border-blue-500 transition-all"
                      >
                        <div className="relative w-full aspect-square bg-gray-100 dark:bg-gray-800">
                          <Image
                            src={image.url}
                            alt={image.filename}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform"
                            sizes="200px"
                          />
                        </div>
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-end">
                          <div className="w-full p-2 bg-gradient-to-t from-black/80 to-transparent text-white text-xs truncate opacity-0 group-hover:opacity-100 transition-opacity">
                            {image.filename}
                          </div>
                        </div>
                      </button>
                    ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowImageBrowser(false)}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

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
