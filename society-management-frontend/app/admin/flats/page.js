"use client";

import { useState, useEffect } from "react";
import API from "@/lib/api";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";
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
    } catch {
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
      flat.owner_id.toString().includes(searchQuery)
  );

  return (
    <div className="p-6">

      {/* Header */}
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">Manage Flats</h1>

        <button
          onClick={() => {
            setSelectedFlat(null);
            setIsFormOpen(true);
          }}
          className="bg-yellow-400 px-4 py-2"
        >
          Add Flat
        </button>
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="Search Flat..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="border p-2 mb-4 w-full"
      />

      {/* Table */}
      {loading ? (
        <div className="flex justify-center">
          <Loader2 className="animate-spin" />
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

          {/* Pagination */}
          <div className="flex justify-center gap-2 mt-4">
            <button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className="border px-3 py-1"
            >
              Prev
            </button>

            <span>{page} / {pages}</span>

            <button
              disabled={page === pages}
              onClick={() => setPage(page + 1)}
              className="border px-3 py-1"
            >
              Next
            </button>
          </div>
        </>
      )}

      {/* Modals */}
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