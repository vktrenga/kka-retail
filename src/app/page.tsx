"use client";

export default function Page() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="bg-white p-5 rounded-2xl shadow hover:shadow-md transition"
        >
          <h2 className="text-gray-500 text-sm">Metric {i}</h2>
          <p className="text-2xl font-bold mt-2">{i * 1000}</p>
        </div>
      ))}
    </div>
  );
}
