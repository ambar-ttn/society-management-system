"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Users, IndianRupee, Clock, TrendingUp, Loader2 } from "lucide-react";
import StatCard from "@/components/StatCard";
import PaymentsTable from "@/components/PaymentsTable";
import API from "@/lib/api";

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState(null); 

  const monthNames = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

  const years = [
    ...new Set(data?.monthly_trend?.map((item) => item.year)),
  ];
// got the unique years here 

const chartData =
  data?.monthly_trend
    ?.filter((item) =>  item.year === selectedYear)
    ?.sort((a, b) => a.month - b.month) 
    ?.map((item) => ({
      label: monthNames[item.month - 1],
      total: item.total,
    })) || [];

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await API.get("/admin/dashboard");
        setData(response.data.dashboard);

      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  //  default latest year select
  useEffect(() => {
    if (data?.monthly_trend) {
      const latestYear = Math.max(
        ...data.monthly_trend.map((item) => item.year)
      );
      setSelectedYear(latestYear);
    }
  }, [data]);

  if (loading)
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="animate-spin text-[#FFD60A]" size={48} />
      </div>
    );

  return (
  <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6">

    {/* Header */}
    <div>
      <h1 className="text-2xl font-bold text-[#F1F2FF]">
        Society Overview
      </h1>
      <p className="text-[#AFB2BF]">
        Welcome back, Admin.
      </p>
    </div>

    {/* Stat Cards */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        label="Total Flats"
        value={data?.total_flats}
        icon={<Users className="text-[#FFD60A]" />}
      />
      <StatCard
        label="Total Collected"
        value={`₹${data?.total_collected?.toLocaleString()}`}
        icon={<IndianRupee className="text-[#FFD60A]" />}
      />
      <StatCard
        label="Pending Payments"
        value={data?.pending_payments}
        icon={<Clock className="text-red-400" />}
      />
      <StatCard
        label="Current Month"
        value={`₹${data?.current_month?.toLocaleString()}`}
        icon={<TrendingUp className="text-green-400" />}
      />
    </div>

    {/* Monthly Trend Chart */}
    <div className="bg-[#161D29] border border-[#2C333F] p-4">

      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-[#F1F2FF]">
          Monthly Trend
        </h3>

        <select
          value={selectedYear || ""}
          onChange={(e) => setSelectedYear(Number(e.target.value))}
          className="p-2 bg-[#000814] text-white border border-[#2C333F]"
        >
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>

      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid stroke="#2C333F" vertical={false} />
            <XAxis dataKey="label" stroke="#AFB2BF" />
            <YAxis stroke="#AFB2BF" />
            <Tooltip />
            <Bar dataKey="total" fill="#FFD60A" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>

    {/* Recent Payments */}
    <div className="bg-[#161D29] border border-[#2C333F] p-4">
      <h3 className="mb-4 font-semibold text-[#F1F2FF]">
        Recent Payments
      </h3>
      <PaymentsTable payments={data?.recent_payments || []} />
    </div>

  </div>
);
}

// stroke is for color of the line stroke = line ka color

/* 
barchart expects this type data 

const chartData = [
  { label: "Jan", total: 100 },
  { label: "Feb", total: 200 },
  { label: "Mar", total: 150 }
];


*/