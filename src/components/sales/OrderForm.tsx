"use client";

import { useEffect, useState } from "react";
import { uploadFile } from "@/api/import";
import { storeServie } from "@/api/store";

type StoreOption = {
  label: string;
  value: string;
};

interface Props {
  onSuccess: (data: any) => void;
  onSubmit: () => void;
}

export const OrderForm: React.FC<Props> = ({
  onSubmit,
  onSuccess,
}) => {
  const [store, setStore] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [stores, setStores] = useState<StoreOption[]>([]);
  const [error, setError] = useState<string>("");

  // ✅ Fetch stores
  useEffect(() => {
    const fetchStores = async () => {
      try {
        const res = await storeServie.getAll();
        const options = res.data.data.map((s: any) => ({
          label: s.name,
          value: s._id,
        }));
        setStores(options);
      } catch (err) {
        console.error("Failed to fetch stores", err);
        setError("Failed to load stores");
      }
    };

    fetchStores();
  }, []);

  // ✅ File change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];

    if (!selected) return;

    const fileName = selected.name.toLowerCase();

    if (!fileName.endsWith(".xlsx") && !fileName.endsWith(".xls")) {
      setError("Only Excel files (.xlsx, .xls) are allowed");
      return;
    }

    // // ✅ Basic validation (optional)
    // if (!selected.name.endsWith(".xlsx") || !selected.name.endsWith(".xls")) {
    //   setError("Only Excel (.xlsx) files are allowed");
    //   return;
    // }
    
    setError("");
    setFile(selected);
  };

  // ✅ Submit
  const handleSubmit = async () => {
    if (!store) {
      setError("Please select a store");
      return;
    }

    if (!file) {
      setError("Please upload a file");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const data = await uploadFile(file, store);

      onSubmit();
      onSuccess(data);

      // ✅ Reset form
      setFile(null);
      setStore("");
    } catch (err) {
      console.error(err);
      setError("Upload failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow max-w-lg">
      <h2 className="text-lg font-semibold mb-4">
        Upload Store Data
      </h2>

      {/* Store Select */}
      <select
        className="w-full p-2 border rounded mb-3"
        value={store}
        onChange={(e) => setStore(e.target.value)}
        disabled={loading}
      >
        <option value="">Select Store</option>
        {stores.map((s) => (
          <option key={s.value} value={s.value}>
            {s.label}
          </option>
        ))}
      </select>

      {/* File Input */}
      <input
        type="file"
        accept=".xlsx, .xls"
        className="w-full mb-3"
        onChange={handleFileChange}
        disabled={loading}
      />

      {/* Error */}
      {error && (
        <p className="text-red-500 text-sm mb-2">{error}</p>
      )}

      {/* Button */}
      <button
        onClick={handleSubmit}
        disabled={loading}
        className={`w-full p-2 rounded text-white ${
          loading ? "bg-gray-400" : "bg-blue-600"
        }`}
      >
        {loading ? "Uploading..." : "Submit"}
      </button>
    </div>
  );
};
