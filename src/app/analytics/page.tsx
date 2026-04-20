"use client";

import { SetStateAction, useEffect, useState } from "react";
import { Mode, FiltersType,  } from "@/types/analytics";
import { Filters } from "@/components/analytics/filter";
import { StoreCard } from "@/components/analytics/store-card";
import { Header } from "@/components/analytics/hearder";
import { fetchReport } from "@/api/analytics";
import { storeServie } from "@/api/store";

const formatLocalDate = (d: Date) => {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

/* ✅ DEFAULT DATE FUNCTION */
const getDefaultDates = () => {
  const today = new Date();

  const firstDay = new Date(
    today.getFullYear(),
    today.getMonth(),
    1
  );

  return {
    fromDate: formatLocalDate(firstDay), // ✅ FIXED
    toDate: formatLocalDate(today),      // ✅ FIXED
  };
};


export default function Dashboard() {
  const [activeStores, setActiveStores] = useState<number[]>([]);
  const [apiDate, setAPIData] = useState<any>()
  /* ✅ FIX 1: Default mode = day */
  const [mode, setMode] = useState<Mode>("day");

  /* ✅ Store-wise active index */
  const [activeIndexMap, setActiveIndexMap] = useState<{
    [key: number]: string | null;
  }>({});


  // get All stores 
    const [storeList, setStoreList] = useState<[]>([]);
    
    useEffect(() => {
      const fetchStores = async () => {
        try {
          const res = await storeServie.getAll(); // Replace with your API
          setStoreList(res?.data?.data)
        } catch (err) {
          console.error("Failed to fetch stores", err);
        }
      };
      fetchStores();
    }, []);

  /* ✅ FIX 2: Initialize filters with default dates */
  const [filters, setFilters] = useState<FiltersType>(() => {
    const { fromDate, toDate } = getDefaultDates();

    return {
      fromDate,
      toDate,
      year: new Date().getFullYear().toString(),
      month:'',
      mode:'day',
      stores:[]

    };
  });

  /* ✅ FIX 3: Reset when switching back to DAY */
  useEffect(() => {
      setFilters((prev) => ({
        ...prev,
        mode,
      }));
  }, [mode]);

  const [loading, setLoading] = useState(false);

  /* ✅ FIX 4: Search button handler */
  const handleSearch = async () => {
    setLoading(true);
    try {
      const res = await fetchReport(filters);
      setAPIData(res);
    } finally {
      setLoading(false);
    }
  };

  const format = (n: number) =>
    `₹${n.toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  return (
    <div className="relative min-h-screen bg-[#f5f7fb] p-6 space-y-6">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 z-10">
          <div className="text-center text-lg font-semibold">Loading...</div>
        </div>
      )}
      <Header mode={mode} setMode={setMode} />

      {/* ✅ FIX 5: Pass onSearch */}
      <Filters
        mode={mode}
        filters={filters}
        setFilters={setFilters}
        onSearch={handleSearch}
      />

      <div className="space-y-6">
        {apiDate?.data?.map((storeData: any, i:number) => (
          <StoreCard
            key={i}
            storeData={storeData}
            index={i}
            activeStores={activeStores}
            setActiveStores={setActiveStores}
            activeIndex={activeIndexMap[i] || null}
            setActiveIndex={(value) => setActiveIndexMap((prev) => ({
              ...prev,
              [i]: value,
            }))}
            mode={mode} 
            storeList ={storeList || []}
            />
        ))}
      </div>
    </div>
  );
}

