"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import API from "@/lib/api";
import {  
  ExternalLink, 
  Loader2, 
  Inbox,
  AlertCircle 
} from "lucide-react";

export default function SubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        setLoading(true);
        const response = await API.get(`/resident/subscriptions?page=${page}`);        
        if (response.data.success) {
          setSubscriptions(response.data.subscriptions);
          setTotalPages(response.data.totalPages || 1);
        }
      } catch (err) {
        setError("Unable to load subscriptions. Please try again.");
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptions();
  }, [page]);

 const months = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December"
];

const getMonthName = (m) => months[m - 1];

  if (loading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <Loader2 className="animate-spin text-[#FFD60A]" size={40} />
      </div>
    );
  }

  return (
 <div className="p-4 md:p-6 max-w-7xl mx-auto">

  {/* Header */}
  <div className="mb-6">
    <h1 className="text-2xl font-bold text-[#F1F2FF]">
      My Subscriptions
    </h1>
    <p className="text-[#AFB2BF] text-sm">
      View and manage your monthly society maintenance records.
    </p>
  </div>

  {error ? (
    <div className="bg-red-900/20 border border-red-900 p-3 text-red-400">
      {error}
    </div>
  ) : subscriptions.length === 0 ? (
    <div className="bg-[#161D29] border border-[#2C333F] p-10 text-center">
      <p className="text-[#AFB2BF]">No Subscriptions Found</p>
    </div>
  ) : (
    <div className="bg-[#161D29] border border-[#2C333F]">

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-[#000814] text-[#AFB2BF]">
            <tr>
              <th className="px-4 py-3">Flat</th>
              <th className="px-4 py-3">Billing Period</th>
              <th className="px-4 py-3 text-right">Amount</th>
              <th className="px-4 py-3 text-center">Status</th>
              <th className="px-4 py-3 text-right">Action</th>
            </tr>
          </thead>

          <tbody>
            {subscriptions.map((sub, index) => (
              <tr key={index} className="border-t border-[#2C333F]">
                
                <td className="px-4 py-3 text-[#F1F2FF]">
                  {sub.flat_number} ({sub.flat_type})
                </td>

                <td className="px-4 py-3 text-[#F1F2FF]">
                  {getMonthName(sub.month)} {sub.year}
                </td>

                <td className="px-4 py-3 text-right text-[#FFD60A] font-bold">
                  ₹{sub.amount}
                </td>

                <td className="px-4 py-3 text-center">
                  {sub.status === "paid" ? (
                    <span className="text-green-400">Paid</span>
                  ) : (
                    <span className="text-[#FFD60A]">Pending</span>
                  )}
                </td>

                <td className="px-4 py-3 text-right">
                  <Link
                    href={`subscriptions/${sub.month}?year=${sub.year}&flat_number=${sub.flat_number}`}
                    className="text-[#FFD60A]"
                  >
                    View
                  </Link>
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="p-3 border-t border-[#2C333F] flex justify-between">
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className="border border-[#2C333F] px-3 py-1 text-[#F1F2FF] disabled:opacity-40"
        >
          Prev
        </button>

        <span className="text-[#AFB2BF]">
          {page} / {totalPages}
        </span>

        <button
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
          className="border border-[#2C333F] px-3 py-1 text-[#F1F2FF] disabled:opacity-40"
        >
          Next
        </button>
      </div>

    </div>
  )}
</div>
  );
}