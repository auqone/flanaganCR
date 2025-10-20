"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to dashboard as the default admin page
    router.push("/admin/dashboard");
  }, [router]);

  return (
    <div className="flex items-center justify-center py-12">
      <p>Redirecting to dashboard...</p>
    </div>
  );
}
