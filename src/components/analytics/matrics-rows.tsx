import { Period, Store } from "@/types/analytics";
import { Metric } from "./matrix";

export function MetricsRow({
  store,
  format,
}: {
  store: Period | Store;
  format: (n: number) => string;
}) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-3 text-sm">
      <Metric label="Total" value={format(store.totalSale)} />
      <Metric label="Promo" value={format(store.promotion)} />
      <Metric label="Return" value={format(store.returns)} />
      <Metric label="Cash" value={format(store.cash)} />
      <Metric label="UPI" value={format(store.upi)} />
    </div>
  );
}
