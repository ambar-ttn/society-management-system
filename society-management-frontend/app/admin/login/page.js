"use client";


import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { GoogleLogin } from "@react-oauth/google";
import AuthCard from "@/components/AuthCard";
import Link from "next/link";
import API from "@/lib/api";
import { useAuth } from "@/hooks/useAuth"; 


export default function LoginPage() {

  const [loading, setLoading] = useState(false);
  
  const router = useRouter();
  const { login ,logout} = useAuth();



  const handleGoogleLogin = async (credentialResponse) => {
    try {
      const { data } = await API.post("/google", {
        token: credentialResponse.credential
      });

      if (data.success) {

        login(data.user, data.token);
        toast.success("Google Login Successful!");
        const role = data.user.role.toLowerCase();
        if (role === "admin") {
          router.push("/admin/dashboard");
        } else {
          router.push("/resident/dashboard");
        }
      }
    } catch (error) {
      console.error("Google Login Error:", error);
      toast.error("Google login failed");
    }
  };



  /* 
  ro credentialResponse Google library khud deti hai jab user G
  oogle button se login karta hai. Tumhe manually create nahi karna padta. Main flow explain karta hoon.
  
  */
  return (
    <AuthCard title="Welcome Back">

      {/* GOOGLE LOGIN */}
      <div className="flex justify-center">
        <GoogleLogin
          onSuccess={handleGoogleLogin}
          onError={() => toast.error("Google login failed")}
        />
      </div>

      <p className="text-center text-gray-400 text-sm mt-6">
        Dont have an account?{" "}
       <p>Get permit from db admin</p>
      </p>
    </AuthCard>
  );
}
