import { useState, useEffect } from "react";
import { getSalesDataById } from "@/api/import";

export function useFetchSalesData(id: string) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [initialData, setInitialData] = useState<any>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await getSalesDataById(id);
        setInitialData(res.data);
      } catch (err) {
        setError("Failed to load data");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id]);

  return { loading, error, initialData };
}