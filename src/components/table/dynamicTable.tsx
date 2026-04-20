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
}: TableProps<T>): JSX.Element {
  const [sortKey, setSortKey] = useState<string>(
    columns.length ? String(columns[0].key) : ""
  );
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const [expandedRows, setExpandedRows] = useState<
    Record<string | number, boolean>
  >({});

  const toggleRow = (id: string | number) => {
    setExpandedRows((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // ✅ Sorting
  const processed = useMemo(() => {
    const sorted = [...data];

    if (sortKey) {
      sorted.sort((a, b) => {
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

    return sorted;
  }, [data, sortKey, sortOrder]);

  // ✅ Totals
  const totals = useMemo(() => {
    return processed.reduce((acc: Record<string, number>, row) => {
      Object.keys(row).forEach((key) => {
        const value = (row as any)[key];
        if (typeof value === "number") {
          acc[key] = (acc[key] || 0) + value;
        }
      });
      return acc;
    }, {});
  }, [processed]);

  const safeTotals = useMemo(() => {
    return Object.keys(totals).reduce((acc, key) => {
      acc[key] = totals[key] ?? 0;
      return acc;
    }, {} as Record<string, number>);
  }, [totals]);

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortOrder((p) => (p === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow h-full flex flex-col">
      {/* ✅ Scroll container (ONLY this scrolls) */}
      <div className="flex-grow overflow-y-auto border max-h-[500px]">
        <table className="w-full border-collapse table-fixed">
          <colgroup>
            {columns.map((_, i) => (
              <col key={i} style={{ width: `${100 / columns.length}%` }} />
            ))}
          </colgroup>

          {/* ✅ Sticky Header */}
          <thead className="sticky top-0 bg-gray-100 z-20">
            <tr>
              {columns.map((col) => (
                <th
                  key={String(col.key)}
                  onClick={() => handleSort(String(col.key))}
                  className="p-3 border text-left cursor-pointer"
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>

          {/* ✅ Body */}
          <tbody>
            {processed.map((row) => (
              <tr key={row.id} className="hover:bg-blue-50">
                {columns.map((col) => {
                  const value = (row as any)?.[col.key];

                  return (
                    <td
                      key={String(col.key)}
                      className={`p-3 border ${
                        typeof value === "number" ? "text-right" : "text-left"
                      }`}
                    >
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
                            color: value > 0 ? "red" : "green",
                          }}
                        >
                          {value ?? "-"}
                        </span>

                      /* ApprovalComment expand */
                      ) : col.key === "ApprovalComment" ? (
                        <span
                          className="cursor-pointer"
                          onClick={() => toggleRow(row.id)}
                        >
                          {value
                            ? expandedRows[row.id]
                              ? String(value)
                              : String(value).length > 15
                              ? `${String(value).slice(0, 15)}...`
                              : String(value)
                            : "-"}
                        </span>

                      /* Custom render */
                      ) : col.render ? (
                        col.render(row)

                      /* Default */
                      ) : (
                        value ?? "-"
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>

          {/* ✅ Sticky Footer */}
          {isHeaderTotal && (
            <tfoot className="sticky bottom-0 bg-gray-100 z-20">
              <tr className="font-semibold">
                {columns.map((col) => {
                  const value = safeTotals[col.key as string];

                  return (
                    <td
                      key={String(col.key)}
                      className="p-3 border text-right"
                    >
                      {typeof value === "number"
                        ? value.toFixed(2)
                        : "-"}
                    </td>
                  );
                })}
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </div>
  );
}