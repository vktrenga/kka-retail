"use client";
import { useMemo, useState } from "react";

export function DynamicTable<T extends { id: number | string }>({
  data = [],
  columns = [],
  isHeaderTotal= false,
}: TableProps<T>): import("react/jsx-runtime").JSX.Element {
  const [sortKey, setSortKey] = useState<string>(
    columns.length ? String(columns[0].key) : ""
  );
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

 
  const processed = useMemo(() => {
    let filtered = [...data];
   
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
  }, [data, sortKey, sortOrder]);

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
                    {col.key === "actions" && Array.isArray((row as any)?.actions) ? (
                      <div className="flex gap-2">
                        {(row as any).actions.map((action: { url: string; label: string }, idx: number) => (
                          <a
                            key={idx}
                            href={action.url}
                            className="text-blue-600 hover:underline"
                          >
                            {action.label}
                          </a>
                        ))}
                      </div>
                    ) : col.key === "difference" ? (
                      <span
                        style={{
                          color: (row as any)?.[col.key] > 0 ? "red" : "green",
                        }}
                      >
                        {(row as any)?.[col.key] ?? "-"}
                      </span>
                    ) : col.render ? (
                      col.render(row)
                    ) : (
                      (row as any)?.[col.key] ?? "-"
                    )}
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
        <span></span>
        <span>Total Amount: ₹{totals.amount.toFixed(2)}</span>
      </div>
      }
    </div>
  );
}
