"use client";

import { toNumber } from "@/utils/commonTypes";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { approveData } from "@/api/import";
import router from "next/router";
import { showNotification } from "@/utils/notifications";

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
  dailyFinanceRecordData: DailyFinanceDataType;
  verification: Record<string, boolean>;
  OnFinancialDataUpdate: (data: DailyFinanceDataType) => void;
  onVerifyChange: (key: string, value: boolean) => void;
  ApprovalComment: string;
  readOnly?: boolean; // Added readOnly prop
};

export const FinancialTable = ({
  data,
  dailyFinanceRecordData,
  verification,
  OnFinancialDataUpdate,
  onVerifyChange,
  ApprovalComment,
  readOnly = false, // Default value for readOnly
}: Props) => {
  const [dailyFinanceData, setDailyFinance] =
    useState<DailyFinanceDataType>(dailyFinanceRecordData || {
      cashandCard: 0,
      actualCard: 0,
      actualCash: 0,
      manualPayout: 0,
      bankingEntry: 0,
      difference: 0,
    });

  const [approverComment, setApproverComment] = useState(ApprovalComment || "");

  const displayData = data || [];

  const columns = ["Title", "Amount"];

  const pathname = usePathname();
  const isViewMode = pathname.includes("view") || pathname.includes("unapproved");

  // Extract the data ID from the URL path
  const dataId = pathname.split("/")[2]; // Assuming the ID is always the third segment in the path

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

  // Function to handle approve button click
  const handleApprove = async () => {
    const dataId = pathname.split("/")[2]; // Assuming the ID is always the third segment in the path
    if (!approverComment.trim()) {
      // Show notification for missing comment
      showNotification("Please enter a comment before approving.", "error");
      return;
    }

    try {
      // Call the API function
      await approveData({ id: dataId, comment: approverComment });

      // Show success notification
      showNotification("Data approved successfully.", "success");

      // Redirect to the unapproved list page after a delay
      setTimeout(() => {
        window.location.href = "/sales/unapproved-list"; // Ensure redirection even if router.push fails
      }, 2000); // Redirect after 2 seconds
    } catch (error) {
      console.error("Error approving data:", error);

      // Show error notification
      showNotification("Failed to approve data. Please try again.", "error");
    }
  };

  // Add state for notification

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
              disabled={readOnly} // Disable input if readOnly is true
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
              disabled={readOnly} // Disable input if readOnly is true
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
              disabled={readOnly} // Disable input if readOnly is true
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
              disabled={readOnly} // Disable input if readOnly is true
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

       
      </div>

      {/* VERIFICATION */}
      {!isViewMode && (
        <div className="mt-4 flex justify-between items-center px-3 pb-3">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={verification["financial"] || false}
              onChange={(e) =>
                onVerifyChange("financial", e.target.checked)
              }
              disabled={readOnly} // Disable checkbox if readOnly is true
            />
            <span className="text-sm">
              All data has been verified and is consistent with the
              original records
            </span>
          </div>
        </div>
      )}

      {(pathname.includes("unapproved") || pathname.includes("view")) && (
        <div className="mt-4 flex flex-col gap-2 px-3 pb-3">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-600">
              Comment (for approver)
            </label>
            <textarea
              value={approverComment}
              onChange={(e) => setApproverComment(e.target.value)}
              className="border rounded px-2 py-1 w-1/2"
              placeholder="Enter your comment here"
              rows={4} // Adjust rows for height
            />
          </div>
          <button
            onClick={handleApprove}
            disabled={pathname.includes("unapproved") ? false : true} // Disable button if readOnly is true
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-300 w-1/2"
          >
            Approve
          </button>
        </div>
      )}

      {/* {notification && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded shadow">
          {notification}
        </div>
      )} */}
    </div>
  );
};


