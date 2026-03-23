"use client";

import React, { useEffect, useState } from "react";
import API from "@/lib/api";
import { Home, AlertCircle, Clock, Bell, ArrowUpRight, Loader2 } from "lucide-react";
import StatCard from "@/components/StatCard";

export default function ResidentDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

const [lastNotifId, setLastNotifId] = useState(null);
const [initialLoaded, setInitialLoaded] = useState(false);

useEffect(() => {
  const fetchDashboardData = async () => {
    console.log("Polling dashboard...");

    try {
      const response = await API.get("/resident/dashboard");

      if (response.data.success) {
        const dashboard = response.data.dashboard;
        const notifications = dashboard.notifications;

        console.log("Notifications:", notifications);

        if (notifications.length > 0) {
          const latestId = notifications[0].id;
          console.log("Latest ID:", latestId);
          console.log("Old ID:", lastNotifId);

          if (initialLoaded && lastNotifId && latestId !== lastNotifId) {
            console.log("NEW NOTIFICATION DETECTED");
            alert("New notification received");
          }

          setLastNotifId(latestId);
        }

        setData(dashboard);
        setInitialLoaded(true);
      }
    } catch (err) {
      console.log(err);
      setError("Failed to load dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  fetchDashboardData();
  const interval = setInterval(fetchDashboardData, 5000);

  return () => clearInterval(interval);
}, [lastNotifId, initialLoaded]);

  if (loading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <Loader2 className="animate-spin text-[#FFD60A]" size={40} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-[70vh] items-center justify-center text-red-400">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#F1F2FF]">
          Resident Dashboard
        </h1>
        <p className="text-[#AFB2BF] text-sm">
          Overview of your flats and subscriptions
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <StatCard 
          label="Total Registered Flats" 
          value={data?.total_flats || 0} 
          icon={<Home size={24} className="text-[#FFD60A]" />} 
        />
        <StatCard 
          label="Pending Amount" 
          value={`₹${data?.pending_amount || 0}`} 
          icon={<AlertCircle size={24} className="text-red-400" />} 
        />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">

          {/* Current Month Status */}
          <div className="bg-[#161D29] rounded-lg border border-[#2C333F] p-5">
            <h3 className="text-lg font-semibold mb-4 text-[#F1F2FF]">
              Current Month Status
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data?.current_month_status?.map((item, index) => (
                <div key={index} className="bg-[#000814] p-4 rounded border border-[#2C333F] flex justify-between">
                  <div>
                    <p className="text-sm text-[#AFB2BF]">
                      Flat {item.flat_number}
                    </p>
                    <p className="text-lg font-bold text-[#F1F2FF]">
                      ₹{item.amount}
                    </p>
                  </div>
                  <span className={`text-sm ${
                    item.status === 'pending' ? 'text-red-400' : 'text-green-400'
                  }`}>
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
          

          {/* Recent Payments */}
          <div className="bg-[#161D29] rounded-lg border border-[#2C333F]">
            <div className="p-4 border-b border-[#2C333F] flex justify-between">
              <h3 className="text-lg font-semibold text-[#F1F2FF]">
                Recent Payments
              </h3>
              <button className="text-[#FFD60A] text-sm">
                View All
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-[#000814] text-[#AFB2BF]">
                  <tr>
                    <th className="px-4 py-3">Flat</th>
                    <th className="px-4 py-3">Amount</th>
                    <th className="px-4 py-3">Mode</th>
                    <th className="px-4 py-3">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.recent_payments?.map((payment, idx) => (
                    <tr key={idx} className="border-t border-[#2C333F]">
                      <td className="px-4 py-3 text-[#F1F2FF]">{payment.flat_number}</td>
                      <td className="px-4 py-3 text-[#FFD60A] font-semibold">
                        ₹{payment.amount}
                      </td>
                      <td className="px-4 py-3 text-[#AFB2BF]">
                        {payment.payment_mode}
                      </td>
                      <td className="px-4 py-3 text-[#AFB2BF]">
                        {payment.created_at}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-[#161D29] rounded-lg border border-[#2C333F] p-5">
          <h3 className="text-lg font-semibold mb-4 text-[#F1F2FF]">
            Notifications
          </h3>

          <div className="space-y-3">
            {data?.notifications?.length > 0 ? (
              data.notifications.map((note, index) => (
                <div key={index} className="p-3 rounded bg-[#000814] border border-[#2C333F]">
                  <p className="font-semibold text-sm text-[#F1F2FF]">{note.title}</p>
                  <p className="text-xs text-[#AFB2BF]">{note.message}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-[#AFB2BF] text-center">
                No new notifications
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

