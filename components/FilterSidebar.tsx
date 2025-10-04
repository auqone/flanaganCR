"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronDown, ChevronUp } from "lucide-react";

interface FilterSection {
  title: string;
  options: string[];
}

const filters: FilterSection[] = [
  {
    title: "Category",
    options: ["Electronics & Gadgets", "Sports & Fitness", "Home & Kitchen", "Home & Garden", "Health & Wellness", "Jewelry & Accessories", "Digital Products"],
  },
  {
    title: "Price Range",
    options: ["Under $25", "$25 - $50", "$50 - $100", "$100 - $200", "Over $200"],
  },
  {
    title: "Rating",
    options: ["4+ Stars", "3+ Stars", "2+ Stars", "1+ Stars"],
  },
];

function FilterGroup({ filter }: { filter: FilterSection }) {
  const [isOpen, setIsOpen] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get("category");
  const currentPrice = searchParams.get("price");
  const currentRating = searchParams.get("rating");

  const toggleOption = (option: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (filter.title === "Category") {
      if (currentCategory === option) {
        params.delete("category");
      } else {
        params.set("category", option);
      }
    } else if (filter.title === "Price Range") {
      if (currentPrice === option) {
        params.delete("price");
      } else {
        params.set("price", option);
      }
    } else if (filter.title === "Rating") {
      if (currentRating === option) {
        params.delete("rating");
      } else {
        params.set("rating", option);
      }
    }

    const queryString = params.toString();
    router.push(queryString ? `/?${queryString}` : "/");
  };

  return (
    <div className="border-b border-[var(--border)] pb-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between py-3 text-sm font-medium"
      >
        {filter.title}
        {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
      </button>
      {isOpen && (
        <div className="space-y-2 pt-2">
          <label className="flex items-center gap-2 text-sm cursor-pointer hover:opacity-70">
            <input
              type="radio"
              name={filter.title}
              checked={
                (filter.title === "Category" && !currentCategory) ||
                (filter.title === "Price Range" && !currentPrice) ||
                (filter.title === "Rating" && !currentRating)
              }
              onChange={() => {
                const params = new URLSearchParams(searchParams.toString());
                if (filter.title === "Category") params.delete("category");
                if (filter.title === "Price Range") params.delete("price");
                if (filter.title === "Rating") params.delete("rating");
                const queryString = params.toString();
                router.push(queryString ? `/?${queryString}` : "/");
              }}
              className="h-4 w-4 cursor-pointer"
            />
            <span>None</span>
          </label>
          {filter.options.map((option) => (
            <label key={option} className="flex items-center gap-2 text-sm cursor-pointer hover:opacity-70">
              <input
                type="radio"
                name={filter.title}
                checked={
                  (filter.title === "Category" && currentCategory === option) ||
                  (filter.title === "Price Range" && currentPrice === option) ||
                  (filter.title === "Rating" && currentRating === option)
                }
                onChange={() => toggleOption(option)}
                className="h-4 w-4 cursor-pointer"
              />
              <span>{option}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
}

export default function FilterSidebar() {
  return (
    <aside className="w-64 border-r border-[var(--border)] p-6 hidden lg:block">
      <div className="space-y-1">
        <h2 className="text-lg font-semibold mb-4">Filters</h2>
        {filters.map((filter) => (
          <FilterGroup key={filter.title} filter={filter} />
        ))}
        <button className="mt-6 w-full rounded-md border border-[var(--border)] py-2 text-sm font-medium hover:bg-[var(--muted)] transition-colors">
          Clear All Filters
        </button>
      </div>
    </aside>
  );
}
