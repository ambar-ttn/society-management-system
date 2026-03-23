import API from "@/lib/api";
import toast from "react-hot-toast";

export default function DeleteConfirmModal({ flat, onClose, refresh }) {

  const handleDelete = async () => {
    try {
      await API.delete(`/admin/flats/${flat.id}`);

      toast.success("Flat deleted successfully");
      refresh();
      onClose();

    } catch (err) {
      toast.error(
        err.response?.data?.message ||
        "Cannot delete flat with existing payments."
      );
    }
  };
// takes entire width of the page 
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center">

      <div className="bg-[#161D29] border border-[#2C333F] p-6 w-[300px]">

        <h3 className="text-lg font-bold text-[#F1F2FF] mb-3">
          Delete Flat
        </h3>

        <p className="text-[#AFB2BF] text-sm mb-4">
          Are you sure you want to delete flat{" "}
          <span className="text-[#FFD60A]">
            {flat?.flat_number}
          </span>?
        </p>

        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 border border-[#2C333F] py-1"
          >
            Cancel
          </button>

          <button
            onClick={handleDelete}
            className="flex-1 bg-red-500 text-white py-1"
          >
            Delete
          </button>
        </div>

      </div>
    </div>
  );
}