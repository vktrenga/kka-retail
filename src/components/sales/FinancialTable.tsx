"use client";

import { useEffect, useState } from "react";

type CategoryRow = {
  name: string;
  amount: number;
};

type DailyFinanceDataType = {
  cashandCard: number;
  actualCard: number;
  actualCash: number;
  manualPayout: number;
  bankingEntry: number;
  difference: number;
};

type Props = {
  data: CategoryRow[];
  verification: Record<string, boolean>;
  OnFinancialDataUpdate: (data: DailyFinanceDataType) => void;
  onVerifyChange: (key: string, value: boolean) => void;
};

// ✅ Safe number helper
const toNumber = (val: any) => Number(val || 0);

export const FinancialTable = ({
  data,
  verification,
  OnFinancialDataUpdate,
  onVerifyChange,
}: Props) => {
  const [dailyFinanceData, setDailyFinance] =
    useState<DailyFinanceDataType>({
      cashandCard: 0,
      actualCard: 0,
      actualCash: 0,
      manualPayout: 0,
      bankingEntry: 0,
      difference: 0,
    });

  const displayData = data || [];

  const columns = ["Title", "Amount"];

  const totalAmount = displayData.reduce(
    (sum, item) => sum + toNumber(item.amount),
    0
  );

  // ✅ Update Cash + Card from table data
  useEffect(() => {
    const cashcardData = displayData.find(
      (item) => item.name === "Cash + Card (inc CBC)"
    );

    setDailyFinance((prev) => {
      const updated = {
        ...prev,
        cashandCard: toNumber(cashcardData?.amount),
      };

      return calculateDifference(updated);
    });
  }, [displayData]);

  // ✅ Difference calculation
  const calculateDifference = (
    data: DailyFinanceDataType
  ): DailyFinanceDataType => {
    const diff =
      data.cashandCard -
      (data.actualCard +
        data.actualCash +
        data.manualPayout) +
      (data.actualCash - data.bankingEntry);

    return {
      ...data,
      difference: Number(diff.toFixed(2)),
    };
  };

  // ✅ Handle input change
  const handleChange = (
    key: keyof DailyFinanceDataType,
    value: number
  ) => {
    setDailyFinance((prev) => {
      const updated = calculateDifference({
        ...prev,
        [key]: toNumber(value),
      });

      // ✅ Send data to parent (IMPORTANT)
      OnFinancialDataUpdate(updated);

      return updated;
    });
  };

  // ✅ Difference styling
  const isZero = dailyFinanceData.difference === 0;
  const isPositive = dailyFinanceData.difference > 0;

  const diffClass = isZero
    ? "bg-green-100 text-green-700 border-green-400"
    : isPositive
    ? "bg-red-100 text-red-700 border-red-400"
    : "bg-yellow-100 text-yellow-700 border-yellow-400";

  return (
    <div className="bg-white rounded-b-xl border shadow">
      <div className="grid grid-cols-[300px_1fr] gap-3 border rounded overflow-hidden">
        
        {/* LEFT SIDE */}
        <div className="border rounded p-4 bg-white space-y-4 w-[300px]">
          
          {/* Card (Read-only) */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-600 mb-1">
              Card (inc CB & CBC)
            </label>
            <input
              type="number"
              className="border rounded px-2 py-1 bg-gray-100"
              value={dailyFinanceData.cashandCard}
              readOnly
            />
          </div>

          {/* Actual Card */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-600 mb-1">
              Actual Card
            </label>
            <input
              type="number"
              min={0}
              className="border rounded px-2 py-1"
              value={dailyFinanceData.actualCard}
              onChange={(e) =>
                handleChange("actualCard", Number(e.target.value))
              }
            />
          </div>

          {/* Actual Cash */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-600 mb-1">
              Actual Cash
            </label>
            <input
              type="number"
              min={0}
              className="border rounded px-2 py-1"
              value={dailyFinanceData.actualCash}
              onChange={(e) =>
                handleChange("actualCash", Number(e.target.value))
              }
            />
          </div>

          {/* Manual Payout */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-600 mb-1">
              Manual payout
            </label>
            <input
              type="number"
              min={0}
              className="border rounded px-2 py-1"
              value={dailyFinanceData.manualPayout}
              onChange={(e) =>
                handleChange("manualPayout", Number(e.target.value))
              }
            />
          </div>

          {/* Bank Entry */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-600 mb-1">
              Bank Entry
            </label>
            <input
              type="number"
              min={0}
              className="border rounded px-2 py-1"
              value={dailyFinanceData.bankingEntry}
              onChange={(e) =>
                handleChange("bankingEntry", Number(e.target.value))
              }
            />
          </div>

          {/* Difference */}
          <div className="flex flex-col">
            <label
              className={`text-sm font-medium mb-1 ${
                isZero
                  ? "text-green-700"
                  : isPositive
                  ? "text-red-700"
                  : "text-yellow-700"
              }`}
            >
              Difference
            </label>
            <input
              type="number"
              readOnly
              value={dailyFinanceData.difference}
              className={`border rounded px-2 py-1 font-semibold ${diffClass}`}
            />
          </div>
        </div>

        {/* RIGHT SIDE TABLE */}
        <div className="grid grid-cols-1 border rounded overflow-hidden">
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
                {displayData.map((row, i) => (
                  <tr key={i} className="hover:bg-blue-50">
                    <td className="p-3 border">{row.name}</td>
                    <td className="p-3 border">{row.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* OPTIONAL TOTAL */}
        {/* <div className="col-span-2 bg-gray-100 border-t p-3 font-medium flex justify-between">
          <span>Total</span>
          <span>{totalAmount}</span>
        </div> */}
      </div>

      {/* VERIFICATION */}
      <div className="mt-4 flex justify-between items-center p-2">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={verification["financial"] || false}
            onChange={(e) =>
              onVerifyChange("financial", e.target.checked)
            }
          />
          <span className="text-sm">
            All data has been verified and is consistent with the original records
          </span>
        </div>
      </div>
    </div>
  );
};