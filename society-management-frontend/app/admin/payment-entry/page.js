"use client";

import { useState, useEffect } from "react";
import API from "@/lib/api";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";

export default function PaymentEntryPage() {
  const [flats, setFlats] = useState([]);
  const [loadingFlats, setLoadingFlats] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    flat_id: "",
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    amount: "",
    payment_mode: "Cash",
  });

  const months = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December"
  ];

  // Fetch Flats
  useEffect(() => {
    const fetchFlats = async () => {
      try {
        const res = await API.get("/admin/flats");
        if (res.data.success) {
          setFlats(res.data.flats);
        }
      } catch {
        toast.error("Failed to load flats");
      } finally {
        setLoadingFlats(false);
      }
    };

    fetchFlats();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const payload = {
        flat_id: Number(formData.flat_id),
        month: Number(formData.month),
        year: Number(formData.year),
        amount: Number(formData.amount),
        payment_mode: formData.payment_mode,
      };

      const res = await API.post("/admin/payments", payload);

      if (res.data.success) {
        toast.success("Payment recorded");
        setFormData({
          flat_id: "",
          month: new Date().getMonth() + 1,
          year: new Date().getFullYear(),
          amount: "",
          payment_mode: "Cash",
        });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Error recording payment");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">

      <h1 className="text-2xl font-bold text-[#F1F2FF] mb-4">
        Manual Payment Entry
      </h1>

      <div className="bg-[#161D29] border border-[#2C333F] p-5">

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Flat */}
          <select
            name="flat_id"
            value={formData.flat_id}
            onChange={handleChange}
            className="w-full bg-[#000814] border border-[#2C333F] px-3 py-2"
            required
            disabled={loadingFlats}
          >
            <option value="">
              {loadingFlats ? "Loading flats..." : "Select Flat"}
            </option>
            {flats.map((flat) => (
              <option key={flat.id} value={flat.id}>
                Flat {flat.flat_number} - {flat.owner_name}
              </option>
            ))}
          </select>

          {/* Amount */}
          <input
            type="number"
            name="amount"
            placeholder="Amount"
            value={formData.amount}
            onChange={handleChange}
            className="w-full bg-[#000814] border border-[#2C333F] px-3 py-2"
            required
          />

          {/* Month + Year */}
          <div className="grid grid-cols-2 gap-3">
            <select
              name="month"
              value={formData.month}
              onChange={handleChange}
              className="bg-[#000814] border border-[#2C333F] px-3 py-2"
            >
              {months.map((m, i) => (
                <option key={i} value={i + 1}>
                  {m}
                </option>
              ))}
            </select>

            <input
              type="number"
              name="year"
              value={formData.year}
              onChange={handleChange}
              className="bg-[#000814] border border-[#2C333F] px-3 py-2"
            />
          </div>

          {/* Payment Mode */}
          <select
            name="payment_mode"
            value={formData.payment_mode}
            onChange={handleChange}
            className="w-full bg-[#000814] border border-[#2C333F] px-3 py-2"
          >
            <option value="Cash">Cash</option>
            <option value="UPI">UPI</option>
            <option value="Bank Transfer">Bank Transfer</option>
            <option value="Cheque">Cheque</option>
          </select>

          {/* Submit */}
          <button
            type="submit"
            disabled={submitting || loadingFlats}
            className="w-full bg-[#FFD60A] text-black py-2"
          >
            {submitting ? "Recording..." : "Record Payment"}
          </button>

        </form>
      </div>
    </div>
  );
}