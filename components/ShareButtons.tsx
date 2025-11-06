"use client";

import { Share2, Copy, Check } from "lucide-react";
import { useState } from "react";

interface ShareButtonsProps {
  productName: string;
  productUrl: string;
}

export default function ShareButtons({ productName, productUrl }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const shareText = `Check out ${productName} on Flanagan Crafted Naturals!`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(productUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareFacebook = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(productUrl)}`;
    window.open(facebookUrl, "_blank", "width=600,height=400");
  };

  const handleShareTwitter = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(productUrl)}`;
    window.open(twitterUrl, "_blank", "width=600,height=400");
  };

  const handleShareLinkedIn = () => {
    const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(productUrl)}`;
    window.open(linkedInUrl, "_blank", "width=600,height=400");
  };

  const handleShareWhatsApp = () => {
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText + " " + productUrl)}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <div className="flex items-center gap-2">
      <span className="flex items-center gap-1 text-sm font-medium text-gray-600 dark:text-gray-400">
        <Share2 className="w-4 h-4" />
        Share:
      </span>
      <div className="flex gap-2">
        {/* Facebook */}
        <button
          onClick={handleShareFacebook}
          className="p-2 rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-700 transition-colors"
          title="Share on Facebook"
          aria-label="Share on Facebook"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
          </svg>
        </button>

        {/* Twitter */}
        <button
          onClick={handleShareTwitter}
          className="p-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-500 transition-colors"
          title="Share on Twitter"
          aria-label="Share on Twitter"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M23.953 4.57a10 10 0 002.856-3.515 10 10 0 01-2.836.776 4.958 4.958 0 002.165-2.724c-.951.564-2.005.974-3.127 1.195a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
          </svg>
        </button>

        {/* LinkedIn */}
        <button
          onClick={handleShareLinkedIn}
          className="p-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors"
          title="Share on LinkedIn"
          aria-label="Share on LinkedIn"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z" />
          </svg>
        </button>

        {/* WhatsApp */}
        <button
          onClick={handleShareWhatsApp}
          className="p-2 rounded-lg bg-green-100 hover:bg-green-200 text-green-600 transition-colors"
          title="Share on WhatsApp"
          aria-label="Share on WhatsApp"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421-7.403h-.004a9.87 9.87 0 00-9.746 9.798c0 2.719.738 5.378 2.142 7.71L2.69 21.577l8.256-2.414c2.2 1.202 4.662 1.837 7.262 1.837 5.48 0 9.944-4.465 9.986-9.946.026-2.648-.618-5.150-1.844-7.442-1.227-2.292-2.973-4.366-5.096-5.9-2.124-1.533-4.595-2.455-7.289-2.582z" />
          </svg>
        </button>

        {/* Copy Link */}
        <button
          onClick={handleCopyLink}
          className={`p-2 rounded-lg transition-colors ${
            copied
              ? "bg-green-100 text-green-600"
              : "bg-gray-100 hover:bg-gray-200 text-gray-600 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-400"
          }`}
          title="Copy link to clipboard"
          aria-label="Copy link to clipboard"
        >
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
}
