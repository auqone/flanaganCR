"use client";

import { Suspense } from "react";
import ProductGrid from "@/components/ProductGrid";
import FilterSidebar from "@/components/FilterSidebar";
import FeaturedCarousel from "@/components/FeaturedCarousel";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import { useSearchParams } from "next/navigation";

function HomeContent() {
  const searchParams = useSearchParams();
  const categoryFilter = searchParams.get("category");
  const priceFilter = searchParams.get("price");
  const ratingFilter = searchParams.get("rating");

  return (
    <>
      <Header />
      <FeaturedCarousel />
      <main className="flex-1 flex">
        <FilterSidebar />
        <ProductGrid
          categoryFilter={categoryFilter}
          priceFilter={priceFilter}
          ratingFilter={ratingFilter}
        />
      </main>
      <Footer />
      <ScrollToTop />
    </>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Suspense fallback={<div>Loading...</div>}>
        <HomeContent />
      </Suspense>
    </div>
  );
}
