"use client";

import { Minus, Plus } from "lucide-react";
import { useState } from "react";

interface QuantitySelectorProps {
  onQuantityChange: (quantity: number) => void;
  maxQuantity?: number;
  defaultQuantity?: number;
}

export default function QuantitySelector({
  onQuantityChange,
  maxQuantity = 999,
  defaultQuantity = 1,
}: QuantitySelectorProps) {
  const [quantity, setQuantity] = useState(defaultQuantity);

  const handleDecrease = () => {
    if (quantity > 1) {
      const newQuantity = quantity - 1;
      setQuantity(newQuantity);
      onQuantityChange(newQuantity);
    }
  };

  const handleIncrease = () => {
    if (quantity < maxQuantity) {
      const newQuantity = quantity + 1;
      setQuantity(newQuantity);
      onQuantityChange(newQuantity);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value >= 1 && value <= maxQuantity) {
      setQuantity(value);
      onQuantityChange(value);
    }
  };

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Quantity:</span>
      <div className="flex items-center border border-[var(--border)] rounded-lg bg-[var(--background)]">
        <button
          onClick={handleDecrease}
          disabled={quantity <= 1}
          className="p-2 hover:bg-[var(--muted)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          aria-label="Decrease quantity"
        >
          <Minus className="w-4 h-4" />
        </button>

        <input
          type="number"
          value={quantity}
          onChange={handleInputChange}
          min="1"
          max={maxQuantity}
          className="w-12 text-center border-0 bg-transparent focus:outline-none font-medium"
          aria-label="Quantity input"
        />

        <button
          onClick={handleIncrease}
          disabled={quantity >= maxQuantity}
          className="p-2 hover:bg-[var(--muted)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          aria-label="Increase quantity"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
      <span className="text-xs text-gray-500">Max: {maxQuantity}</span>
    </div>
  );
}
