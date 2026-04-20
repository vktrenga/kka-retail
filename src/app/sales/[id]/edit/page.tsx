"use client";

import {  useParams } from "next/navigation";
import { OrderTabs } from "@/components/sales/OrderTabs";
import { SalesTable } from "@/components/sales/SalesTable";
import { OtherCategoryTable } from "@/components/sales/OtherCategoryTable";
import { CardDetailsTable } from "@/components/sales/CardDetailsTable";
import { FinancialTable } from "@/components/sales/FinancialTable";
import { useSalesPageLogic } from "../../useSalesPageLogic";
import { useFetchSalesData } from "@/hooks/useFetchSalesData";

export default function EditSalesPage() {
  const params = useParams();
  const id = params?.id as string;
  const { loading, error, initialData } = useFetchSalesData(id);

  const logic = useSalesPageLogic(initialData);

  const renderTable = () => {
    const groups = logic?.excelData?.data?.groups || {};
    const isReadOnly = initialData?.status !== "Draft"; // Determine if the page is read-only

    switch (logic.activeTab) {
      case "Sales":
        return (
          <SalesTable
            data={groups.sales_summary || []}
            verification={logic.verification}
            onVerifyChange={() => logic.handleVerifyChange("category", true)}
            readOnly={isReadOnly} // Pass readOnly prop
          />
        );
      
      case "Scratch Card":
        return (
          <CardDetailsTable
            data={groups.scratch_card_data || []}
            verification={logic.verification}
            OnPaymentSummaryUpdate={(data) => logic.updateGroup("scratch_card_data", data)}
            onVerifyChange={() => logic.handleVerifyChange("card", true)}
            readOnly={isReadOnly} // Pass readOnly prop
          />
        );
        case "Other Category":
        return (
          <OtherCategoryTable
            data={groups.exclusive_departments || []}
            verification={logic.verification}
            onOtherCategoryUpdate={(data) => logic.updateGroup("exclusive_departments", data)}
            onVerifyChange={() => logic.handleVerifyChange("otherCategory", true)}
            cardData={groups.scratch_card_data || []}
            readOnly={isReadOnly} // Pass readOnly prop
          />
        );
      case "Financial":
        return (
          <FinancialTable
            data={ groups.payment_summary || []}
            dailyFinanceRecordData={groups?.daily_finance_data || null}
            verification={logic.verification}
            OnFinancialDataUpdate={(data) => logic.updateGroup("daily_finance_data", data)}
            onVerifyChange={() => logic.handleVerifyChange("financial", true)}
            ApprovalComment={""} 
            readOnly={isReadOnly} // Pass readOnly prop
          />
        );
      default:
        return null;
    }
  };

  return (
    <div>
      <OrderTabs activeTab={logic.activeTab} setActiveTab={logic.setActiveTab} />
      {loading ? <p>Loading...</p> : error ? <p>{error}</p> : renderTable()}
      <div className="mt-4">
        <button
          disabled={!logic.isAllVerified}
          onClick={logic.updateReport}
          className={`px-4 py-2 rounded text-white ${
            logic.isAllVerified
              ? "bg-green-500 hover:bg-green-600"
              : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          Submit
        </button>
      </div>
    </div>
  );
}
