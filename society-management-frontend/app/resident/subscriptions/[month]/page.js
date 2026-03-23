"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams, useParams, useRouter } from "next/navigation";
import API from "@/lib/api";
import { ArrowLeft, Loader2, AlertCircle } from "lucide-react";

export default function SubscriptionDetails() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const month = params.month;
  const year = searchParams.get("year");
  const flat_number = searchParams.get("flat_number");

  useEffect(() => {
    const fetchDetails = async () => {
      if (!month || !year || !flat_number) return;

      try {
        setLoading(true);

        const response = await API.get(
          `/resident/subscriptions/details?month=${month}&year=${year}&flat_number=${flat_number}`
        );

        if (response.data.success) {
          setData(response.data.details);
        }
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || "Record not found");
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [month, year, flat_number]);
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

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] text-center">
        <AlertCircle size={48} className="text-red-500 mb-4" />
        <h2 className="text-[#F1F2FF] text-xl font-bold">{error}</h2>
        <button
          onClick={() => router.back()}
          className="mt-4 text-[#FFD60A] hover:underline"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
   <div className="p-4 md:p-6 max-w-3xl mx-auto">

  <button
    onClick={() => router.back()}
    className="text-[#AFB2BF] mb-4"
  >
    ← Back
  </button>

  <div className="bg-[#161D29] border border-[#2C333F] p-6">

    <h2 className="text-xl font-bold text-[#F1F2FF] mb-4">
      Maintenance Receipt
    </h2>

    <div className="grid grid-cols-2 gap-4 text-sm">

      <div>
        <p className="text-[#AFB2BF]">Flat</p>
        <p className="text-[#F1F2FF]">{data.flat_number}</p>
      </div>

      <div>
        <p className="text-[#AFB2BF]">Billing Period</p>
        <p className="text-[#F1F2FF]">
          {getMonthName(data.month)} {data.year}
        </p>
      </div>

      <div>
        <p className="text-[#AFB2BF]">Amount</p>
        <p className="text-[#F1F2FF] font-bold">
          ₹{data.monthly_amount}
        </p>
      </div>

      <div>
        <p className="text-[#AFB2BF]">Status</p>
        <p className="text-[#F1F2FF]">{data.status}</p>
      </div>

      <div>
        <p className="text-[#AFB2BF]">Payment Mode</p>
        <p className="text-[#F1F2FF]">{data.payment_mode || "Pending"}</p>
      </div>

      <div>
        <p className="text-[#AFB2BF]">Payment Date</p>
        <p className="text-[#F1F2FF]">
          {data.payment_date
            ? new Date(data.payment_date).toLocaleDateString()
            : "Pending"}
        </p>
      </div>

    </div>

  </div>
</div>
  );
}