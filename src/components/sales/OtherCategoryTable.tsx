import { useMemo, useCallback } from "react";

type CategoryRow = {
  name: string;
  qty: number;
  actual_qty?: number;
  qty_diff?: number;
  amount: number;
  actual_amount?: number;
  diff_amount?: number;
};

type Props = {
  data: CategoryRow[];
  verification: Record<string, boolean>;
  onOtherCategoryUpdate: (data: CategoryRow[]) => void;
  onVerifyChange: (key: string, value: boolean) => void;
};

// ✅ Helpers
const toNumber = (val: unknown) => Number(val || 0);

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
}: Props) => {
  const columns = [
    "Category",
    "Qty",
    "Actual Qty",
    "Diff Qty",
    "Amount",
    "Actual Amount",
    "Diff Amount",
  ];

  // ✅ Core Calculation
  const calculateRow = useCallback((row: CategoryRow): CategoryRow => {
    const actualQty = toNumber(row.actual_qty);
    const actualAmount = toNumber(row.actual_amount);

    return {
      ...row,
      qty_diff: row.qty - actualQty,
      diff_amount: round(row.amount - actualAmount),
    };
  }, []);

  // ✅ Generic updater (reusable)
  const updateRow = useCallback(
    (index: number, updates: Partial<CategoryRow>) => {
      const updated = data.map((row, i) =>
        i === index ? calculateRow({ ...row, ...updates }) : row
      );

      onOtherCategoryUpdate(updated);
    },
    [data, calculateRow, onOtherCategoryUpdate]
  );

  // ✅ Totals
  const totals = useMemo(() => {
    return data.reduce(
      (acc, item) => {
        acc.qty += item.qty;
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
            {data.length > 0 ? (
              data.map((row, i) => (
                <tr key={i} className="hover:bg-blue-50">
                  <td className="p-3 border">{row.name}</td>

                  <td className="p-3 border text-right">
                    {row.qty}
                  </td>

                  {/* Actual Qty */}
                  <td className="p-3 border">
                    <input
                      type="number"
                      value={row.actual_qty ?? ""}
                      onChange={(e) =>
                        updateRow(i, {
                          actual_qty: toNumber(e.target.value),
                        })
                      }
                      className="w-full border px-2 py-1"
                    />
                  </td>

                  {/* Diff Qty */}
                  <td
                    className={`p-3 border text-center font-medium ${
                      (row.qty_diff ?? 0) > 0
                        ? "text-red-500"
                        : "text-green-600"
                    }`}
                  >
                    {row.qty_diff ?? 0}
                  </td>

                  <td className="p-3 border text-right">
                    {formatCurrency(row.amount)}
                  </td>

                  {/* Actual Amount */}
                  <td className="p-3 border">
                    <input
                      type="number"
                      value={row.actual_amount ?? ""}
                      onChange={(e) =>
                        updateRow(i, {
                          actual_amount: toNumber(e.target.value),
                        })
                      }
                      className="w-full border px-2 py-1"
                    />
                  </td>

                  {/* Diff Amount */}
                  <td
                    className={`p-3 border text-center font-medium ${
                      (row.diff_amount ?? 0) > 0
                        ? "text-red-500"
                        : "text-green-600"
                    }`}
                  >
                    {formatCurrency(row.diff_amount ?? 0)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={7}
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
      <div className="sticky bottom-0 bg-gray-100 border-t p-3 font-medium flex justify-between flex-wrap gap-2">
        <span>Total Qty: {totals.qty}</span>
        <span>Total Amount: {formatCurrency(totals.amount)}</span>
        <span>Diff Qty: {totals.qty_diff}</span>
        <span>Diff Amount: {formatCurrency(totals.diff_amount)}</span>
      </div>

      {/* Verification */}
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
    </div>
  );
};
