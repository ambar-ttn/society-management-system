"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useAuth } from "@/hooks/useAuth";

export default function ResidentGuard({ children }) {

  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        toast.error("Session expired. Please login again.");
        router.replace("/login");
      } 
      else if (user.role !== "resident") {
        toast.error("Restricted to Residents only.");
        router.replace("/admin/dashboard");
      }
    }
  }, [user, loading]);

  // taking out the  states from local storage
  if (loading) {
    return (
      <div className="h-screen w-full bg-[#000814] flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-[#FFD60A]"></div>
      </div>
    );
  }

 
  if (!user || user.role !== "resident") {
    return null;
  } // phle return null krwaidya 

/*
useEffect performs the redirect, but useEffect runs after the component renders.
So if we do not add this condition, the protected page may appear on the screen
for a brief moment before the redirect happens.

Purpose of this condition:
If the user does not exist or the user is not a resident
→ Do not render the page
→ Return blank
→ useEffect will handle the redirect

One-line summary:
This condition prevents the protected page from rendering until we confirm that the user is authorized.
*/
  return children;
}