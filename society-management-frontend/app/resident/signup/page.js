"use client";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import AuthCard from "@/components/AuthCard";
import Link from "next/link";
import API from "@/lib/api";


export default function SignupPage() {
  const [formData, setFormData] = useState({ name: "", email: "", password: "", role: "resident" });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password.length < 6) {
      return toast.error("Password must be at least 6 characters");
    }

    setLoading(true);
    try {
      const { data } = await API.post("/signup", formData);
      if (data.success) {
        toast.success("Account created! Please login.");
        setTimeout(() => router.push("/resident/login"), 1500);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard title="Create Account">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm text-richgrey-5 mb-1">Full Name</label>
          <input
            required
            type="text"
            className="w-full bg-[#2C333F] text-richgrey-5 p-3 rounded-md outline-none"
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm text-richgrey-5 mb-1">Email</label>
          <input
            required
            type="email"
            className="w-full bg-[#2C333F] text-richgrey-5 p-3 rounded-md outline-none"
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm text-richgrey-5 mb-1">Password</label>
          <input
            required
            type="password"
            className="w-full bg-[#2C333F] text-richgrey-5 p-3 rounded-md outline-none"
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm text-richgrey-5 mb-1">I am a...</label>
          <select
            className="w-full bg-[#2C333F] text-richgrey-5 p-3 rounded-md outline-none appearance-none"
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
          >
            <option value="resident">Resident</option>
          </select>
        </div>

        <button
          disabled={loading}
          type="submit"
          className="w-full bg-yellow-50 text-black font-semibold py-3 rounded-md hover:scale-95 transition-all mt-4"
        >
          {loading ? "Creating..." : "Sign Up"}
        </button>

        <p className="text-center text-richgrey-100 text-sm">
          Already a member?{" "}
          <Link href="/login" className="text-yellow-50">Login</Link>
        </p>
      </form>
    </AuthCard>
  );
}
// if loading button is unclickable