"use client";

import { useEffect, useState } from "react";
import API from "@/lib/api";
import toast, { Toaster } from "react-hot-toast";
import { Loader2 } from "lucide-react";

export default function SubscriptionPlansPage() {

  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchPlans = async () => {
    try {

      setLoading(true);

      const { data } = await API.get("/admin/subscription-plans");

      if (data.success) {
        setPlans(data.plans);
      }

    } catch (err) {

      toast.error("Failed to load subscription plans");

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const handleChange = (id, value) => {
    setPlans((prev) =>
      prev.map((plan) =>
        plan.id === id ? { ...plan, monthly_amount: value } : plan
      )
    );
  };

  const handleUpdate = async (plan) => {
    try {

      setUpdatingId(plan.id);

  await API.put(`/admin/subscription-plans/${plan.id}`, {
  flat_type: plan.flat_type,
  monthly_amount: plan.monthly_amount,
});

      toast.success("Plan updated successfully");

      fetchPlans();

    } catch (err) {

      toast.error("Failed to update plan");

    } finally {

      setUpdatingId(null);

    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <Loader2 className="animate-spin text-[#FFD60A]" size={40} />
      </div>
    );
  }

  return (
    <div className="p-8 text-richgrey-5">

      <Toaster position="top-right" />

      <h1 className="text-3xl font-bold mb-6">
        Subscription Plans
      </h1>

      <p className="text-sm text-richgrey-200 mb-4">
        Changes to subscription plans will take effect from the next billing cycle. that is next month
      </p>

      <div className="bg-richblack-800 border border-white/10 rounded-xl overflow-hidden">

        <table className="w-full">

          <thead className="bg-richblack-900">
            <tr className="text-left text-sm">
              <th className="p-4">Flat Type</th>
              <th className="p-4">Monthly Amount (₹)</th>
              <th className="p-4">Action</th>
            </tr>
          </thead>

          <tbody>

            {plans.map((plan) => (

              <tr
                key={plan.id}
                className="border-t border-white/10"
              >

                <td className="p-4 font-semibold">
                  {plan.flat_type}
                </td>

                <td className="p-4">

                  <input
                    type="number"
                    value={plan.monthly_amount}
                    onChange={(e) =>
                      handleChange(plan.id, Number(e.target.value))
                    }
                    className="bg-richblack-900 border border-white/10 rounded-md px-3 py-2 w-40 outline-none focus:border-yellow-50"
                  />

                </td>

                <td className="p-4">

                  <button
                    onClick={() => handleUpdate(plan)}
                    disabled={updatingId === plan.id}
                    className="bg-yellow-50 text-black px-4 py-2 rounded-md font-semibold hover:scale-95 transition-all flex items-center gap-2"
                  >

                    {updatingId === plan.id ? (
                      <Loader2 className="animate-spin" size={16} />
                    ) : (
                      "Update"
                    )}

                  </button>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}// disabled to make it non clickable 