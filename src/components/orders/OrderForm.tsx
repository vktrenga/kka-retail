"use client";

interface Props {
  onSubmit: () => void;
}

export const OrderForm: React.FC<Props> = ({ onSubmit }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow max-w-lg">
      <h2 className="text-lg font-semibold mb-4">Upload Store Data</h2>

      <select className="w-full p-2 border rounded mb-3">
        <option>Select Store</option>
        <option>Store A</option>
        <option>Store B</option>
      </select>

      <input type="file" className="w-full mb-3" />

      <button
        onClick={onSubmit}
        className="w-full bg-blue-600 text-white p-2 rounded"
      >
        Submit
      </button>
    </div>
  );
};
