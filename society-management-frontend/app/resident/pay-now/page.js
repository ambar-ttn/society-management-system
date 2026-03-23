"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import API from "@/lib/api";


export default function PayNowPage() {
  const router = useRouter();

  const [flats, setFlats] = useState([]);

  const [formData, setFormData] = useState({
    flat_id: "",
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    payment_mode: "UPI"
  });

  const [loading, setLoading] = useState(false);
  const [successData, setSuccessData] = useState(null);
  const [error, setError] = useState("");

  // Fetch resident flats
  useEffect(() => {
    const fetchFlats = async () => {
      try {
        const res = await API.get("/resident/flats");


        if (res.data.success) {
          setFlats(res.data.flats);
        }

      } catch (err) {
        console.error("Error fetching flats", err);
      }
    };

    fetchFlats();
  }, []);

  const handlePayment = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await API.post("/resident/payments", {
        flat_id: parseInt(formData.flat_id),
        month: parseInt(formData.month),
        year: parseInt(formData.year),
        payment_mode: formData.payment_mode
      });

      if (response.data.success) {

        const selectedFlat = flats.find(
          (f) => f.id == formData.flat_id
        );

        setSuccessData({
          ...formData,
          flat_number: selectedFlat?.flat_number,
          payment_date: new Date().toLocaleDateString(),
          amount: 1500
        });

      setFormData({
  flat_id: "",
  month: new Date().getMonth() + 1,
  year: new Date().getFullYear(),
  payment_mode: "UPI"
}); 
      }

    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Payment simulation failed. Please try again."
      );
    }

    setLoading(false);
  };

const months = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December"
];

const getMonthName = (m) => months[m - 1];

  return (
   <div className="p-4 md:p-6 max-w-4xl mx-auto space-y-6">

  {/* Back Button */}
  <button
    onClick={() => router.push("/resident/subscriptions")}
    className="text-[#AFB2BF]"
  >
    ← Back to Subscriptions
  </button>

  <div className="flex justify-center">

    {!successData ? (

      <div className="w-full max-w-md bg-[#161D29] border border-[#2C333F] rounded-lg p-6">

        <h1 className="text-xl font-bold text-[#F1F2FF] mb-4 text-center">
          Pay Subscription
        </h1>

        <form onSubmit={handlePayment} className="space-y-4">

          {/* Flat Select */}
          <div>
            <label className="block text-sm text-[#AFB2BF] mb-1">
              Select Flat
            </label>
            <select
              required
              value={formData.flat_id}
              onChange={(e) =>
                setFormData({ ...formData, flat_id: e.target.value })
              }
              className="w-full bg-[#000814] border border-[#2C333F] rounded p-2 text-[#F1F2FF]"
            >
              <option value="">Choose a flat</option>
              {flats.map((flat) => (
                <option key={flat.id} value={flat.id}>
                  {flat.flat_number} - {flat.flat_type}
                </option>
              ))}
            </select>
          </div>

          {/* Month & Year */}
          <div className="grid grid-cols-2 gap-3">
            <input
              type="number"
              min="1"
              max="12"
              value={formData.month}
              onChange={(e) =>
                setFormData({ ...formData, month: e.target.value })
              }
              className="bg-[#000814] border border-[#2C333F] rounded p-2 text-[#F1F2FF]"
            />
            <input
              type="number"
              value={formData.year}
              onChange={(e) =>
                setFormData({ ...formData, year: e.target.value })
              }
              className="bg-[#000814] border border-[#2C333F] rounded p-2 text-[#F1F2FF]"
            />
          </div>

          {/* Payment Mode */}
          <div>
            <label className="block text-sm text-[#AFB2BF] mb-1">
              Payment Mode
            </label>
            <select
              value={formData.payment_mode}
              onChange={(e) =>
                setFormData({ ...formData, payment_mode: e.target.value })
              }
              className="w-full bg-[#000814] border border-[#2C333F] rounded p-2 text-[#F1F2FF]"
            >
              <option value="UPI">UPI</option>
              <option value="Card">Card</option>
              <option value="Cash">Cash</option>
            </select>
          </div>

          {error && (
            <p className="text-red-400 text-sm">{error}</p>
          )}

          <button
            disabled={loading || !formData.flat_id}
            className="w-full bg-[#FFD60A] text-[#000814] font-bold py-2 rounded disabled:opacity-50"
          >
            {loading ? "Processing..." : "Process Payment"}
          </button>

        </form>
      </div>

    ) : (

      <div className="w-full max-w-md bg-[#161D29] border border-[#2C333F] rounded-lg p-6 text-center">

        <h2 className="text-xl font-bold text-[#F1F2FF] mb-4">
          Payment Successful
        </h2>

        <div className="space-y-2 text-sm">
          <p>Flat: {successData.flat_number}</p>
          <p>
            Period: {getMonthName(successData.month)} {successData.year}
          </p>
          <p>Mode: {successData.payment_mode}</p>
          <p>Date: {successData.payment_date}</p>
        </div>

        <button
          onClick={() => setSuccessData(null)}
          className="mt-4 bg-[#FFD60A] text-[#000814] px-4 py-2 rounded"
        >
          New Payment
        </button>

      </div>

    )}

  </div>
</div>
  );
}