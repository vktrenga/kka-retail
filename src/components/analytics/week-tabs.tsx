import { PAGE_SIZE, Period } from "@/types/analytics";

export function WeekTabs({
  weeks,
  activeIndex,
  setActiveIndex,
  setVisibleCount,
  format,
}: {
  weeks: Period[];
  activeIndex: number | null;
  setActiveIndex: React.Dispatch<React.SetStateAction<number | null>>;
  setVisibleCount: React.Dispatch<React.SetStateAction<number>>;
  format: (n: number) => string;
}) {
  return (
    <div className="flex gap-3 overflow-x-auto">
      {weeks.map((w, idx) => (
        <div
          key={idx}
          onClick={() => {
            setActiveIndex(idx);
            setVisibleCount(PAGE_SIZE);
          }}
          className={`min-w-[120px] p-3 rounded-lg border cursor-pointer ${
            activeIndex === idx
              ? "bg-blue-600 text-white"
              : "bg-white hover:bg-gray-50"
          }`}
        >
          <div className="text-xs">{w.label}</div>
          <div className="font-semibold">{format(w.totalSale)}</div>
        </div>
      ))}
    </div>
  );
}