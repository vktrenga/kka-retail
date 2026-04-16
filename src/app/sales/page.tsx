"use client";

import { useState, useCallback } from "react";
import { OrderForm } from "@/components/sales/OrderForm";
import { OrderTabs } from "@/components/sales/OrderTabs";
import { SalesTable } from "@/components/sales/SalesTable";
import { OtherCategoryTable } from "@/components/sales/OtherCategoryTable";
import { CardDetailsTable } from "@/components/sales/CardDetailsTable";
import { FinancialTable } from "@/components/sales/FinancialTable";
import { updateSalesData } from "@/api/import";

// ✅ Types
type Verification = {
  financial: boolean;
  card: boolean;
  category: boolean;
  otherCategory: boolean;
};

type TabKey =
  | "Sales"
  | "Other Category"
  | "Card Details"
  | "Financial";

export default function OrdersPage() {
  const [submitted, setSubmitted] = useState(false);
  const [activeTab, setActiveTab] = useState<TabKey>("Sales");
  const [excelData, setAllData] = useState<any>(null);

  const [verification, setVerification] = useState<Verification>({
    financial: false,
    card: false,
    category: false,
    otherCategory: false,
  });

  const isAllVerified = Object.values(verification).every(Boolean);

  // ✅ Safe updater (AUTO-CREATES groups + keys like daily_finance_data)
  const updateGroup = useCallback((key: string, value: any) => {
    setAllData((prev: any) => {
      const existingData = prev?.data || {};

      return {
        ...prev,
        data: {
          ...existingData,
          groups: {
            ...(existingData.groups || {}), // ✅ ensure groups exists
            [key]: value, // ✅ create/update key
          },
        },
      };
    });
  }, []);

  // ✅ API update
  const updateReport = async () => {
    if (!excelData?.data?._id) return;

    try {
      await updateSalesData(excelData.data._id, excelData.data);
      alert("Updated successfully");
    } catch (err) {
      console.error(err);
      alert("Update failed");
    }
  };

  // ✅ Verification handler
  const handleVerifyChange = useCallback(
    (key: keyof Verification, value: boolean) => {
      setVerification((prev) => ({
        ...prev,
        [key]: value,
      }));
    },
    []
  );

  // ✅ Render table
  const renderTable = () => {
    const groups = excelData?.data?.groups || {}; // ✅ always safe

    switch (activeTab) {
      case "Sales":
        return (
          <SalesTable
            data={groups.sales_summary || []}
            verification={verification}
            onVerifyChange={() =>
              handleVerifyChange("category", true)
            }
          />
        );

      case "Other Category":
        return (
          <OtherCategoryTable
            data={groups.exclusive_departments || []}
            verification={verification}
            onOtherCategoryUpdate={(data) =>
              updateGroup("exclusive_departments", data)
            }
            onVerifyChange={() =>
              handleVerifyChange("otherCategory", true)
            }
          />
        );

      case "Card Details":
        return (
          <CardDetailsTable
            data={groups.scratch_card_data || []}
            verification={verification}
            OnPaymentSummaryUpdate={(data) =>
              updateGroup("scratch_card_data", data)
            }
            onVerifyChange={() =>
              handleVerifyChange("card", true)
            }
          />
        );

      case "Financial":
        return (
          <FinancialTable
            data={groups.payment_summary || []} // ✅ safe fallback
            verification={verification}
            OnFinancialDataUpdate={(data) =>
              updateGroup("daily_finance_data", data) // ✅ auto-create
            }
            onVerifyChange={() =>
              handleVerifyChange("financial", true)
            }
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Form */}
      {!submitted && (
        <div className="bg-white p-6 rounded-xl shadow border max-w-lg">
          <OrderForm
            onSubmit={() => setSubmitted(true)}
            onSuccess={(data) => setAllData(data)}
          />
        </div>
      )}

      {/* Tabs + Table */}
      {submitted && excelData && (
        <div>
          <OrderTabs
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />

          <div className="mt-4">{renderTable()}</div>

          {/* Submit */}
          <div className="mt-4">
            <button
              disabled={!isAllVerified}
              onClick={updateReport}
              className={`px-4 py-2 rounded text-white ${
                isAllVerified
                  ? "bg-green-500 hover:bg-green-600"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              Submit
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
