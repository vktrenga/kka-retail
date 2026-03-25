import { Category, PAGE_SIZE } from "@/types/analytics";

export function CategoryTable({
  categories,
  visibleCount,
  setVisibleCount,
  format,
}: {
  categories: Category[];
  visibleCount: number;
  setVisibleCount: React.Dispatch<React.SetStateAction<number>>;
  format: (n: number) => string;
}) {
  return (
    <div className="grid md:grid-cols-2 gap-4">
      {[0, 1].map((col) => {
        const data = categories.slice(
          col * visibleCount,
          (col + 1) * visibleCount
        );

        return (
          <div key={col} className="border rounded-lg overflow-hidden">
            <div className="max-h-[400px] overflow-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="p-3 text-left">Category</th>
                    <th>Qty</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((c, idx) => (
                    <tr key={idx} className="border-t hover:bg-gray-50">
                      <td className="p-3">{c.category}</td>
                      <td>{c.qty}</td>
                      <td>{format(c.total)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      })}

      {visibleCount < categories.length && (
        <div className="col-span-full text-center">
          <button
            onClick={() => setVisibleCount((v) => v + PAGE_SIZE)}
            className="px-5 py-2 bg-blue-600 text-white rounded"
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
}
