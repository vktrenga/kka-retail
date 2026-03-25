"use client";

import { useState } from "react";
import { Mode,Category, Period, Store, FiltersType, PAGE_SIZE} from "@/types/analytics";
import { generateCategories , createPeriod, stores} from "@/data/mockData";
import { Filters } from "@/components/analytics/filter";
import { StoreCard } from "@/components/analytics/store-card";
import { Header } from "@/components/analytics/hearder";

export default function Dashboard() {
  const [activeStores, setActiveStores] = useState<number[]>([]);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [visibleCount, setVisibleCount] = useState<number>(PAGE_SIZE);
  const [mode, setMode] = useState<Mode>("week");

  const [filters, setFilters] = useState<FiltersType>({
    from: "",
    to: "",
    month: "",
    year: "2026",
    months: [],
  });

  const format = (n: number) => `₹${n.toLocaleString()}`;

  return (
    <div className="min-h-screen bg-[#f5f7fb] p-6 space-y-6">
      <Header mode={mode} setMode={setMode} />

      <Filters mode={mode} filters={filters} setFilters={setFilters} />

      <div className="space-y-6">
        {stores.map((store, i) => (
          <StoreCard
            key={i}
            store={store}
            index={i}
            activeStores={activeStores}
            setActiveStores={setActiveStores}
            activeIndex={activeIndex}
            setActiveIndex={setActiveIndex}
            visibleCount={visibleCount}
            setVisibleCount={setVisibleCount}
            format={format}
            mode={mode}
          />
        ))}
      </div>
    </div>
  );
}

// ---------- HEADER ----------


// ---------- FILTERS ----------


// ---------- STORE CARD ----------

// ---------- DAY TABS ----------


// ---------- WEEK TABS ----------


// ---------- METRICS ----------



// ---------- CATEGORY TABLE ----------
