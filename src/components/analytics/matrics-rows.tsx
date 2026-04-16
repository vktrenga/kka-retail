import { Period, Store } from "@/types/analytics";
import { Metric } from "./matrix";
export function MetricsRow({
  currentStoreData,
}: {
  currentStoreData: any;
}) {
  return (
    <div className="mt-3 overflow-x-auto">
      <div className="flex gap-3 min-w-max">
        {currentStoreData.map((storeData: any, i: number) => (
          <div key={i} className="min-w-[100px]">
            <Metric
              label={storeData.name}
              value={(storeData.amount).toFixed(2)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}


