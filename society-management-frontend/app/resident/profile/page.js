"use client";

import { useEffect, useState } from "react";
import API from "@/lib/api";
import { Loader2, User, Calendar, Phone, Info, Lock, Save } from "lucide-react";

export default function AdminProfile() {
  const [profile, setProfile] = useState({
    gender: "",
    date_of_birth: "",
    contact_number: "",
    about: "",
    password: "",
    confirmPassword: ""
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await API.get("/profile");
      const data = res.data;
      
      setProfile({
        gender: data.profile.gender || "",
        about: data.profile.about || "",
        contact_number: data.profile.contact_number || "",
        date_of_birth: data.profile.date_of_birth ? data.profile.date_of_birth.split("T")[0] : "",
        password: "",
        confirmPassword: ""
      });
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (profile.password !== profile.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    
    try {
      setSaving(true);
      const res = await API.put("/profile", profile);
      alert(res.data.message);
      setProfile({
        ...profile,
        password: "",
        confirmPassword: ""
      });
    } catch (err) {
      console.log(err);
      alert("Update failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <Loader2 className="animate-spin text-[#FFD60A]" size={40} />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-5">
        <h1 className="text-xl sm:text-2xl font-bold text-[#F1F2FF]">
          Resident Profile
        </h1>
        <p className="text-[#AFB2BF] text-sm">
          Manage your personal information
        </p>
      </div>

      {/* Profile Form */}
      <div className="bg-[#161D29] border border-[#2C333F] rounded-xl p-5">
        
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Personal Information */}
          <div>
            <h2 className="font-semibold text-[#F1F2FF] mb-3 flex items-center gap-2">
              <User size={16} className="text-[#FFD60A]" />
              Personal Information
            </h2>
            
            <div className="space-y-3">
              {/* Gender */}
              <div>
                <label className="block text-[#AFB2BF] text-xs mb-1">Gender</label>
                <select
                  name="gender"
                  value={profile.gender}
                  onChange={handleChange}
                  className="w-full px-3 py-1.5 bg-[#000814] border border-[#2C333F] rounded-lg text-[#F1F2FF] text-sm focus:outline-none focus:border-[#FFD60A]"
                >
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Date of Birth */}
              <div>
                <label className="block text-[#AFB2BF] text-xs mb-1 flex items-center gap-1">
                  <Calendar size={12} />
                  Date of Birth
                </label>
                <input
                  type="date"
                  name="date_of_birth"
                  value={profile.date_of_birth}
                  onChange={handleChange}
                  className="w-full px-3 py-1.5 bg-[#000814] border border-[#2C333F] rounded-lg text-[#F1F2FF] text-sm focus:outline-none focus:border-[#FFD60A]"
                />
              </div>

              {/* Contact Number */}
              <div>
                <label className="block text-[#AFB2BF] text-xs mb-1 flex items-center gap-1">
                  <Phone size={12} />
                  Contact Number
                </label>
                <input
                  type="tel"
                  name="contact_number"
                  value={profile.contact_number}
                  onChange={handleChange}
                  placeholder="Enter contact number"
                  className="w-full px-3 py-1.5 bg-[#000814] border border-[#2C333F] rounded-lg text-[#F1F2FF] text-sm placeholder:text-[#AFB2BF] focus:outline-none focus:border-[#FFD60A]"
                />
              </div>

              {/* About */}
              <div>
                <label className="block text-[#AFB2BF] text-xs mb-1 flex items-center gap-1">
                  <Info size={12} />
                  About
                </label>
                <textarea
                  name="about"
                  value={profile.about}
                  onChange={handleChange}
                  rows={2}
                  placeholder="Tell about yourself"
                  className="w-full px-3 py-1.5 bg-[#000814] border border-[#2C333F] rounded-lg text-[#F1F2FF] text-sm resize-none focus:outline-none focus:border-[#FFD60A]"
                />
              </div>
            </div>
          </div>

          <hr className="border-[#2C333F] my-2" />

          {/* Change Password */}
          <div>
            <h2 className="text-base font-semibold text-[#F1F2FF] mb-3 flex items-center gap-2">
              <Lock size={16} className="text-[#FFD60A]" />
              Change Password
            </h2>
            
            <div className="space-y-3">
              <input
                type="password"
                name="password"
                placeholder="New Password"
                value={profile.password}
                onChange={handleChange}
                className="w-full px-3 py-1.5 bg-[#000814] border border-[#2C333F] rounded-lg text-[#F1F2FF] text-sm placeholder:text-[#AFB2BF] focus:outline-none focus:border-[#FFD60A]"
              />
              
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={profile.confirmPassword}
                onChange={handleChange}
                className="w-full px-3 py-1.5 bg-[#000814] border border-[#2C333F] rounded-lg text-[#F1F2FF] text-sm placeholder:text-[#AFB2BF] focus:outline-none focus:border-[#FFD60A]"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={saving}
            className="w-full bg-[#FFD60A] hover:bg-[#FFD60A]/90 text-[#000814] font-medium py-2 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm disabled:opacity-50 mt-4"
          >
            {saving ? (
              <>
                <Loader2 className="animate-spin" size={16} />
                Updating...
              </>
            ) : (
              <>
                <Save size={16} />
                Update Profile
              </>
            )}
          </button>
          
        </form>
      </div>
    </div>
  );
}