"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

export default function AdminGuard({ children }) {

  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user || user.role !== "admin") {
        router.replace("/");
      }
    }
  }, [user, loading]);

  // 🔹 Loading state
  if (loading) {
    return (
      <div className="h-screen w-full bg-[#000814] flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-[#FFD60A]"></div>
      </div>
    );
  }

  // 🔹 Unauthorized → kuch render mat karo (avoid flicker)
  if (!user || user.role !== "admin") {
    return null;
  }

  return children;
}