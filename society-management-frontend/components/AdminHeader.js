"use client";
import React from "react";
import { Menu, Bell, UserCircle, Search } from "lucide-react";

export default function AdminHeader({ onMenuClick }) {
  return (
    <header className="h-16 bg-[#000814] border-b border-[#2C333F] flex items-center justify-between px-4 md:px-8 sticky top-0 z-40">
      {/* Search Bar / Mobile Menu Toggle */}
      <div className="flex items-center gap-4 flex-1">
        <button
          onClick={onMenuClick}
          className="p-2 hover:bg-[#161D29] rounded-lg text-[#AFB2BF] md:hidden"
        >
          <Menu size={24} />
        </button>
        
        <div className="hidden md:flex items-center bg-[#161D29] rounded-full px-4 py-1.5 border border-[#2C333F] w-72">
          <Search size={18} className="text-[#AFB2BF]" />
          <input
            type="text"
            placeholder="Search records..."
            className="bg-transparent border-none focus:ring-0 text-sm text-[#F1F2FF] ml-2 placeholder:text-[#AFB2BF] w-full"
          />
        </div>
      </div>

      {/* Right Side Actions */}
      <div className="flex items-center gap-4">
        <button className="relative p-2 text-[#AFB2BF] hover:text-[#FFD60A] transition-colors">
          <Bell size={22} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-[#000814]"></span>
        </button>
        
        <div className="h-8 w-px bg-[#2C333F] mx-2 hidden sm:block"></div>

        <div className="flex items-center gap-3 cursor-pointer group">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-[#F1F2FF]">Admin Name</p>
            <p className="text-xs text-[#AFB2BF]">Super Admin</p>
          </div>
          <div className="w-10 h-10 rounded-full border-2 border-[#2C333F] group-hover:border-[#FFD60A] transition-all overflow-hidden flex items-center justify-center bg-[#161D29]">
            <UserCircle size={32} className="text-[#AFB2BF]" />
          </div>
        </div>
      </div>
    </header>
  );
}