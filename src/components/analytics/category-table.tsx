import { Category } from "@/types/analytics";
import { toNumber } from "@/utils/commonTypes";

// ✅ reusable column type
export type Column<T> = {
  name: Extract<keyof T, string>;
  label: string;
  type: "number" | "string";
};

export function CategoryTable({
  title,
  categories,
  columns,
}: {
  title: string;
  categories: Category[];
  columns: Column<Category>[];
}) {
  const columnTotals = columns.reduce((acc, col) => {
    if (col.type === "number") {
      acc[col.name] = categories.reduce(
        (sum, row) => sum + toNumber(row[col.name]),
        0
      );
    }
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="border rounded-lg overflow-hidden flex flex-col">
      {/* Title */}
      <div className="bg-gray-100 px-4 py-2 font-semibold border-b">
        {title}
      </div>

      {/* Table */}
      <div className="max-h-[400px] overflow-auto">
        <table className="min-w-full text-sm">

          {/* Header */}
          <thead className="bg-gray-50 sticky top-0 z-10">
            <tr>
              {columns.map((col) => (
                <th key={col.name} className="p-3 text-left">
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>

          {/* Body */}
          <tbody>
            {categories.map((cat, rowIdx) => (
              <tr key={rowIdx} className="border-t hover:bg-gray-50">
                {columns.map((col) => {
                  const value = cat[col.name];

                  return (
                    <td key={col.name} className="p-3 text-left">
                      {col.type === "number"
                        ? toNumber(value).toFixed(2)
                        : String(value ?? "")}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>

          {/* Footer */}
          <tfoot className="sticky bottom-0 bg-gray-100 z-10 border-t">
            <tr className="font-semibold">
              {columns.map((col, idx) => (
                <td key={col.name} className="p-3">
                  {idx === 0
                    ? "Total"
                    : col.type === "number"
                    ? (columnTotals[col.name] || 0).toFixed(2)
                    : ""}
                </td>
              ))}
            </tr>
          </tfoot>

        </table>
      </div>
    </div>
  );
}