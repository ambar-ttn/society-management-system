"use client";
import { useState, useEffect } from "react";
import API from "@/lib/api";
import { Plus, Search, Loader2 } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import FlatsTable from "@/components/FlatsTable";
import FlatFormModal from "@/components/FlatFormModal";
import DeleteConfirmModal from "@/components/DeleteConfirmModal";


export default function FlatsPage() {

  const [flats, setFlats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedFlat, setSelectedFlat] = useState(null);

  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const limit = 10;


  const fetchFlats = async () => {
    try {
      setLoading(true);

      const { data } = await API.get(`/admin/flats?page=${page}&limit=${limit}`);

      if (data.success) {
        setFlats(data.flats);
        setPages(data.pages);
      }

    } catch (err) {
      toast.error("Failed to fetch flats");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFlats();
  }, [page]);

  const filteredFlats = flats.filter(
    (flat) =>
      flat.flat_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      flat.owner_id.toString().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-richblack-900 p-8 text-richgrey-5">

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Manage Flats</h1>
          <p className="text-richgrey-100 text-sm mt-1">
            View and manage all society residents
          </p>
        </div>

        <button
          onClick={() => {
            setSelectedFlat(null);
            setIsFormOpen(true);
          }}
          className="flex items-center gap-2 bg-yellow-50 text-black px-5 py-2.5 rounded-md font-semibold hover:scale-95 transition-all"
        >
          <Plus size={20} /> Add Flat
        </button>
      </div>

      <div className="bg-richblack-800 rounded-xl border border-white/10 overflow-hidden">

        {/* Search Bar */}
        <div className="p-4 border-b border-white/10">
          <div className="relative max-w-md">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-richgrey-200"
              size={18}
            />
            <input
              type="text"
              placeholder="Search by Flat No or Owner..."
              className="w-full bg-richblack-900 border border-white/10 rounded-lg py-2 pl-10 pr-4 outline-none focus:border-yellow-50 transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="animate-spin text-yellow-50" size={40} />
          </div>
        ) : (
          <>
            <FlatsTable
              data={filteredFlats}
              onEdit={(flat) => {
                setSelectedFlat(flat);
                setIsFormOpen(true);
              }}
              onDelete={(flat) => {
                setSelectedFlat(flat);
                setIsDeleteOpen(true);
              }}
            />

            {/* PAGINATION */}
            <div className="flex justify-center gap-2 p-4">

              <button
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
                className="px-3 py-1 bg-richblack-700 rounded disabled:opacity-40"
              >
                Prev
              </button>

              {[...Array(pages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={`px-3 py-1 rounded ${
                    page === i + 1
                      ? "bg-yellow-50 text-black"
                      : "bg-richblack-700"
                  }`}
                >
                  {i + 1}
                </button>
              ))}

              <button
                disabled={page === pages}
                onClick={() => setPage(page + 1)}
                className="px-3 py-1 bg-richblack-700 rounded disabled:opacity-40"
              >
                Next
              </button>

            </div>
          </>
        )}
      </div>

      {isFormOpen && (
        <FlatFormModal
          flat={selectedFlat}
          onClose={() => setIsFormOpen(false)}
          refresh={fetchFlats}
        />
      )}

      {isDeleteOpen && (
        <DeleteConfirmModal
          flat={selectedFlat}
          onClose={() => setIsDeleteOpen(false)}
          refresh={fetchFlats}
        />
      )}
    </div>
  );
}