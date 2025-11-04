"use client";

import Image from "next/image";
import Link from "next/link";

export default function FeaturedCarousel() {
  return (
    <div className="relative w-full h-[300px] md:h-[400px] overflow-hidden bg-[var(--muted)]">
      <div className="relative w-full h-full">
        <Image
          src="https://images.unsplash.com/photo-1464207687429-7505649dae38?w=1400&h=500&fit=crop"
          alt="Garden and wellness lifestyle"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-black/30" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white max-w-2xl px-4">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Welcome to Flanagan Crafted Naturals</h2>
            <p className="text-lg md:text-xl mb-6">Discover our natural wellness collection</p>
            <Link
              href="/signup"
              className="inline-block bg-white text-black px-8 py-3 rounded-md font-semibold hover:bg-gray-100 transition-colors text-base md:text-lg"
            >
              Sign Up - Get 15% Off
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
