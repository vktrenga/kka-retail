interface TableProps {
  title: string;
  data?: any[];
  columns?: string[];
  rowsPerView?: number;
  showTotal?: boolean;
}

export const Table: React.FC<TableProps> = ({
  title,
  data = [],
  columns = ["Column 1", "Column 2", "Column 3"],
  rowsPerView = 25,
  showTotal = true,
}) => {
  const displayData = data.length
    ? data
    : Array.from({ length: 50 }, (_, i) => ({
        col1: `${title} Row ${i + 1}`,
        col2: `Value ${i + 1}`,
        col3: `Value ${i + 1}`,
      }));

  return (
    <div className="bg-white rounded-b-xl border shadow">

      {/* Title */}
      <div className="p-4 font-semibold border-b">{title}</div>

      {/* Scrollable Table */}
      <div className="max-h-[500px] overflow-auto">
        <table className="w-full text-sm border-collapse">

          {/* Sticky Header */}
          <thead className="sticky top-0 bg-gray-100 z-10">
            <tr>
              {columns.map((col) => (
                <th key={col} className="p-3 border text-left">
                  {col}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {displayData.slice(0, rowsPerView).map((row, i) => (
              <tr key={i} className="hover:bg-blue-50">
                <td className="p-3 border">{row.col1}</td>
                <td className="p-3 border">{row.col2}</td>
                <td className="p-3 border">{row.col3}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Sticky Footer (Total) */}
      {showTotal && (
        <div className="sticky bottom-0 bg-gray-100 border-t p-3 font-medium flex justify-between">
          <span>Total</span>
          <span>{displayData.length} Rows</span>
        </div>
      )}
    </div>
  );
};
