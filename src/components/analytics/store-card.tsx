'use client';

import { Mode, Category } from "@/types/analytics";
import { MetricsRow } from "./matrics-rows";
import { DayTabs } from "./days-tabs";
import { CategoryTable, Column } from "./category-table";
import { ScratchCardDataTable } from "./scratch-card-data-table";
import type { Store } from "@/types/analytics";

type StoreData = {
  store: string;
  data: Record<string, any>;
};

export function StoreCard({
  storeData,
  index,
  activeStores,
  setActiveStores,
  activeIndex,
  setActiveIndex,
  mode,
  storeList,
}: {
  storeData: StoreData;
  index: number;
  activeStores: number[];
  setActiveStores: React.Dispatch<React.SetStateAction<number[]>>;
  activeIndex: string | null;
  setActiveIndex: (value: string | null) => void;
  mode: Mode;
  storeList: Store[];
}) {
  const isOpen = activeStores.includes(index);

  const store: any = storeList.find(
    (store: any) => store._id === storeData.store
  );

  const storeName = store?.name || "Unknown Store";

  const modeKeys = Object.keys(storeData.data).filter((key) => key !== "all");

  const selected =
    activeIndex !== null
      ? storeData?.data?.[activeIndex]
      : storeData?.data?.all;

  const currentAllStoreData =
    storeData?.data?.all?.daily_finance_data || [];

  const currentStoreData = selected?.daily_finance_data || [];
  const currentModeCategory = selected?.sales_summary || [];
  const currentModeOtherCetegroy =
    selected?.exclusive_departments || [];
  const scratchCardData =
    selected?.scratch_card_data || [];

  // ✅ FIXED TYPES HERE
  const catColumns: Column<Category>[] = [
    { name: "name", label: "Category", type: "string" },
    { name: "qty", label: "Qty", type: "number" },
    { name: "amount", label: "Sale Amount", type: "number" },
  ];

  const exclusiveCatColumns: Column<Category>[] = [
    { name: "name", label: "Category", type: "string" },
    { name: "qty", label: "Qty", type: "number" },
    { name: "actual_qty", label: "Actual Qty", type: "number" },
    { name: "qty_diff", label: "Qty Diff", type: "number" },
    { name: "amount", label: "Sale Amount", type: "number" },
    { name: "actual_amount", label: "Actual Amount", type: "number" },
    { name: "diff_amount", label: "Amount Diff", type: "number" },
  ];

  return (
    <div className="bg-white rounded-xl border shadow-sm">

      <div
        className="p-4 cursor-pointer hover:bg-gray-50"
        onClick={() =>
          setActiveStores((prev) =>
            prev.includes(index)
              ? prev.filter((s) => s !== index)
              : [...prev, index]
          )
        }
      >
        <div className="flex justify-between">
          <h2 className="font-medium">{storeName}</h2>
          <span className="text-xs text-gray-400">
            {isOpen ? "▲" : "▼"}
          </span>
        </div>

        <MetricsRow currentStoreData={currentAllStoreData} />
      </div>

      {isOpen && (
        <div className="p-4 space-y-4">

          <DayTabs
            activeIndex={activeIndex}
            setActiveIndex={setActiveIndex}
            modeKeys={modeKeys}
          />

          <MetricsRow currentStoreData={currentStoreData} />

          <div className="grid md:grid-cols-2 gap-4">

            <CategoryTable
              title="Department Data"
              categories={currentModeCategory}
              columns={catColumns}
            />

            <CategoryTable
              title="Exclusive Department Data"
              categories={currentModeOtherCetegroy}
              columns={exclusiveCatColumns}
            />

            <ScratchCardDataTable
              title="Scratch Card Data"
              scratchCardData={scratchCardData}
            />

          </div>
        </div>
      )}
    </div>
  );
}