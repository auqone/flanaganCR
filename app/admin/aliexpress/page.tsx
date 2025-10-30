"use client";

import { useState } from "react";
import {
  Package,
  ExternalLink,
  CheckCircle2,
  Circle,
  AlertCircle,
  Copy,
  Check,
  ChevronRight,
} from "lucide-react";

export default function AliExpressPage() {
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const steps = [
    {
      id: 1,
      title: "Receive Order Notification",
      description: "Customer places order on Flanagan Crafted Naturals",
      status: "completed",
      details: [
        "Order appears in Orders dashboard with PAID status",
        "Customer receives order confirmation email",
        "You receive notification (if configured)",
      ],
    },
    {
      id: 2,
      title: "Review Order Details",
      description: "Check product and shipping information",
      status: "current",
      details: [
        "Go to Orders → Click on order",
        "Note the products, quantities, and shipping address",
        "Verify customer contact information",
      ],
    },
    {
      id: 3,
      title: "Order from AliExpress",
      description: "Place order on AliExpress with customer's details",
      status: "pending",
      details: [
        "Click 'AliExpress URL' link for each product (if added)",
        "Add products to cart on AliExpress",
        "Use customer's shipping address (NOT yours)",
        "Complete purchase with your payment method",
        "Save AliExpress order number",
      ],
    },
    {
      id: 4,
      title: "Update Order Status",
      description: "Mark order as ordered from supplier",
      status: "pending",
      details: [
        "In Admin Dashboard Orders, click Edit on the order",
        "Change status to 'ORDERED_SUPPLIER'",
        "Add AliExpress Order ID",
        "Add AliExpress Order URL (optional)",
        "Add internal notes if needed",
      ],
    },
    {
      id: 5,
      title: "Wait for AliExpress Shipping",
      description: "Monitor AliExpress order for tracking info",
      status: "pending",
      details: [
        "Check AliExpress order page regularly",
        "Wait for tracking number (usually 3-7 days)",
        "Download tracking number when available",
      ],
    },
    {
      id: 6,
      title: "Add Tracking to Admin Dashboard",
      description: "Update customer's order with tracking",
      status: "pending",
      details: [
        "Edit the order in Admin Dashboard Orders",
        "Change status to 'SHIPPED'",
        "Add tracking number from AliExpress",
        "Add tracking URL (optional but recommended)",
        "Customer receives automatic shipping email",
      ],
    },
    {
      id: 7,
      title: "Mark as Delivered",
      description: "Complete the order after delivery",
      status: "pending",
      details: [
        "Monitor tracking until delivered",
        "Change status to 'DELIVERED' when confirmed",
        "Order is now complete!",
      ],
    },
  ];

  const tips = [
    {
      title: "Use Customer's Shipping Address",
      description: "CRITICAL: Always use your customer's address, not yours. AliExpress ships directly to them.",
      type: "error",
    },
    {
      title: "Check Product Availability",
      description: "Before listing products, verify they're in stock on AliExpress and shipping times are acceptable.",
      type: "warning",
    },
    {
      title: "Price Tracking",
      description: "Set 'Base Price' in products to track your costs from AliExpress and calculate profit margins.",
      type: "info",
    },
    {
      title: "Communication",
      description: "Keep customers updated via the automated emails. They'll receive confirmations at each status change.",
      type: "info",
    },
    {
      title: "Handle Delays Proactively",
      description: "If AliExpress shipments are delayed, communicate with customers early to maintain trust.",
      type: "warning",
    },
    {
      title: "ePacket Shipping",
      description: "Choose ePacket when available - it's faster and includes tracking for most countries.",
      type: "info",
    },
  ];

  const commonLinks = [
    {
      name: "AliExpress Orders",
      url: "https://www.aliexpress.com/p/order/index.html",
      description: "View all your AliExpress orders",
    },
    {
      name: "AliExpress Track Order",
      url: "https://track.aliexpress.com/",
      description: "Track AliExpress shipments",
    },
    {
      name: "17Track (Universal Tracker)",
      url: "https://www.17track.net/",
      description: "Track packages from any carrier",
    },
  ];

  return (
    <div className="max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">AliExpress Fulfillment Guide</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Step-by-step process for manual dropshipping from AliExpress
        </p>
      </div>

      {/* Quick Links */}
      <div className="bg-[var(--background)] rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Quick Links</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {commonLinks.map((link) => (
            <a
              key={link.name}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-4 rounded-md border border-[var(--border)] hover:bg-[var(--muted)] transition-colors"
            >
              <div>
                <p className="font-medium">{link.name}</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">{link.description}</p>
              </div>
              <ExternalLink className="w-5 h-5 text-[var(--accent)]" />
            </a>
          ))}
        </div>
      </div>

      {/* Workflow Steps */}
      <div className="bg-[var(--background)] rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-6">Fulfillment Workflow</h2>
        <div className="space-y-4">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className={`border-l-4 pl-6 py-4 ${
                step.status === "completed"
                  ? "border-green-500"
                  : step.status === "current"
                  ? "border-blue-500"
                  : "border-gray-300 dark:border-gray-700"
              }`}
            >
              <div className="flex items-start gap-4">
                <div className="mt-1">
                  {step.status === "completed" ? (
                    <CheckCircle2 className="w-6 h-6 text-green-500" />
                  ) : step.status === "current" ? (
                    <Circle className="w-6 h-6 text-blue-500 fill-blue-500" />
                  ) : (
                    <Circle className="w-6 h-6 text-gray-400" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-semibold text-gray-500">Step {step.id}</span>
                    <h3 className="text-lg font-semibold">{step.title}</h3>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 mb-3">{step.description}</p>
                  <ul className="space-y-2">
                    {step.details.map((detail, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm">
                        <ChevronRight className="w-4 h-4 text-[var(--accent)] mt-0.5 flex-shrink-0" />
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tips & Best Practices */}
      <div className="bg-[var(--background)] rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Tips & Best Practices</h2>
        <div className="space-y-3">
          {tips.map((tip, index) => (
            <div
              key={index}
              className={`p-4 rounded-md border ${
                tip.type === "error"
                  ? "border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20"
                  : tip.type === "warning"
                  ? "border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-900/20"
                  : "border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20"
              }`}
            >
              <div className="flex items-start gap-3">
                <AlertCircle
                  className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                    tip.type === "error"
                      ? "text-red-600 dark:text-red-400"
                      : tip.type === "warning"
                      ? "text-yellow-600 dark:text-yellow-400"
                      : "text-blue-600 dark:text-blue-400"
                  }`}
                />
                <div>
                  <h3 className="font-semibold mb-1">{tip.title}</h3>
                  <p className="text-sm text-gray-700 dark:text-gray-300">{tip.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sample Address Format */}
      <div className="bg-[var(--background)] rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Sample Shipping Address Format</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          When ordering from AliExpress, use this exact format from the customer&apos;s order:
        </p>
        <div className="bg-[var(--muted)] p-4 rounded-md font-mono text-sm">
          <div className="space-y-1">
            <p><strong>Name:</strong> [Customer Name from Order]</p>
            <p><strong>Address Line 1:</strong> [Shipping Address from Order]</p>
            <p><strong>City:</strong> [Shipping City]</p>
            <p><strong>State/Province:</strong> [Shipping State]</p>
            <p><strong>ZIP/Postal Code:</strong> [Shipping Zip]</p>
            <p><strong>Country:</strong> [Shipping Country]</p>
            <p><strong>Phone:</strong> [Customer Phone - if provided]</p>
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-3">
          All this information is available in the order details in your Orders dashboard
        </p>
      </div>
    </div>
  );
}
