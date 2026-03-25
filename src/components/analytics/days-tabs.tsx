import { PAGE_SIZE } from "@/types/analytics";

export function DayTabs({
  activeIndex,
  setActiveIndex,
  setVisibleCount,
}: {
  activeIndex: number | null;
  setActiveIndex: React.Dispatch<React.SetStateAction<number | null>>;
  setVisibleCount: React.Dispatch<React.SetStateAction<number>>;
}) {
  const days = Array.from({ length: 31 }, (_, i) => i + 1);

  return (
    <div className="flex gap-2 overflow-x-auto pb-2">
      {days.map((d) => (
        <div
          key={d}
          onClick={() => {
            setActiveIndex(d);
            setVisibleCount(PAGE_SIZE);
          }}
          className={`min-w-[50px] text-center py-2 rounded-lg border cursor-pointer ${
            activeIndex === d
              ? "bg-blue-600 text-white"
              : "bg-white hover:bg-gray-50"
          }`}
        >
          {d}
        </div>
      ))}
    </div>
  );
}