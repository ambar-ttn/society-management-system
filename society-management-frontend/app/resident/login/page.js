"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { GoogleLogin } from "@react-oauth/google";
import AuthCard from "@/components/AuthCard";
import Link from "next/link";
import API from "@/lib/api";
import { useAuth } from "@/hooks/useAuth"; //


// toast --> used to trigger the events Toaster to show ui

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const router = useRouter();
  const { login} = useAuth(); // YEH USE KARO


  // EMAIL LOGIN
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await API.post("/login", formData);

      if (data.success) {
        login(data.user, data.token);

        toast.success("Login Successful!");
        const role = data.user.role.toLowerCase();

        if (role === "admin") {
          router.push("/admin/dashboard");
        } else {
          router.push("/resident/dashboard");
        }
      }
    } catch (err) {
      console.error("Login Error:", err);
      toast.error(
        err.response?.data?.message || "Login failed. Check credentials."
      );
    } finally {
      setLoading(false);
    }
  };



  /* 
Browser kya karta:

Submit
→ Form submit
→ Page reload
→ Saari React state reset

Isliye React me hum likhte:

e.preventDefault();

Matlab:

Default browser behavior mat karo
Page reload mat karo
Main JS se handle karunga  
  */
  return (
    <AuthCard title="Welcome Back">

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Email */}
        <div>
          <label className="block text-sm text-[#AFB2BF] mb-1">
            Email Address
          </label>
          <input
            required
            type="email"
            placeholder="Enter email address"
            className="w-full bg-[#2C333F] text-white p-3 rounded outline-none"
            value={formData.email || ""}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />
        </div>

        {/* Password */}
        <div className="relative">
          <label className="block text-sm text-[#AFB2BF] mb-1">
            Password
          </label>
          <input
            required
            type={showPassword ? "text" : "password"}
            placeholder="Enter password"
            className="w-full bg-[#2C333F] text-white p-3 rounded-md outline-none"
            value={formData.password || ""}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
          />
          <button
            type="button"
            className="absolute right-3 top-9 text-gray-300 hover:text-white"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        {/* Submit Button */}
        <button
          disabled={loading}
          type="submit"
          className="w-full bg-yellow-400 text-black font-semibold py-3 rounded-md flex justify-center items-center gap-2 hover:bg-yellow-500 transition-all disabled:opacity-50"
        >
          {loading ? <Loader2 className="animate-spin" /> : "Sign In"}
        </button>
      </form>

      {/* Divider */}
      <div className="flex items-center my-5">
        <div className="flex-grow h-[1px] bg-gray-700"></div>
        <span className="mx-3 text-gray-400 text-sm">OR</span>
        <div className="flex-grow h-[1px] bg-gray-700"></div>
      </div>

    

      <p className="text-center text-gray-400 text-sm mt-6">
        Dont have an account?{" "}
        <Link href="/resident/signup" className="text-yellow-400 hover:underline">
          Sign up
        </Link>
      </p>
    </AuthCard>
  );
}

// import API from "@/lib/api";
// import { useRouter } from "next/navigation";
// import { useState } from "react";
// import { useAuth } from "@/hooks/useAuth";

// export default function LoginPage(){
//  const [formData, setFormData] = useState({
//     email: "",
//     password: "",
//   });

// const[showPassword,setShowPassword] =useState(false);
// const[loading,setLoading]=useState(false);
// const {login}=useAuth();


// const router=useRouter() ; 



// async function handleSubmit(e){
//   e.preventDefault();

//   const response = await API.post("/login" , formData);
//   if(response.data.success){
//     const role = response.data.user.role;
//     login(response.data.user,response.data.token)
    
//     if(role==="admin"){
//       router.push("/admin/dashboard");
//     }
//     else {
//       router.push("/resident/dashboard")
//     }
//   }
//   else {
//     router.push("/");
//     return;
//   }

// }

//   return(
//     <div>

//    <form onSubmit={handleSubmit}>
//        <input 
//       type="text"
//       placeholder="Enter your email"
//       required
//       value={formData.email}
//       name="email"
//       onChange={(e)=>setFormData({...formData,email:e.target.value})}
//       />


//        <input 
//       type={showPassword ? "text" : "password"}
//       placeholder="Enter your email"
//       required
//       value={formData.password}
//       name="password"
//       onChange={(e)=>setFormData({...formData,password:e.target.value})}
//       />

//       <button >{loading? "Loading...." :"Submit to login"}</button>
  
//    </form>
//      </div>
//   )

   
// }



