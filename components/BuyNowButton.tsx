"use client";

import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cartStore";

interface BuyNowButtonProps {
  product: {
    id: string;
    name: string;
    price: number;
    image: string;
  };
}

export default function BuyNowButton({ product }: BuyNowButtonProps) {
  const router = useRouter();
  const addItem = useCartStore((state) => state.addItem);

  const handleBuyNow = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
    });
    router.push("/checkout");
  };

  return (
    <button
      onClick={handleBuyNow}
      className="w-full rounded-md border-2 border-[var(--accent)] px-8 py-3 font-medium text-[var(--accent)] hover:bg-[var(--accent)] hover:text-[var(--background)] transition-colors"
    >
      Buy Now
    </button>
  );
}
