"use client";

import { storeServie } from "@/api/store";
import { Mode, FiltersType } from "@/types/analytics";
import { useEffect, useState } from "react";

export function Filters({
  mode,
  filters,
  setFilters,
  onSearch,
}: {
  mode: Mode;
  filters: FiltersType;
  setFilters: React.Dispatch<React.SetStateAction<FiltersType>>;
  onSearch: () => void;
}) {
 

  
      useEffect(() => {
        const fetchStores = async () => {
          try {
            const res = await storeServie.getAll(); // Replace with your API
            const options = res.data.data.map((s: any) => ({ label: s.name, value: s._id }));
            setStoreOptions(options);
          } catch (err) {
            console.error("Failed to fetch stores", err);
          }
        };
        fetchStores();
      }, []);

  const [selectedStores, setSelectedStores] = useState<string[]>([]);
    const [storeOptions, setStoreOptions] = useState<{label:string,value:string}[]>([]);

  const [dropdownOpen, setDropdownOpen] = useState(false);
// inside Filters component

// Sync store selection with filters
const toggleStore = (id: string) => {
  let newSelected: string[];
  if (selectedStores.includes(id)) {
    newSelected = selectedStores.filter((s) => s !== id);
  } else {
    newSelected = [...selectedStores, id];
  }

  // update local state
  setSelectedStores(newSelected);
  
  // update filters
  setFilters((f) => ({ ...f, stores: newSelected }));
};


  const MONTH_OPTIONS = [
    { label: "Jan", value: "1" },
    { label: "Feb", value: "2" },
    { label: "Mar", value: "3" },
    { label: "Apr", value: "4" },
    { label: "May", value: "5" },
    { label: "Jun", value: "6" },
    { label: "Jul", value: "7" },
    { label: "Aug", value: "8" },
    { label: "Sep", value: "9" },
    { label: "Oct", value: "10" },
    { label: "Nov", value: "11" },
    { label: "Dec", value: "12" },
  ];

  const YEAR_OPTIONS = [
    { label: "2026", value: "2026" },
    { label: "2025", value: "2025" },
    { label: "2024", value: "2024" },
  ];

  return (
    <div className="bg-white border rounded-xl p-4 shadow-sm flex flex-wrap gap-4 items-end">
      {mode === "day" && (
        <>
          <Input
            label="From"
            type="date"
            value={filters.fromDate}
            onChange={(v) => setFilters((p) => ({ ...p, fromDate: v }))}
          />
          <Input
            label="To"
            type="date"
            value={filters.toDate}
            onChange={(v) => setFilters((p) => ({ ...p, toDate: v }))}
          />
        </>
      )}

      {mode === "week" && (
        <>
          <Select
            label="Month"
            value={filters.month}
            onChange={(v) => setFilters((p) => ({ ...p, month: v }))}
            options={MONTH_OPTIONS}
          />
          <Select
            label="Year"
            value={filters.year}
            onChange={(v) => setFilters((p) => ({ ...p, year: v }))}
            options={YEAR_OPTIONS}
          />
        </>
      )}

      {mode === "month" && (
        <Select
          label="Year"
          value={filters.year}
          onChange={(v) => setFilters((p) => ({ ...p, year: v }))}
          options={YEAR_OPTIONS}
        />
      )}

      {/* STORE DROPDOWN */}
      <div className="relative">
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="w-64 bg-white border rounded-xl px-4 py-2 shadow-sm flex items-center justify-between"
        >
          <span>
            {selectedStores.length === 0
              ? "Select Stores"
              : `${selectedStores.length} store(s) selected`}
          </span>
          <svg
            className={`w-4 h-4 transition-transform ${
              dropdownOpen ? "rotate-180" : "rotate-0"
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>

        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-64 bg-white border rounded-xl shadow-lg z-10 max-h-60 overflow-y-auto">
            {storeOptions.length>0 && storeOptions?.map((store) => (
              <label
                key={store?.value}
                className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
              >
                <input
                  type="checkbox"
                  className="mr-2 w-4 h-4"
                  checked={selectedStores.includes(store.value)}
                  onChange={() => toggleStore(store.value)}
                />
                <span>{store.label}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* SEARCH BUTTON */}
      <div className="ml-auto">
        <button
          onClick={onSearch}
          className="bg-blue-600 text-white px-5 py-2 rounded-xl text-sm shadow hover:bg-blue-700 transition"
        >
          Search
        </button>
      </div>
    </div>
  );
}

/* ✅ STYLED INPUT */
function Input({
  label,
  type,
  value,
  onChange,
}: {
  label: string;
  type: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="w-64">
      <label className="text-xs text-gray-500">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border rounded-xl px-4 py-2 text-sm mt-1 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
    </div>
  );
}

/* ✅ STYLED SELECT */
function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { label: string; value: string }[];
}) {
  return (
    <div className="w-64">
      <label className="text-xs text-gray-500">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border rounded-xl px-4 py-2 text-sm mt-1 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
      >
        <option value="">Select</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}
