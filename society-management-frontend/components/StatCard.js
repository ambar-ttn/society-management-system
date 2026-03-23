export default function StatCard({ label, value, icon }) {
  return (
    <div className="bg-[#161D29] p-6 rounded-xl border border-[#2C333F]">
      
      <div className="mb-4">
        <div className="p-2 rounded-lg">
          {icon}
        </div>
      </div>

      <div>
        <p className="text-[#AFB2BF] text-sm">{label}</p>
        <h2 className="text-3xl font-bold mt-1 text-[#F1F2FF]">{value}</h2>
      </div>

    </div>
  );
}