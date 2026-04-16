export function DayTabs({
  activeIndex,
  setActiveIndex,
  modeKeys,
}: {
  activeIndex: string | null;
  setActiveIndex: (value: string | null) => void;
  modeKeys: string[];
}) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2">
      {modeKeys?.map((d) => (
        <div
          key={d}
          onClick={() => setActiveIndex(d)}
          className={`min-w-[80px] text-center py-2 rounded-lg border cursor-pointer ${
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
