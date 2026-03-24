"use client";

import { useState } from "react";
import { OrderForm } from "@/components/orders/OrderForm";
import { OrderTabs } from "@/components/orders/OrderTabs";
import { SalesTable } from "@/components/orders/SalesTable";
import { OtherCategoryTable } from "@/components/orders/OtherCategoryTable";
import { CardDetailsTable } from "@/components/orders/CardDetailsTable";
import { FinancialTable } from "@/components/orders/FinancialTable";

export default function OrdersPage() {
  const [submitted, setSubmitted] = useState(false);
  const [activeTab, setActiveTab] = useState("Sales");

  const renderTable = () => {
    switch (activeTab) {
      case "Sales":
        return <SalesTable />;
      case "Other Category":
        return <OtherCategoryTable />;
      case "Card Details":
        return <CardDetailsTable />;
      case "Financial":
        return <FinancialTable />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Form */}
      {!submitted && (
        <div className="bg-white p-6 rounded-xl shadow border border-gray-200 max-w-lg">
          <OrderForm onSubmit={() => setSubmitted(true)} />
        </div>
      )}

      {/* Tabs + Table */}
      {submitted && (
        <div>
          <OrderTabs activeTab={activeTab} setActiveTab={setActiveTab} />
          <div>{renderTable()}</div>
        </div>
      )}
    </div>
  );
}
