import { Mode, Store } from "@/types/analytics";
import { MetricsRow } from "./matrics-rows";
import { WeekTabs } from "./week-tabs";
import { DayTabs } from "./days-tabs";
import { CategoryTable } from "./category-table";

export function StoreCard({
  store,
  index,
  activeStores,
  setActiveStores,
  activeIndex,
  setActiveIndex,
  visibleCount,
  setVisibleCount,
  format,
  mode,
}: {
  store: Store;
  index: number;
  activeStores: number[];
  setActiveStores: React.Dispatch<React.SetStateAction<number[]>>;
  activeIndex: number | null;
  setActiveIndex: React.Dispatch<React.SetStateAction<number | null>>;
  visibleCount: number;
  setVisibleCount: React.Dispatch<React.SetStateAction<number>>;
  format: (n: number) => string;
  mode: Mode;
}) {
  const isOpen = activeStores.includes(index);

  return (
    <div className="bg-white rounded-xl border shadow-sm">
      <div
        className="p-4 cursor-pointer hover:bg-gray-50"
        onClick={() =>
          setActiveStores((prev) =>
            prev.includes(index)
              ? prev.filter((s) => s !== index)
              : [...prev, index]
          )
        }
      >
        <div className="flex justify-between">
          <h2 className="font-medium">{store.storeName}</h2>
          <span className="text-xs text-gray-400">
            {isOpen ? "▲" : "▼"}
          </span>
        </div>

        <MetricsRow store={store} format={format} />
      </div>

      {isOpen && (
        <div className="p-4 space-y-4">
          {mode === "week" && (
            <WeekTabs
              weeks={store.weeks}
              activeIndex={activeIndex}
              setActiveIndex={setActiveIndex}
              setVisibleCount={setVisibleCount}
              format={format}
            />
          )}

          {mode === "day" && (
            <DayTabs
              activeIndex={activeIndex}
              setActiveIndex={setActiveIndex}
              setVisibleCount={setVisibleCount}
            />
          )}

          {activeIndex !== null && (
            <>
              <MetricsRow store={store.weeks[0]} format={format} />

              <CategoryTable
                categories={store.weeks[0].categories}
                visibleCount={visibleCount}
                setVisibleCount={setVisibleCount}
                format={format}
              />
            </>
          )}
        </div>
      )}
    </div>
  );
}
