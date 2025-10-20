"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

const featuredProducts = [
  {
    id: "4",
    name: "Home Walking Pad Treadmill",
    price: 189.99,
    image: "https://images.unsplash.com/photo-1576678927484-cc907957088c?w=1200&h=600&fit=crop",
    description: "Get fit at home with our ultra-compact walking pad",
  },
  {
    id: "2",
    name: "Fitness Tracker Smart Watch",
    price: 45.99,
    image: "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=1200&h=600&fit=crop",
    description: "Track your health 24/7 with advanced monitoring",
  },
  {
    id: "18",
    name: "Air Fryer 6-Quart Digital",
    price: 79.99,
    image: "https://images.unsplash.com/photo-1585515320310-259814833e62?w=1200&h=600&fit=crop",
    description: "Cook healthier meals with 85% less fat",
  },
];

export default function FeaturedCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % featuredProducts.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % featuredProducts.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + featuredProducts.length) % featuredProducts.length);
  };

  return (
    <div className="relative w-full h-[200px] md:h-[250px] overflow-hidden bg-[var(--muted)]">
      {featuredProducts.map((product, index) => (
        <div
          key={product.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="relative w-full h-full">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover"
              priority={index === 0}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/30" />
            <div className="absolute inset-0 flex items-center">
              <div className="container mx-auto px-2 md:px-4">
                <div className="max-w-2xl text-white">
                  <h2 className="text-2xl md:text-3xl font-bold mb-1">{product.name}</h2>
                  <p className="text-sm md:text-base mb-2">{product.description}</p>
                  <div className="flex items-center gap-2 md:gap-3">
                    <span className="text-xl md:text-2xl font-bold">${product.price}</span>
                    <Link
                      href={`/product/${product.id}`}
                      className="bg-white text-black px-6 py-2 rounded-md font-medium hover:bg-gray-100 transition-colors text-sm"
                    >
                      Shop Now
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Buttons */}
      <button
        onClick={prevSlide}
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-1.5 rounded-full transition-colors"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-4 w-4 md:h-5 md:w-5" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-1.5 rounded-full transition-colors"
        aria-label="Next slide"
      >
        <ChevronRight className="h-4 w-4 md:h-5 md:w-5" />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2">
        {featuredProducts.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentSlide ? "bg-white w-8" : "bg-white/50"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
