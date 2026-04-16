import { useState } from "react";
import { Mode } from "@/types/analytics";




export function Header({
  mode,
  setMode,
}: {
  mode: Mode;
  setMode: (m: Mode) => void;
}) {
  const [selectedStores, setSelectedStores] = useState<number[]>([]);

  const toggleStore = (id: number) => {
    setSelectedStores((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  return (
    <div className="flex justify-between items-center w-full space-x-6">
      {/* Title */}
      <h1 className="text-2xl font-semibold text-gray-800">Retail Analytics</h1>

      {/* Mode Buttons */}
      <div className="flex bg-white border rounded-xl p-1 shadow-sm space-x-2">
        {["day", "week", "month"].map((m) => (
          <button
            key={m}
            onClick={() => setMode(m as Mode)}
            className={`px-4 py-1.5 text-sm rounded-lg ${
              mode === m
                ? "bg-blue-600 text-white"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            {m.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Store Dropdown */}
      
    </div>
  );
}
