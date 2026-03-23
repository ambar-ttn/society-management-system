export default function PaymentsTable({ payments }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        
        <thead className="border-b border-[#2C333F] text-[#AFB2BF]">
          <tr>
            <th className="px-3 py-2">Flat</th>
            <th className="px-3 py-2 text-right">Amount</th>
          </tr>
        </thead>

        <tbody>
          {payments.map((p, idx) => (
            <tr key={idx} className="border-t border-[#2C333F]">
              <td className="px-3 py-2 text-[#F1F2FF]">
                #{p.flat_number}
              </td>
              <td className="px-3 py-2 text-right text-[#FFD60A]">
                ₹{p.amount}
              </td>
            </tr>
          ))}
        </tbody>

      </table>
    </div>
  );
}