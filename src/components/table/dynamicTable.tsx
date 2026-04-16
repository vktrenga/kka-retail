"use client";

import { useMemo, useState } from "react";
type TableFilter = {
  fromDate?: string;
  toDate?: string;
  store?: string;
};

export function DynamicTable<T extends { id: number | string }>({
  data = [],
  columns = [],
  filterData,
  isHeaderTotal= false
}: TableProps<T>): import("react/jsx-runtime").JSX.Element {
  const [filters, setFilters] = useState<TableFilter>({});
  const [draft, setDraft] = useState<TableFilter>({});
  const [sortKey, setSortKey] = useState<string>(
    columns.length ? String(columns[0].key) : ""
  );
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const isValidDate = (val: unknown) => {
    if (!val) return false;
    const d = new Date(val as string);
    return !isNaN(d.getTime());
  };

  const applyFilters = () => setFilters(draft);
  const clearFilters = () => {
    setDraft({});
    setFilters({});
  };

  const uniqueStores = useMemo(() => {
    const set = new Set<string>();
    data.forEach((row) => {
      if ((row as any)?.store) set.add((row as any).store);
    });
    return Array.from(set);
  }, [data]);

  const processed = useMemo(() => {
    let filtered = [...data];

    if ((filters as any).fromDate) {
      filtered = filtered.filter((row) => {
        if (!isValidDate((row as any)?.date)) return true;
        return new Date((row as any).date) >= new Date((filters as any).fromDate);
      });
    }

    if ((filters as any).toDate) {
      filtered = filtered.filter((row) => {
        if (!isValidDate((row as any)?.date)) return true;
        return new Date((row as any).date) <= new Date((filters as any).toDate);
      });
    }

    if (sortKey) {
      filtered.sort((a, b) => {
        const aVal = (a as any)?.[sortKey];
        const bVal = (b as any)?.[sortKey];

        if (typeof aVal === "number" && typeof bVal === "number") {
          return sortOrder === "asc" ? aVal - bVal : bVal - aVal;
        }

        return sortOrder === "asc"
          ? String(aVal ?? "").localeCompare(String(bVal ?? ""))
          : String(bVal ?? "").localeCompare(String(aVal ?? ""));
      });
    }

    return filtered;
  }, [data, filters, sortKey, sortOrder]);

  const totals = useMemo(() => {
    return processed.reduce(
      (acc: { qty: number; amount: number }, row) => {
        if (typeof (row as any)?.qty === "number") acc.qty += (row as any).qty;
        if (typeof (row as any)?.qty === "number" && typeof (row as any)?.price === "number") {
          acc.amount += (row as any).qty * (row as any).price;
        }
        return acc;
      },
      { qty: 0, amount: 0 }
    );
  }, [processed]);

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortOrder((p) => (p === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow space-y-4">
      {/* Filters */}
      <div className="grid grid-cols-4 gap-4">
        <select
          value={""}
          onChange={(e) => setDraft({ ...draft, store: e.target.value })}
          className="border px-2 py-1"
        >
          <option value="">All Stores</option>
          {filterData.storeList.map((store:any) => (
            <option key={store._id} value={store._id}>
              {store.name}
            </option>
          ))}
        </select>

        <input
          type="date"
          value={draft.fromDate || ""}
          onChange={(e) => setDraft({ ...draft, fromDate: e.target.value })}
          className="border px-2 py-1"
        />

        <input
          type="date"
          value={draft.toDate || ""}
          onChange={(e) => setDraft({ ...draft, toDate: e.target.value })}
          className="border px-2 py-1"
        />

        <div className="flex gap-2">
          <button
            onClick={applyFilters}
            className="bg-blue-500 text-white px-3 py-1 rounded"
          >
            Search
          </button>
          <button
            onClick={clearFilters}
            className="bg-gray-300 px-3 py-1 rounded"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="max-h-[400px] overflow-auto border">
        <table className="w-full border text-sm">
          <thead className="sticky top-0 bg-gray-100">
            <tr>
              {columns.map((col) => (
                <th
                  key={String(col.key)}
                  onClick={() => handleSort(String(col.key))}
                  className="p-2 border cursor-pointer"
                >
                  {col.label}{" "}
                  {sortKey === col.key ? (sortOrder === "asc" ? "↑" : "↓") : ""}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {processed.map((row) => (
              <tr key={row.id} className="hover:bg-blue-50">
                {columns.map((col) => (
                  <td key={String(col.key)} className="border p-2">
                    {col.render
                      ? col.render(row)
                      : (row as any)?.[col.key] ?? "-"}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      { isHeaderTotal && 
      <div className="sticky bottom-0 bg-gray-100 border-t p-3 flex justify-between">
        <span>Total Qty: {totals.qty}</span>
        <span>Total Amount: ₹{totals.amount.toFixed(2)}</span>
      </div>
      }
    </div>
  );
}
