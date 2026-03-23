"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import StatCard from "@/components/StatCard";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import API from "@/lib/api";

export default function ReportsPage() {

  const months = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December"
  ];

  const [filters, setFilters] = useState({
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
  });

  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState({ csv: false, pdf: false });

  const fetchReport = async () => {
    setLoading(true);
    try {
      const { data } = await API.get("/admin/reports", {
  params: filters
});

      if (data.success) {
        setReport(data.report);
      }
    } catch {
      toast.error("Error loading reports");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, []);

  const handleDownload = async (format) => {
    setDownloading((prev) => ({ ...prev, [format]: true }));
    try {

      const response = await API.get("/admin/reports",
        {
          params: { ...filters, format },
          responseType: "blob",
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `Report_${filters.month}_${filters.year}.${format}`
      );
      document.body.appendChild(link);
      link.click();
      link.remove();

      toast.success(`${format} downloaded`);
    } catch {
      toast.error("Download failed");
    } finally {
      setDownloading((prev) => ({ ...prev, [format]: false }));
    }
  };

  if (loading && !report) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <Loader2 className="animate-spin text-[#FFD60A]" size={40} />
      </div>
    );
  }

  return (
    <div className="p-6 text-[#F1F2FF]">

      {/* Header */}
      <div className="flex flex-wrap gap-3 mb-6">
        <select
          value={filters.month}
          onChange={(e) =>
            setFilters({ ...filters, month: e.target.value })
          }
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
          value={filters.year}
          onChange={(e) =>
            setFilters({ ...filters, year: e.target.value })
          }
          className="bg-[#000814] border border-[#2C333F] px-3 py-2 w-24"
        />

        <button
          onClick={fetchReport}
          className="bg-[#FFD60A] text-black px-4"
        >
          Generate
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total Flats" value={report?.summary.total_flats} />
        <StatCard label="Paid Units" value={report?.summary.paid_count} />
        <StatCard label="Pending" value={report?.summary.pending_count} />
        <StatCard label="Collected" value={`₹${report?.summary.total_collected}`} />
      </div>

      {/* Payment Mode Table */}
      <div className="bg-[#161D29] border border-[#2C333F] mb-6 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-[#000814] text-[#AFB2BF]">
            <tr>
              <th className="px-4 py-3">Mode</th>
              <th className="px-4 py-3">Count</th>
              <th className="px-4 py-3">Amount</th>
            </tr>
          </thead>
          <tbody>
            {report?.payment_mode_breakdown.map((item, i) => (
              <tr key={i} className="border-t border-[#2C333F]">
                <td className="px-4 py-3">{item.mode}</td>
                <td className="px-4 py-3">{item.count}</td>
                <td className="px-4 py-3">₹{item.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Recent Transactions */}
      <div className="bg-[#161D29] border border-[#2C333F] overflow-x-auto">
        <div className="p-4 flex gap-2">
          <button
            onClick={() => handleDownload("csv")}
            className="bg-[#000814] border border-[#2C333F] px-3 py-1"
          >
            CSV
          </button>
          <button
            onClick={() => handleDownload("pdf")}
            className="bg-[#000814] border border-[#2C333F] px-3 py-1"
          >
            PDF
          </button>
        </div>

        <table className="w-full text-left text-sm">
          <thead className="bg-[#000814] text-[#AFB2BF]">
            <tr>
              <th className="px-4 py-3">Flat</th>
              <th className="px-4 py-3">Owner</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Mode</th>
              <th className="px-4 py-3">Date</th>
            </tr>
          </thead>
          <tbody>
            {report?.recent_transactions.map((t) => (
              <tr key={t.id} className="border-t border-[#2C333F]">
                <td className="px-4 py-3">{t.flat_number}</td>
                <td className="px-4 py-3">{t.owner_name}</td>
                <td className="px-4 py-3">₹{t.amount}</td>
                <td className="px-4 py-3">{t.payment_mode}</td>
                <td className="px-4 py-3">
                  {new Date(t.created_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}
