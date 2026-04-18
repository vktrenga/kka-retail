"use client";
import { useMemo, useState } from "react";

type Column<T> = {
  key: Extract<keyof T, string> | string;
  label: string;
  render?: (row: T) => React.ReactNode;
};

type TableProps<T> = {
  data: T[];
  columns: Column<T>[];
  isHeaderTotal?: boolean;
};

export function DynamicTable<T extends { id: number | string }>({
  data = [],
  columns = [],
  isHeaderTotal = false,
}: TableProps<T>): import("react/jsx-runtime").JSX.Element {
  const [sortKey, setSortKey] = useState<string>(
    columns.length ? String(columns[0].key) : ""
  );
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  // ✅ Track expanded rows
  const [expandedRows, setExpandedRows] = useState<
    Record<string | number, boolean>
  >({});

  const toggleRow = (id: string | number) => {
    setExpandedRows((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

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
        if (typeof (row as any)?.qty === "number") {
          acc.qty += (row as any).qty;
        }

        if (
          typeof (row as any)?.qty === "number" &&
          typeof (row as any)?.price === "number"
        ) {
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
      <div className="max-h-[800px] overflow-auto border">
        <table className="w-full border-collapse">
          <colgroup>
            {columns.map((_, index) => (
              <col
                key={index}
                style={{ width: `${100 / columns.length}%` }}
              />
            ))}
          </colgroup>

          <thead className="sticky top-0 bg-gray-100">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="p-3 border text-left cursor-pointer"
                  onClick={() => handleSort(String(col.key))}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {processed.map((row) => (
              <tr key={row.id} className="hover:bg-blue-50">
                {columns.map((col) => (
                  <td key={col.key} className="p-3 border">
                    {/* Actions */}
                    {col.key === "actions" &&
                    Array.isArray((row as any)?.actions) ? (
                      <div className="flex gap-2">
                        {(row as any).actions.map(
                          (
                            action: { url: string; label: string },
                            idx: number
                          ) => (
                            <a
                              key={idx}
                              href={action.url}
                              className="text-blue-600 hover:underline"
                            >
                              {action.label}
                            </a>
                          )
                        )}
                      </div>

                    /* Difference */
                    ) : col.key === "difference" ? (
                      <span
                        style={{
                          color:
                            (row as any)?.[col.key] > 0
                              ? "red"
                              : "green",
                        }}
                      >
                        {(row as any)?.[col.key] ?? "-"}
                      </span>

                    /* ✅ ApprovalComment (click to expand) */
                    ) : col.key === "ApprovalComment" ? (
                      <span
                        className="cursor-pointer"
                        onClick={() => toggleRow(row.id)}
                      >
                        {(row as any)[col.key]
                          ? expandedRows[row.id]
                            ? String((row as any)[col.key])
                            : String((row as any)[col.key]).length > 15
                            ? `${String((row as any)[col.key]).slice(0, 15)}...`
                            : String((row as any)[col.key])
                          : "-"}
                      </span>

                    /* Custom render */
                    ) : col.render ? (
                      col.render(row)

                    /* Default */
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
      {isHeaderTotal && (
        <div className="sticky bottom-0 bg-gray-100 border-t p-3 flex justify-between">
          <span></span>
          <span>Total Amount: ₹{totals.amount.toFixed(2)}</span>
        </div>
      )}
    </div>
  );
}
