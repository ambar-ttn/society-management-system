"use client";

import { useEffect, useState } from "react";
import API from "@/lib/api";
import toast, { Toaster } from "react-hot-toast";
import { Loader2 } from "lucide-react";

export default function MonthlyRecordsPage() {

  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);


  const [page,setPage] = useState(1);
  const [totalPages,setTotalPages] = useState(1);

  const [month, setMonth] = useState("March");
  const [year, setYear] = useState(new Date().getFullYear());

const fetchRecords = async () => {
  try {
    setLoading(true);

   const { data } = await API.get(
  `/admin/monthly-records?month=${month}&year=${year}&page=${page}`
  
);

  if (data.success) {
    console.log(data.records);

  setRecords(data.records);
  setTotalPages(data.totalPages);
}
  } catch (err) {
    toast.error("Failed to load records");
  } finally {
    setLoading(false);
  }
};
useEffect(() => {
  fetchRecords();
}, [month, year, page]);
  const markPaid = async (id) => {
    try {

      await API.put(`/admin/monthly-records/${id}`, {
        status: "paid"
      });

      toast.success("Payment marked as paid");

      fetchRecords();

    } catch (err) {

      toast.error("Update failed");

    }
  };

return (

  <div className="p-8 text-richgrey-5">

<Toaster position="top-right" />

<h1 className="text-3xl font-bold mb-6">
  Monthly Subscription Records
</h1>

{/* Filters */}
<div className="flex gap-4 mb-6">

  <select
    value={month}
    onChange={(e)=>{
      setMonth(e.target.value);
      setPage(1);
    }}
    className="bg-richblack-800 border border-white/10 px-4 py-2 rounded-md"
  >
    {[
      "January","February","March","April","May","June",
      "July","August","September","October","November","December"
    ].map((m)=>(
      <option key={m}>{m}</option>
    ))}
  </select>

  <select
    value={year}
    onChange={(e)=>{
      setYear(e.target.value);
      setPage(1);
    }}
    className="bg-richblack-800 border border-white/10 px-4 py-2 rounded-md"
  >
    {[2024,2025,2026,2027].map((y)=>(
      <option key={y}>{y}</option>
    ))}
  </select>

</div>


{loading ? (

  <div className="flex justify-center items-center h-64">
    <Loader2 className="animate-spin text-[#FFD60A]" size={40} />
  </div>

) : (

  <>
    <div className="bg-richblack-800 border border-white/10 rounded-xl overflow-hidden">

      <table className="w-full">

        <thead className="bg-richblack-900 text-left">
          <tr>
            <th className="p-4">Flat</th>
            <th className="p-4">Type</th>
            <th className="p-4">Month</th>
            <th className="p-4">Amount</th>
            <th className="p-4">Status</th>
            <th className="p-4">Action</th>
          </tr>
        </thead>

        <tbody>

          {records.length > 0 ? (
            records.map((rec)=>(
              <tr key={rec.id} className="border-t border-white/10">

                <td className="p-4 font-semibold">
                  {rec.flat_number}
                </td>

                <td className="p-4">
                  {rec.flat_type}
                </td>

                <td className="p-4">
                  {rec.month}
                </td>

                <td className="p-4 text-yellow-50 font-semibold">
                  ₹{rec.amount}
                </td>

                <td className="p-4">

                  {rec.status.toLowerCase() === "paid" ? (
                    <span className="text-green-400 font-semibold">
                      Paid
                    </span>
                  ) : (
                    <span className="text-red-400 font-semibold">
                      Pending
                    </span>
                  )}

                </td>

                <td className="p-4">

                  {rec.status?.trim().toLowerCase() === "pending" && (
                    <button
                      onClick={()=>markPaid(rec.id)}
                      className="bg-yellow-50 text-black px-4 py-1 rounded-md font-semibold hover:scale-95 transition"
                    >
                      Mark Paid
                    </button>
                  )}

                </td>

              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="p-10 text-center text-richgrey-200">
                No records found
              </td>
            </tr>
          )}

        </tbody>

      </table>

    </div>


    {/* Pagination */}
    <div className="flex justify-center items-center gap-4 mt-4">

      <button
        disabled={page === 1}
        onClick={()=>setPage(page-1)}
        className="px-4 py-2 border border-white/10 rounded-md disabled:opacity-40"
      >
        Prev
      </button>

      <span className="text-sm text-richgrey-200">
        Page {page} of {totalPages}
      </span>

      <button
        disabled={page === totalPages}
        onClick={()=>setPage(page+1)}
        className="px-4 py-2 border border-white/10 rounded-md disabled:opacity-40"
      >
        Next
      </button>

    </div>

  </>
)}

  </div>
)}
