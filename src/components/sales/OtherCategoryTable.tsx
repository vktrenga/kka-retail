import { useMemo, useCallback } from "react";
import { toNumber } from "@/utils/commonTypes";
import type { CategoryRow, OtherCategoryRow } from "@/types/analytics";
import { usePathname } from "next/navigation";
import { CardRow } from "@/types/sales";

type Props = {
  data: OtherCategoryRow[];
  verification: Record<string, boolean>;
  onOtherCategoryUpdate: (data: OtherCategoryRow[]) => void;
  onVerifyChange: (key: string, value: boolean) => void;
  cardData: CardRow[],
  readOnly?: boolean; // Added readOnly prop
};

const round = (num: number) =>
  Math.round((num + Number.EPSILON) * 100) / 100;

const formatCurrency = (num: number) =>
  `₹${num.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

export const OtherCategoryTable = ({
  data,
  verification,
  onOtherCategoryUpdate,
  onVerifyChange,
  cardData,
  readOnly = false, // Default value for readOnly
}: Props) => {
  const pathname = usePathname();
  const isViewMode = pathname.includes("view") || pathname.includes("unapproved");

  const columns = [
    "Category",
    "Qty",
    "Actual Qty",
    "Diff Qty",
    "Amount",
    "Actual Amount",
    "Diff Amount",
  ];

  
  const cardDataTotals = useMemo(() => {
    return cardData.reduce(
      (acc, item) => {
        acc.sales += toNumber(item.sales);
        acc.amount += item.amount;
        return acc;
      },
      { sales: 0, amount: 0}
    );
  }, [cardData]);

  // ✅ Generic updater (reusable)
  const updateRow = useCallback(
    (index: number, updates: Partial<OtherCategoryRow>) => {
      const updated = data.map((row, i) =>
        i === index ? { ...row, ...updates } : row
      );

      onOtherCategoryUpdate(updated);
    },
    [data, onOtherCategoryUpdate]
  );

  // ✅ Totals
  const totals = useMemo(() => {
    return data.reduce(
      (acc, item) => {
        acc.qty += toNumber(item.qty);
        acc.amount += item.amount;
        acc.qty_diff += toNumber(item.qty_diff);
        acc.diff_amount += toNumber(item.diff_amount);
        return acc;
      },
      { qty: 0, amount: 0, qty_diff: 0, diff_amount: 0 }
    );
  }, [data]);



  
  return (
    <div className="bg-white rounded-b-xl border shadow">
      <div className="p-4 font-semibold border-b">
        Exclusive Category Wise Sales
      </div>

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
            {data.map((row, i) => {
              const actualQty = row.name === "SCRATCH CARD" ? cardDataTotals.sales : row.actual_qty;
              const actualAmount = row.name === "SCRATCH CARD" ? cardDataTotals.amount : row.actual_amount;

              const qtyDiff = row.qty - toNumber(actualQty);
              const diffAmount = round(row.amount - toNumber(actualAmount));

              return (
                <tr key={i} className="hover:bg-blue-50">
                  <td className="p-3 border">{row.name}</td>

                  <td className="p-3 border text-right">{row.qty}</td>

                  {/* Actual Qty */}
                  <td className="p-3 border">
                    <input
                      type="number"
                      value={actualQty ?? ""}
                      onChange={(e) =>
                        updateRow(i, {
                          actual_qty: toNumber(e.target.value),
                        })
                      }
                      className="w-full border px-2 py-1"
                      disabled={readOnly} // Disable input if readOnly is true
                    />
                  </td>

                  {/* Diff Qty */}
                  <td
                    className={`p-3 border text-center font-medium ${
                      qtyDiff > 0
                        ? "text-red-500"
                        : "text-green-600"
                    }`}
                  >
                    {qtyDiff}
                  </td>

                  <td className="p-3 border text-right">{formatCurrency(row.amount)}</td>

                  {/* Actual Amount */}
                  <td className="p-3 border">
                    <input
                      type="number"
                      value={actualAmount ?? ""}
                      onChange={(e) =>
                        updateRow(i, {
                          actual_amount: toNumber(e.target.value),
                        })
                      }
                      className="w-full border px-2 py-1"
                      disabled={readOnly} // Disable input if readOnly is true
                    />
                  </td>

                  {/* Diff Amount */}
                  <td
                    className={`p-3 border text-center font-medium ${
                      diffAmount > 0
                        ? "text-red-500"
                        : "text-green-600"
                    }`}
                  >
                    {formatCurrency(diffAmount)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="sticky bottom-0 bg-gray-100 border-t p-3 font-medium flex justify-between flex-wrap gap-2">
        <span>Total Qty: {totals.qty}</span>
        <span>Total Amount: {formatCurrency(totals.amount)}</span>
        <span>Diff Qty: {totals.qty_diff}</span>
        <span>Diff Amount: {formatCurrency(totals.diff_amount)}</span>
      </div>

      {/* Verification */}
      {!isViewMode && !readOnly && ( // Conditionally render checkbox
        <div className="mt-4 flex justify-between items-center px-3 pb-3">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={verification["otherCategory"] || false}
              onChange={(e) =>
                onVerifyChange("otherCategory", e.target.checked)
              }
            />
            <span className="text-sm">
              All data has been verified and is consistent with the
              original records
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
