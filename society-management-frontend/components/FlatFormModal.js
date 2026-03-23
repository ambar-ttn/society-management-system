import { useState } from "react";
import API from "@/lib/api";
import toast from "react-hot-toast";

export default function FlatFormModal({ flat, onClose, refresh }) {
  const [formData, setFormData] = useState(
    flat || {
      flat_number: "",
      owner_name: "",
      owner_email: "",
      phone: "",
      flat_type: "2BHK",
    }
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (flat) {
        await API.put(`/admin/flats/${flat.id}`, formData);
        toast.success("Flat updated successfully");
      } else {
        await API.post("/admin/flats", formData);
        toast.success("Flat added successfully");
      }

      refresh();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Operation failed");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center">

      <div className="bg-[#161D29] border border-[#2C333F] p-6 w-[350px]">

        <h2 className="text-lg font-bold text-[#F1F2FF] mb-4">
          {flat ? "Edit Flat" : "Add Flat"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-3">

          <input
            placeholder="Flat Number"
            value={formData.flat_number}
            onChange={(e) =>
              setFormData({ ...formData, flat_number: e.target.value })
            }
            className="w-full p-2 bg-[#000814] border border-[#2C333F]"
            required
          />

          <input
            placeholder="Owner Name"
            value={formData.owner_name}
            onChange={(e) =>
              setFormData({ ...formData, owner_name: e.target.value })
            }
            className="w-full p-2 bg-[#000814] border border-[#2C333F]"
            required
          />

          <input
            placeholder="Owner Email"
            type="email"
            value={formData.owner_email}
            onChange={(e) =>
              setFormData({ ...formData, owner_email: e.target.value })
            }
            className="w-full p-2 bg-[#000814] border border-[#2C333F]"
            required
          />

          <input
            placeholder="Phone"
            value={formData.phone}
            onChange={(e) =>
              setFormData({ ...formData, phone: e.target.value })
            }
            className="w-full p-2 bg-[#000814] border border-[#2C333F]"
            required
          />

          <select
            value={formData.flat_type}
            onChange={(e) =>
              setFormData({ ...formData, flat_type: e.target.value })
            }
            className="w-full p-2 bg-[#000814] border border-[#2C333F]"
          >
            <option>1BHK</option>
            <option>2BHK</option>
            <option>3BHK</option>
            <option>4BHK</option>
          </select>

          <div className="flex gap-2 mt-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-[#2C333F] py-1"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="flex-1 bg-[#FFD60A] text-black py-1"
            >
              Save
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}