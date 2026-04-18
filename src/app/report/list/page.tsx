"use client";

import { useEffect, useState } from "react";
import { DynamicTable } from "@/components/table/dynamicTable";
import { listImportData } from "@/api/import";
import { storeServie } from "@/api/store";

type Row = {
  id: string;
  store: string;
  date: string;
  status: string;
  actions: { url: string; label: string }[];
};

type TableFilter = {
  fromDate?: string;
  toDate?: string;
  store?: string;
};

export default function ReportListPage() {
  const [data, setData] = useState<Row[]>([]);
  const [storeList, setStoreList] = useState<{ _id: string; name: string }[]>([]);
  const [filters, setFilters] = useState<TableFilter>({});
  const [draft, setDraft] = useState<TableFilter>({});

  const applyFilters = async () => {
    setFilters(draft);

    try {
      const importedData = await listImportData({
        status: ["Approved", "AutoApproved"],
        fromDate: draft.fromDate,
        toDate: draft.toDate,
        store: draft.store,
      });

      const items = importedData?.data?.items || [];
      const rows = items.map((item: any) => {
        const store = storeList.find((s) => s._id === item.store);
        return {
          id: item._id,
          store: store?.name || "Unknown",
          date: item.date,
          cashandCard: item.groups?.daily_finance_data?.cashandCard || 0,
          actualCard: item.groups?.daily_finance_data?.actualCard || 0,
          actualCash: item.groups?.daily_finance_data?.actualCash || 0,
          manualPayout: item.groups?.daily_finance_data?.manualPayout || 0,
          bankEntry: item.groups?.daily_finance_data?.bankingEntry || 0,
          difference: item.groups?.daily_finance_data?.difference || 0,
          status: item.status,
          actions: [
            { url: `/sales/${item._id}/view`, label: "View" },
          ],
        };
      });
      setData(rows);
    } catch (err) {
      console.error("Failed to fetch data", err);
    }
  };

  const clearFilters = () => {
    setDraft({});
    setFilters({});
  };

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const res = await storeServie.getAll();
        setStoreList(res?.data?.data || []);
      } catch (err) {
        console.error("Failed to fetch stores", err);
      }
    };

    fetchStores();
  }, []);

  const columns = [
    { key: "store", label: "Store" },
    { key: "date", label: "Date" },
    { key: "cashandCard", label: "Card (inc CB & CBC)" },
    { key: "actualCard", label: "Actual Card" },
    { key: "actualCash", label: "Actual Cash" },
    { key: "manualPayout", label: "Manual payout" },
    { key: "bankEntry", label: "Bank Entry" },
    { key: "difference", label: "Difference" },
    { key: "actions", label: "Actions" },
  ];

  return (
    <div className="p-6 bg-blue-50 min-h-screen">
      <div className="grid grid-cols-4 gap-4 mb-4">
        <select
          value={draft.store || ""}
          onChange={(e) => setDraft({ ...draft, store: e.target.value })}
          className="border px-2 py-1 rounded"
        >
          <option value="">All Stores</option>
          {storeList.map((store) => (
            <option key={store._id} value={store._id}>
              {store.name}
            </option>
          ))}
        </select>

        <input
          type="date"
          value={draft.fromDate || ""}
          onChange={(e) => setDraft({ ...draft, fromDate: e.target.value })}
          className="border px-2 py-1 rounded"
          max={new Date().toISOString().split("T")[0]} // Disable future dates
        />

        <input
          type="date"
          value={draft.toDate || ""}
          onChange={(e) => setDraft({ ...draft, toDate: e.target.value })}
          className="border px-2 py-1 rounded"
          max={new Date().toISOString().split("T")[0]} // Disable future dates
        />

        <div className="flex gap-2">
          <button
            onClick={applyFilters}
            className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
          >
            Search
          </button>
          <button
            onClick={clearFilters}
            className="bg-gray-300 px-3 py-1 rounded hover:bg-gray-400"
          >
            Clear
          </button>
        </div>
      </div>
      <DynamicTable data={data} columns={columns} isHeaderTotal={false} />
    </div>
  );
}

