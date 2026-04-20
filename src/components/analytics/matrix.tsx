export function Metric({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  const amount = Number(value);

  const isDifference =
    label.toLowerCase() === "difference";

  const boxColor = isDifference
    ? amount > 0
      ? "bg-red-50 border-red-400"
      : "bg-green-50 border-green-400"
    : "bg-gray-50 border-gray-200";

  const textColor = isDifference
    ? amount > 0
      ? "text-red-700"
      : "text-green-700"
    : "text-black";

  return (
    <div className={`border rounded-md p-2 ${boxColor}`}>
      <div className="text-[10px] text-gray-500 truncate">
        {label}
      </div>

      <div className={`text-sm font-semibold ${textColor}`}>
        {amount.toFixed(2)}
      </div>
    </div>
  );
}