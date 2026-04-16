'use client'; // make it a client component

import { Mode } from "@/types/analytics";
import { MetricsRow } from "./matrics-rows";
import { DayTabs } from "./days-tabs";
import { CategoryTable } from "./category-table";
import { ScratchCardDataTable } from "./scratch-card-data-table";

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
  storeData: any;
  index: number;
  activeStores: number[];
  setActiveStores: React.Dispatch<React.SetStateAction<number[]>>;
  activeIndex: string | null;
  setActiveIndex: (value: string | null) => void;
  mode: Mode;
  storeList: any[];
}) {
  const isOpen = activeStores.includes(index);

  // Find store name from storeList
  const store = storeList.find((store) => store._id === storeData.store);
  const storeName = store?.name || "Unknown Store";

  const modeKeys = Object.keys(storeData.data).filter((key) => key !== "all");

  const selected =
    activeIndex !== null
      ? storeData?.data?.[activeIndex]
      : storeData?.data?.all;

  const currentStoreData = selected?.payment_summary || [];
  const currentModeCategory = selected?.sales_summary || [];
  const currentModeOtherCetegroy =
    selected?.exclusive_departments || [];
  const scratchCardData =
    selected?.scratch_card_data || [];
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
          <span className="text-xs text-gray-400">{isOpen ? "▲" : "▼"}</span>
        </div>

        <MetricsRow currentStoreData={currentStoreData} />
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
            />
            <CategoryTable
              title="Exclusive Department Data"
              categories={currentModeOtherCetegroy}
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
