import { toNumber } from "@/utils/commonTypes";

type ScratchCardData = { name: string; open: number; close: number; amount: number };

export function ScratchCardDataTable({
  title,
  scratchCardData,
}: {
  title: string;
  scratchCardData: ScratchCardData[];
}) {
  // ✅ Calculate totals


  return (
    <div className="border rounded-lg overflow-hidden flex flex-col">
      
      {/* ✅ Title */}
      <div className="bg-gray-100 px-4 py-2 font-semibold border-b">
        {title}
      </div>

      {/* ✅ Scrollable Table */}
      <div className="max-h-[400px] overflow-auto">
        <table className="min-w-full text-sm">
          
          {/* 🔥 Sticky Header */}
          <thead className="bg-gray-50 sticky top-0 z-10">
            <tr>
              <th className="p-3 text-left">Category</th>
              <th>Open</th>
              <th>Close</th>
              <th>Amount</th>
            </tr>
          </thead>

          <tbody>
            {scratchCardData?.map((c, idx) => (
              <tr key={idx} className="border-t hover:bg-gray-50">
                <td className="p-3">{c.name}</td>
                <td className="p-3">{toNumber(c.open).toFixed(2)}</td>
                <td className="p-3">{toNumber(c.close).toFixed(2)}</td>
                <td className="p-3">{toNumber(c.amount).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>

          {/* 🔥 Sticky Footer */}
          {/* <tfoot className="sticky bottom-0 bg-gray-100 z-10 border-t">
            <tr className="font-semibold">
              <td className="p-3">Total</td>
              <td className="p-3">{ Number(totalQty).toFixed(2)}</td>
              <td className="p-3">{Number(totalAmount).toFixed(2)}</td>
            </tr>
          </tfoot> */}

        </table>
      </div>
    </div>
  );
}

