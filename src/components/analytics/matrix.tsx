export function Metric({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="bg-gray-50 border rounded-md p-2">
      <div className="text-[10px] text-gray-500 truncate">{label}</div>
      <div className="text-sm font-semibold">{Number(value).toFixed(2)}</div>
    </div>
  );
}
