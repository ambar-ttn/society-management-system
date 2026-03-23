"use client";

import { useState, useEffect } from "react";
import API from "@/lib/api";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";

export default function NotificationsPage() {
  const [formData, setFormData] = useState({
    title: "",
    message: "",
    recipientType: "all",
    user_id: "",
  });

  const [users, setUsers] = useState([]);
  const [history, setHistory] = useState([]);

  const [loading, setLoading] = useState({
    users: false,
    history: true,
    sending: false,
  });

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);


  const fetchUsers = async () => {
    setLoading((prev) => ({ ...prev, users: true }));
    try {
      const { data } = await API.get("/admin/users");
      setUsers(data.users || []);
    } catch {
      toast.error("Failed to fetch users");
    } finally {
      setLoading((prev) => ({ ...prev, users: false }));
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);





  const fetchHistory = async (currentPage = 1) => {
    setLoading((prev) => ({ ...prev, history: true }));
    try {
      const { data } = await API.get(
        `/admin/notifications?page=${currentPage}`
      );

      if (data.success) {
        setHistory(data.notifications);
        setPage(data.currentPage);
        setTotalPages(data.totalPages);
      }
    } catch {
      toast.error("Failed to load history");
    } finally {
      setLoading((prev) => ({ ...prev, history: false }));
    }
  };

  useEffect(() => {
    fetchHistory(page);
  }, [page]);


  const handleSend = async (e) => {
    e.preventDefault();

    if (formData.recipientType === "specific" && !formData.user_id) {
      return toast.error("Select a user");
    }

    setLoading((prev) => ({ ...prev, sending: true }));

    try {
      const payload = {
        title: formData.title,
        message: formData.message,
        ...(formData.recipientType === "specific" && {
          user_id: Number(formData.user_id),
        }),
      };

      await API.post("/admin/notifications", payload);

      toast.success("Notification sent");

      setFormData({
        title: "",
        message: "",
        recipientType: "all",
        user_id: "",
      });

      fetchHistory();
    } catch (err) {
      toast.error(err.response?.data?.message || "Error sending");
    } finally {
      setLoading((prev) => ({ ...prev, sending: false }));
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">

      <h1 className="text-2xl font-bold text-[#F1F2FF] mb-4">
        Notifications
      </h1>

      {/* FLEX COLUMN LAYOUT */}
      <div className="flex flex-col gap-6">

        {/* Send Notification */}
        <div className="bg-[#161D29] border border-[#2C333F] p-5">
          <form onSubmit={handleSend} className="space-y-4">

            <select
              value={formData.recipientType}
              onChange={(e) =>
                setFormData({ ...formData, recipientType: e.target.value })
              }
              className="w-full bg-[#000814] border border-[#2C333F] px-3 py-2"
            >
              <option value="all">All Residents</option>
              <option value="specific">Specific User</option>
            </select>

            {formData.recipientType === "specific" && (
              <select
                value={formData.user_id}
                onChange={(e) =>
                  setFormData({ ...formData, user_id: e.target.value })
                }
                className="w-full bg-[#000814] border border-[#2C333F] px-3 py-2"
              >
                <option value="">Select User</option>
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name} - {u.email}
                  </option>
                ))}
              </select>
            )}

            <input
              type="text"
              placeholder="Title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="w-full bg-[#000814] border border-[#2C333F] px-3 py-2"
              required
            />

            <textarea
              rows="4"
              placeholder="Message"
              value={formData.message}
              onChange={(e) =>
                setFormData({ ...formData, message: e.target.value })
              }
              className="w-full bg-[#000814] border border-[#2C333F] px-3 py-2"
              required
            />

            <button
              type="submit"
              disabled={loading.sending}
              className="w-full bg-[#FFD60A] text-black py-2"
            >
              {loading.sending ? "Sending..." : "Send Notification"}
            </button>

          </form>
        </div>

        {/* History */}
        <div className="bg-[#161D29] border border-[#2C333F]">

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#000814] text-[#AFB2BF]">
                <tr>
                  <th className="px-3 py-2">Recipient</th>
                  <th className="px-3 py-2">Message</th>
                  <th className="px-3 py-2 text-right">Date</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-[#2C333F]">
                {loading.history ? (
                  <tr>
                    <td colSpan="3" className="p-6 text-center">
                      <Loader2 className="animate-spin mx-auto text-[#FFD60A]" />
                    </td>
                  </tr>
                ) : history.length > 0 ? (
                  history.map((note) => (
                    <tr key={note.id}>
                      <td className="px-3 py-2">
                        {note.user_name || "All Residents"}
                      </td>
                      <td className="px-3 py-2">
                        <b>{note.title}</b>
                        <div className="text-xs text-[#AFB2BF]">
                          {note.message}
                        </div>
                      </td>
                      <td className="px-3 py-2 text-right text-xs">
                        {new Date(note.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="p-6 text-center">
                      No notifications
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-between p-3 border-t border-[#2C333F]">
            <span className="text-sm">
              Page {page} / {totalPages}
            </span>

            <div className="flex gap-2">
              <button
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
                className="px-3 py-1 border border-[#2C333F]"
              >
                Prev
              </button>

              <button
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
                className="px-3 py-1 border border-[#2C333F]"
              >
                Next
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}