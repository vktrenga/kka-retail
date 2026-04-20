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
  operationSummary: { name: string; amount: number }[];
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
  const [loading, setLoading] = useState(false);

  const applyFilters = async () => {
    setLoading(true);
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
        const operationSummary = item.groups?.operation_summary || [];

        const summaryRows = operationSummary.map((summary: any) => ({
          name: summary.name,
          amount: summary.amount,
        }));

        const dynamicColumns = summaryRows.reduce((acc: any, summary: any) => {
          acc[summary.name] = summary.amount;
          return acc;
        }, {});

        return {
          id: item._id,
          date: item.date,
          store: store?.name || "Unknown",
          ...dynamicColumns,
          actions: [
            { url: `/sales/${item._id}/view`, label: "View" },
          ],
        };
      });

      const dynamicColumns = items[0]?.groups?.operation_summary?.map((summary: any) => ({
        key: summary.name,
        label: summary.name,
      })) || [];

      const columns = [
        { key: "date", label: "Date" },
        { key: "store", label: "Store" },
        ...dynamicColumns,
        { key: "actions", label: "Actions" },
      ];
      setData(rows);
      setColumns(columns);
    } catch (err) {
      console.error("Failed to fetch data", err);
    } finally {
      setLoading(false);
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

  const [columns, setColumns] = useState([
    { key: "date", label: "Date" },
    { key: "store", label: "Store" },
    { key: "actions", label: "Actions" },
  ]);

  useEffect(() => {
    if (data.length > 0) {
      // Removed redundant dynamic column generation
    }
  }, [data]);

  return (
    <div className="p-6 bg-blue-50 min-h-screen">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 z-10">
          <div className="text-center text-lg font-semibold">Loading...</div>
        </div>
      )}
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
      {data.length>0 && 
        <DynamicTable data={data} columns={columns} isHeaderTotal={true} />}
    </div>
  );
}

