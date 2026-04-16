"use client";
import { useEffect, useMemo, useState } from "react";

type Row = {
  name: string;
  open: number;
  close: number;
  amount: number;
  issue: number;
  ref: string;
  price: number;
  sales: number;
};

type Props = {
  data: Row[];
  verification: Record<string, boolean>;
  OnPaymentSummaryUpdate: (data: Row[]) => void;
  onVerifyChange: (key: string, value: boolean) => void;
};

// ✅ Default row template
const createEmptyRow = (): Row => ({
  name: "",
  price: 0,
  open: 0,
  close: 0,
  sales: 0,
  amount: 0,
  issue: 0,
  ref: "",
});

// ✅ Safe number parser
const toNumber = (val: any) => Number(val || 0);

// ✅ Round helper
const round = (num: number) =>
  Math.round((num + Number.EPSILON) * 100) / 100;

export const CardDetailsTable = ({
  data,
  verification,
  OnPaymentSummaryUpdate,
  onVerifyChange,
}: Props) => {
  const [rows, setRows] = useState<Row[]>([]);

  // ✅ Calculate row values
  const calculateRow = (row: Row): Row => {
    const sales = row.close>0? Math.max(0, toNumber(row.open) - toNumber(row.close)):0;
    const amount = row.close>0? round(sales * toNumber(row.price)):0;

    return { ...row, sales, amount };
  };

  // ✅ Initialize data (FIXED)
  useEffect(() => {
    if (!data || data.length === 0) {
      setRows(Array.from({ length: 5 }, createEmptyRow));
    } else {
      const calculated = data.map(calculateRow); // ✅ ensure correct values
      setRows(calculated);
    }
  }, [data]);

  // ✅ Update row
  const updateRow = (index: number, field: keyof Row, value: any) => {
    const updated = rows.map((row, i) => {
      if (i !== index) return row;

      const newRow = {
        ...row,
        [field]: field === "ref" || field === "name" ? value : toNumber(value),
      };

      return calculateRow(newRow);
    });

    setRows(updated);
    OnPaymentSummaryUpdate(updated);
  };

  // ✅ Add row
  const addRow = () => {
    const updated = [...rows, createEmptyRow()];
    setRows(updated);
    OnPaymentSummaryUpdate(updated);
  };

  // ✅ Delete row
  const deleteRow = (index: number) => {
    const updated = rows.filter((_, i) => i !== index);
    setRows(updated);
    OnPaymentSummaryUpdate(updated);
  };

  // ✅ Totals (FIXED - always recalculated)
  const totals = useMemo(() => {
    return rows.reduce(
      (acc, row) => {
        const sales = row.close >0 ?Math.max(0, row.open - row.close):0;
        const amount = round(sales * row.price);

        acc.sales += sales;
        acc.amount += amount;
        acc.issue += row.issue;

        return acc;
      },
      { sales: 0, amount: 0, issue: 0 }
    );
  }, [rows]);

  return (
    <div className="bg-white rounded-b-xl border shadow">
      <table className="w-full border text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-1">Name</th>
            <th className="border p-1">Price</th>
            <th className="border p-1">Open</th>
            <th className="border p-1">Close</th>
            <th className="border p-1">Sales Qty</th>
            <th className="border p-1">Sales Amount</th>
            <th className="border p-1">New Issue</th>
            <th className="border p-1">Ref</th>
            <th className="border p-1">Action</th>
          </tr>
        </thead>

        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="hover:bg-blue-50">
              <td className="border">
                <input
                  value={row.name}
                  onChange={(e) => updateRow(i, "name", e.target.value)}
                  className="p-1 w-full"
                />
              </td>

              <td className="border">
                <input
                  type="number"
                  min={0}
                  value={row.price}
                  onChange={(e) => updateRow(i, "price", e.target.value)}
                  className="p-1 w-full"
                />
              </td>

              <td className="border">
                <input
                  type="number"
                  min={0}
                  value={row.open}
                  onChange={(e) => updateRow(i, "open", e.target.value)}
                  className="p-1 w-full"
                />
              </td>

              <td className="border">
                <input
                  type="number"
                  min={0}
                  value={row.close}
                  onChange={(e) => updateRow(i, "close", e.target.value)}
                  className="p-1 w-full"
                />
              </td>

              {/* ✅ Sales Qty */}
              <td className="bg-gray-50 text-center border border-gray-300">
                {row.sales}
              </td>

              {/* ✅ Sales Amount */}
              <td className="bg-gray-50 text-center border border-gray-300">
                ₹{row.amount}
              </td>

              <td className="border">
                <input
                  type="number"
                  min={0}
                  value={row.issue}
                  onChange={(e) => updateRow(i, "issue", e.target.value)}
                  className="p-1 w-full"
                />
              </td>

              <td className="border">
                <input
                  value={row.ref}
                  onChange={(e) => updateRow(i, "ref", e.target.value)}
                  className="p-1 w-full"
                />
              </td>

              <td className="border text-center">
                <button
                  onClick={() => deleteRow(i)}
                  className="text-red-500"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ✅ Totals (Fixed & Styled) */}
      <div className="sticky bottom-0 bg-gray-100 border-t p-3 flex justify-between font-medium">
        <span>Total Sales: {totals.sales}</span>
        <span>Total Amount: ₹{totals.amount}</span>
        <span>Total Issue: {totals.issue}</span>
      </div>

      {/* ✅ Footer */}
      <div className="mt-4 flex justify-between items-center p-2">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={verification["card"] || false}
            onChange={(e) => onVerifyChange("card", e.target.checked)}
          />
          <span className="text-sm">
            All data has been verified and is consistent
          </span>
        </div>

        <button
          onClick={addRow}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          + Add More
        </button>
      </div>
    </div>
  );
};
