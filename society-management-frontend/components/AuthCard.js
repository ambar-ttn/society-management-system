export default function AuthCard({ title, children }) {
  return (
    <div className="min-h-screen bg-richblack-900 flex items-center justify-center p-4">
      <div className="w-full max-w-[450px] bg-richblack-800 p-8 rounded-xl shadow-2xl border border-white/10">
        <h1 className="text-2xl font-bold text-richgrey-5 mb-2 text-center">
          {title}
        </h1>
        <p className="text-richgrey-100 text-center mb-8 text-sm">
          Society Subscription Management
        </p>
        {children}
      </div>
    </div>
  );
}