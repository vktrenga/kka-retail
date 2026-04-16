
import { useMemo } from "react";
import { toNumber } from "@/utils/commonTypes";
import type { CategoryRow } from "@/types/analytics";

type Props = {
  data: CategoryRow[];
  verification: Record<string, boolean>;
  onVerifyChange: (key: string, value: boolean) => void;
};


const formatCurrency = (num: number) =>
  `₹${num.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

export const SalesTable = ({
  data,
  verification,
  onVerifyChange,
}: Props) => {
  const columns = ["Category", "Qty", "Amount"];

  // ✅ Totals (optimized)
  const totals = useMemo(() => {
    return data.reduce(
      (acc, item) => {
        acc.qty += toNumber(item.qty);
        acc.amount += toNumber(item.amount);
        return acc;
      },
      { qty: 0, amount: 0 }
    );
  }, [data]);

  return (
    <div className="bg-white rounded-b-xl border shadow">
      {/* Title */}
      <div className="p-4 font-semibold border-b">
        Category Wise Sales
      </div>

      {/* Table */}
      <div className="max-h-[500px] overflow-auto">
        <table className="w-full text-sm border-collapse">
          <thead className="sticky top-0 bg-gray-100 z-10">
            <tr>
              {columns.map((col) => (
                <th key={col} className="p-3 border text-left">
                  {col}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {data.length > 0 ? (
              data.map((row, i) => (
                <tr key={i} className="hover:bg-blue-50">
                  <td className="p-3 border">{row.name}</td>
                  <td className="p-3 border text-right">
                    {row.qty}
                  </td>
                  <td className="p-3 border text-right">
                    {formatCurrency(row.amount)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={3}
                  className="text-center p-4 text-gray-500"
                >
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="sticky bottom-0 bg-gray-100 border-t p-3 flex flex-col gap-3">
        
        {/* Totals */}
        <div className="flex justify-between font-medium">
          <span>Total Qty: {totals.qty}</span>
          <span>Total Amount: {formatCurrency(totals.amount)}</span>
        </div>

        {/* Verification */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={verification["category"] || false}
            onChange={(e) =>
              onVerifyChange("category", e.target.checked)
            }
          />
          <span className="text-sm">
            All data has been verified and is consistent with the
            original records
          </span>
        </div>
      </div>
    </div>
  );
};
