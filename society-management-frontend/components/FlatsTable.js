import { Edit, Trash2 } from "lucide-react";

export default function FlatsTable({ data, onEdit, onDelete }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">

        <thead className="bg-[#000814] text-[#AFB2BF]">
          <tr>
            <th className="px-4 py-3">Flat Number</th>
            <th className="px-4 py-3">Owner Id</th>
            <th className="px-4 py-3">Phone</th>
            <th className="px-4 py-3">Flat Type</th>
            <th className="px-4 py-3 text-center">Actions</th>
          </tr>
        </thead>

        <tbody>
          {data.length > 0 ? (
            data.map((flat) => (
              <tr key={flat.id} className="border-t border-[#2C333F]">

                <td className="px-4 py-3 text-[#F1F2FF]">
                  {flat.flat_number}
                </td>

                <td className="px-4 py-3 text-[#AFB2BF]">
                  {flat.owner_id}
                </td>

                <td className="px-4 py-3 text-[#AFB2BF]">
                  {flat.phone}
                </td>

                <td className="px-4 py-3 text-[#F1F2FF]">
                  {flat.flat_type}
                </td>

                <td className="px-4 py-3">
                  <div className="flex justify-center gap-3">
                    <button onClick={() => onEdit(flat)}>
                      <Edit size={16} />
                    </button>
                    <button onClick={() => onDelete(flat)}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>

              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="px-4 py-6 text-center text-[#AFB2BF]">
                No flats found
              </td>
            </tr>
          )}
        </tbody>

      </table>
    </div>
  );
}