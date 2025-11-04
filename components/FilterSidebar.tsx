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
    options: ["Jellies", "Foods", "Medicinal Tinctures", "Topical Items", "Teas", "Jewelry", "Pine Needle Crafts"],
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
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get("category");
  const currentPrice = searchParams.get("price");
  const currentRating = searchParams.get("rating");

  const getCurrentValue = () => {
    if (filter.title === "Category") return currentCategory || "All";
    if (filter.title === "Price Range") return currentPrice || "Any";
    if (filter.title === "Rating") return currentRating || "Any";
    return "Select";
  };

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
    setIsOpen(false);
  };

  const clearFilter = () => {
    const params = new URLSearchParams(searchParams.toString());
    if (filter.title === "Category") params.delete("category");
    if (filter.title === "Price Range") params.delete("price");
    if (filter.title === "Rating") params.delete("rating");
    const queryString = params.toString();
    router.push(queryString ? `/?${queryString}` : "/");
    setIsOpen(false);
  };

  return (
    <div className="border-b border-[var(--border)] pb-2">
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between py-2 px-3 text-sm font-medium border border-[var(--border)] rounded-md hover:bg-[var(--muted)] transition-colors"
        >
          <span className="truncate">
            <span className="text-xs text-gray-500">{filter.title}:</span> {getCurrentValue()}
          </span>
          {isOpen ? <ChevronUp className="h-4 w-4 flex-shrink-0" /> : <ChevronDown className="h-4 w-4 flex-shrink-0" />}
        </button>
        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-[var(--background)] border border-[var(--border)] rounded-md shadow-lg z-10">
            <div className="max-h-48 overflow-y-auto p-2 space-y-1">
              <button
                onClick={clearFilter}
                className="w-full text-left px-2 py-1.5 text-sm hover:bg-[var(--muted)] rounded transition-colors"
              >
                Clear Filter
              </button>
              {filter.options.map((option) => (
                <button
                  key={option}
                  onClick={() => toggleOption(option)}
                  className={`w-full text-left px-2 py-1.5 text-sm rounded transition-colors ${
                    (filter.title === "Category" && currentCategory === option) ||
                    (filter.title === "Price Range" && currentPrice === option) ||
                    (filter.title === "Rating" && currentRating === option)
                      ? "bg-[var(--accent)] text-[var(--background)] font-medium"
                      : "hover:bg-[var(--muted)]"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function FilterSidebar() {
  return (
    <aside className="w-64 border-r border-[var(--border)] p-4 hidden lg:block">
      <div className="space-y-2">
        <h2 className="text-base font-semibold mb-3">Filters</h2>
        {filters.map((filter) => (
          <FilterGroup key={filter.title} filter={filter} />
        ))}
        <button className="mt-4 w-full rounded-md border border-[var(--border)] py-1.5 text-xs font-medium hover:bg-[var(--muted)] transition-colors">
          Clear All Filters
        </button>
      </div>
    </aside>
  );
}
