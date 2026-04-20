import { Period, Store } from "@/types/analytics";
import { Metric } from "./matrix";
type MetricData = { name: string; amount: number };
export function MetricsRow({
  currentStoreData,
}: {
  currentStoreData: MetricData[];
}) {
  return (
    <div className="mt-3 overflow-x-auto">
      <div className="flex gap-3 min-w-max">
        {currentStoreData.map((storeData, i) => (
          <div key={i} className="min-w-[100px]">
            <Metric
              label={storeData.name}
              value={storeData.amount.toFixed(2)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}


