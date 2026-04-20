"use client";

import { listImportData } from "@/api/import";
import { DynamicTable } from "@/components/table/dynamicTable";
import { act, useEffect, useState } from "react";
import { storeServie } from "@/api/store";

type ImportedListData = {
  data?: {
    items?: any[];
  };
};

export default function Page() {
  const [importedListData, setImportedListData] = useState<ImportedListData | null>(null);
  useEffect(() => {
  const listData = async () => {
    try {
      const importedData = await listImportData({ status: ["Submitted"] });
      setImportedListData(importedData);
    } catch (err) {
      console.error(err);
    }
  };
  listData()
},[])

  const [data, setData] = useState<any[]>([]);
  type Store = { _id: string; name: string };
  const [storeList, setStoreList] = useState<Store[]>([]);
    useEffect(() => {
      const fetchStores = async () => {
        try {
          const res = await storeServie.getAll(); // Replace with your API
          setStoreList(res?.data?.data)
        } catch (err) {
          console.error("Failed to fetch stores", err);
        }
      };
      fetchStores();
    }, []);

  useEffect(() => {
      const rows = importedListData?.data?.items?.map((item: any) => {
        const store = storeList.find((s) => s._id === item.store);
        return {
          id: item._id,
          store: store?.name || "Unknown",
          date: item.date,
          cashandCard: item.groups?.daily_finance_data?.cashandCard || 0,
          actualCard: item.groups?.daily_finance_data?.actualCard || 0,
          actualCash: item.groups?.daily_finance_data?.actualCash || 0,
          manualPayout: item.groups?.daily_finance_data?.manualPayout || 0,
          bankEntry: item.groups?.daily_finance_data?.bankingEntry || 0,
          difference: item.groups?.daily_finance_data?.difference || 0,
          status: item.status,
          actions: [
            { url: `/sales/${item._id}/view`, label: "View" },
            { url: `/sales/${item._id}/unapproved`, label: "Approve" },
          ],
        };
      }) || []; // Ensure rows is always an array
      setData(rows);
    }, [importedListData, storeList]);

const columns = [
    { key: "store", label: "Store" },
    { key: "date", label: "Date" },
    { key: "cashandCard", label: "Card (inc CB & CBC)" },
    { key: "actualCard", label: "Actual Card" },
    { key: "actualCash", label: "Actual Cash" },
    { key: "manualPayout", label: "Manual payout" },
    { key: "bankEntry", label: "Bank Entry" },
    { key: "difference", label: "Difference" },
    { key: "actions", label: "Actions" },
  ];
  return (
    <div className="p-6 bg-blue-50 min-h-screen">
      <DynamicTable data={data} columns={columns} isHeaderTotal={false} />
    </div>
  );
}

