"use client";

import { useState } from "react";
import { Mode,Category, Period, Store, FiltersType} from "@/types/analytics";
export function Filters({
  mode,
  filters,
  setFilters,
}: {
  mode: Mode;
  filters: FiltersType;
  setFilters: React.Dispatch<React.SetStateAction<FiltersType>>;
}) {
  const months = [
    "Jan","Feb","Mar","Apr","May","Jun",
    "Jul","Aug","Sep","Oct","Nov","Dec"
  ];

  const toggleMonth = (m: string) => {
    setFilters((prev) => ({
      ...prev,
      months: prev.months.includes(m)
        ? prev.months.filter((x) => x !== m)
        : [...prev.months, m],
    }));
  };

  return (
    <div className="bg-white border rounded-xl p-4 shadow-sm flex flex-wrap gap-4 items-end">
      {mode === "day" && (
        <>
          <Input label="From" type="date" value={filters.from} onChange={(v)=>setFilters(p=>({...p,from:v}))} />
          <Input label="To" type="date" value={filters.to} onChange={(v)=>setFilters(p=>({...p,to:v}))} />
        </>
      )}

      {mode === "week" && (
        <>
          <Select label="Month" value={filters.month} onChange={(v)=>setFilters(p=>({...p,month:v}))} options={months} />
          <Select label="Year" value={filters.year} onChange={(v)=>setFilters(p=>({...p,year:v}))} options={["2024","2025","2026"]} />
        </>
      )}

      {mode === "month" && (
        <>
          <Select label="Year" value={filters.year} onChange={(v)=>setFilters(p=>({...p,year:v}))} options={["2024","2025","2026"]} />
          <div>
            <label className="text-xs text-gray-500">Months</label>
            <div className="flex flex-wrap gap-2 mt-1">
              {months.map((m) => (
                <button
                  key={m}
                  onClick={() => toggleMonth(m)}
                  className={`px-3 py-1 rounded-full text-xs border ${
                    filters.months.includes(m)
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100"
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

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
    <div>
      <label className="text-xs text-gray-500">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          onChange(e.target.value)
        }
        className="border rounded px-3 py-1.5 text-sm mt-1"
      />
    </div>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <div>
      <label className="text-xs text-gray-500">{label}</label>
      <select
        value={value}
        onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
          onChange(e.target.value)
        }
        className="border rounded px-3 py-1.5 text-sm mt-1"
      >
        <option value="">Select</option>
        {options.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
    </div>
  );
}