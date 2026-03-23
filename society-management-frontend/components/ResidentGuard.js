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
useEffect redirect karta hai, lekin useEffect render ke baad chalta hai.
Isliye agar hum ye condition na lagaye to ek second ke liye protected page screen pe dikh sakta hai.

Is line ka kaam:
Agar user nahi hai ya resident nahi hai
→ Page render hi mat karo
→ Blank return karo
→ useEffect redirect kar dega
One-line summary (best):

Ye condition protected page ko render hone se rokne ke liye hai jab tak confirm na ho jaye ki user authorized hai.

  */
  return children;
}