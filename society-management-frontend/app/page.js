"use client";

import React from "react";
import Link from "next/link";
import {
  CreditCard,
  History,
  BarChart3,
  ChevronRight
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#000814] text-[#F1F2FF]">

      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-[#000814]/80 backdrop-blur-md border-b border-[#2C333F]">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

          <div className="text-2xl font-bold">
            Society<span className="text-[#FFD60A]">Pay</span>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="resident/login"
              className="px-5 py-2 rounded-lg border border-[#2C333F] text-sm hover:bg-[#161D29]"
            >
              Login
            </Link>

            <Link
              href="resident/signup"
              className="px-5 py-2 rounded-lg bg-[#FFD60A] text-[#000814] font-semibold text-sm"
            >
              Signup
            </Link>
          </div>

        </div>
      </nav>

      {/* Hero */}
      <section className="pt-40 pb-20 px-6 text-center">

        <h1 className="text-5xl md:text-6xl font-bold mb-6">
          Manage Society <br />
          <span className="text-[#FFD60A]">Subscriptions Easily</span>
        </h1>

        <p className="text-[#AFB2BF] text-lg max-w-2xl mx-auto mb-10">
          A simple platform for residents and admins to manage society
          maintenance payments, track history and generate reports.
        </p>

        {/* Login options */}

        <div className="flex flex-col sm:flex-row gap-4 justify-center">

          <Link
            href="resident/login"
            className="px-10 py-4 rounded-xl bg-[#FFD60A] text-[#000814] font-bold flex items-center gap-2 justify-center"
          >
            Resident Login
            <ChevronRight size={18} />
          </Link>

          <Link
            href="admin/login"
            className="px-10 py-4 rounded-xl bg-[#161D29] border border-[#2C333F] font-semibold"
          >
            Admin Login
          </Link>

        </div>

      </section>

      {/* Features */}

      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">

          {/* Card 1 */}
          <div className="bg-[#161D29] p-8 rounded-xl border border-[#2C333F]">
            <CreditCard className="text-[#FFD60A] mb-4" size={26} />
            <h3 className="text-xl font-bold mb-2">
              Track Monthly Payments
            </h3>
            <p className="text-[#AFB2BF] text-sm">
              Easily monitor maintenance payments and dues every month.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-[#161D29] p-8 rounded-xl border border-[#2C333F]">
            <History className="text-[#FFD60A] mb-4" size={26} />
            <h3 className="text-xl font-bold mb-2">
              Payment History
            </h3>
            <p className="text-[#AFB2BF] text-sm">
              Residents can access full subscription history and receipts.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-[#161D29] p-8 rounded-xl border border-[#2C333F]">
            <BarChart3 className="text-[#FFD60A] mb-4" size={26} />
            <h3 className="text-xl font-bold mb-2">
              Admin Financial Reports
            </h3>
            <p className="text-[#AFB2BF] text-sm">
              Admins can view society financial statistics and reports.
            </p>
          </div>

        </div>
      </section>


      <footer className="py-10 border-t border-[#2C333F] text-center text-[#AFB2BF] text-sm">
        © 2026 SocietyPay
      </footer>

    </div>
  );
}
