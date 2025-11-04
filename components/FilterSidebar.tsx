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
  {
    title: "Certification",
    options: ["Organic", "Natural", "Conventional"],
  },
  {
    title: "Product Type",
    options: ["Tincture", "Jam", "Salve", "Tea", "Jewelry", "Craft Item"],
  },
  {
    title: "Potency Level",
    options: ["Low", "Medium", "High"],
  },
  {
    title: "Availability",
    options: ["In Stock", "Coming Soon", "Pre-Order"],
  },
  {
    title: "Dietary",
    options: ["Vegan", "Vegetarian", "Paleo", "Gluten-Free"],
  },
  {
    title: "Key Ingredients",
    options: ["Elderberry", "Echinacea", "Rose", "Lavender", "Pine Needle", "Honey"],
  },
  {
    title: "Product Format",
    options: ["Solo Product", "Gift Set", "Bulk Option"],
  },
];

function FilterGroup({ filter }: { filter: FilterSection }) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const getFilterKey = (title: string): string => {
    const keyMap: { [key: string]: string } = {
      "Category": "category",
      "Price Range": "price",
      "Rating": "rating",
      "Certification": "certification",
      "Product Type": "productType",
      "Potency Level": "potency",
      "Availability": "availability",
      "Dietary": "dietary",
      "Key Ingredients": "ingredients",
      "Product Format": "format",
    };
    return keyMap[title] || title.toLowerCase();
  };

  const filterKey = getFilterKey(filter.title);
  const currentValue = searchParams.get(filterKey);

  const getCurrentValue = () => {
    return currentValue || "Any";
  };

  const toggleOption = (option: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (currentValue === option) {
      params.delete(filterKey);
    } else {
      params.set(filterKey, option);
    }

    const queryString = params.toString();
    router.push(queryString ? `/?${queryString}` : "/");
    setIsOpen(false);
  };

  const clearFilter = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete(filterKey);
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
                    currentValue === option
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
