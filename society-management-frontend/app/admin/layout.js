"use client";

import { usePathname } from "next/navigation";
import AdminGuard from "@/components/AdminGuard";
import Sidebar from "@/components/SideBar";
import { adminLinks } from "@/data/adminLinks";

export default function AdminLayout({ children }) {
  const pathname = usePathname();

  if (pathname === "/admin/login") {
    return children;
  }

  return (
    <AdminGuard>
      <div className="flex h-screen bg-[#000814]">
      
<Sidebar
  links={adminLinks}
  title="Admin Panel"
  subtitle="Society Management"
  letter="A"
/>
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </AdminGuard>
  );
}

