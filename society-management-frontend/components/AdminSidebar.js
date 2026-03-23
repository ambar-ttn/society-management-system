"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { adminLinks } from "@/data/adminLinks";
import { LogOut, Loader2 } from "lucide-react";
import API from "@/lib/api"; 
import toast from "react-hot-toast";
import { useAuth } from "@/hooks/useAuth";

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { logout } = useAuth(); 

const handleLogout = async () => {
    setLoading(true);
    try {
      const res = await API.post("/logout");
      if (res.data.success) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        toast.success("Logged out successfully");
        router.push("/");
      }
    } catch (err) {
      console.error("Logout error", err);
      toast.error(err.response?.data?.message || "Error logging out");
      localStorage.clear();
      router.push("/");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen bg-[#161D29] border-r border-[#2C333F] w-64 flex flex-col">
      
      {/* Header */}
      <div className="p-4 border-b border-[#2C333F]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#FFD60A] flex items-center justify-center text-black font-bold">
            A
          </div>
          <div>
            <p className="text-[#F1F2FF] font-medium">Admin Panel</p>
            <p className="text-[#AFB2BF] text-sm">Society Management</p>
          </div>
        </div>
      </div>

      {/* Menu Links */}
      <div className="flex-1 py-4">
        {adminLinks.map((link) => {
          const isActive = pathname === link.route;
          return (
            <Link
              key={link.id}
              href={link.route}
              className={`flex items-center gap-3 px-4 py-2.5 mx-2 rounded-lg ${
                isActive
                  ? "bg-[#FFD60A] text-black"
                  : "text-[#AFB2BF] hover:bg-[#000814] hover:text-[#FFD60A]"
              }`}
            >
              <link.icon size={20} />
              <span className="text-sm">{link.label}</span>
            </Link>
          );
        })}
      </div>

      {/* Logout Button */}
      <div className="p-4 border-t border-[#2C333F]">
        <button
          onClick={handleLogout}
          disabled={loading}
          className="flex items-center gap-3 px-4 py-2.5 w-full rounded-lg text-[#AFB2BF] hover:bg-[#000814] hover:text-[#FFD60A]"
        >
          {loading ? (
            <Loader2 size={20} className="animate-spin" />
          ) : (
            <LogOut size={20} />
          )}
          <span className="text-sm">{loading ? "Logging out..." : "Logout"}</span>
        </button>
      </div>
    </div>
  );
}