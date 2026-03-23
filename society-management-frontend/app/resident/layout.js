"use client";

import { usePathname } from "next/navigation";
import { residentLinks } from "@/data/residentLinks";
import Sidebar from "@/components/SideBar";

import ResidentGuard from "@/components/ResidentGuard";

export default function ResidentLayout({ children }) {
  const pathname = usePathname();

  if (pathname === "/resident/login" || pathname==="/resident/signup") {
    return children;
  } // to avoid havong side bar there in login signups 

  return (
    <ResidentGuard>
      <div className="flex h-screen bg-[#000814]">
        <Sidebar
  links={residentLinks}
  title="Resident"
  subtitle="Society Pay"
  letter="R"
/>
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          {children}
        </main>
      </div>
    </ResidentGuard>
  );
}


