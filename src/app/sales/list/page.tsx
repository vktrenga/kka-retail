"use client";

import { listImportData, updateSalesData } from "@/api/import";
import { DynamicTable } from "@/components/table/dynamicTable";
import { useEffect, useMemo, useState } from "react";
import { storeServie } from "@/api/store";

export default function Page() {
  const [importedListData, setImportedListData] = useState([]);
  useEffect(() => {
  const listData = async () => {
    try {
      const importedData = await listImportData({ status: ["Draft"] });
      setImportedListData(importedData);
    } catch (err) {
      console.error(err);
    }
  };
  listData()
},[])

  const [data, setData] = useState<Row[]>([]);
    const [storeList, setStoreList] = useState<[]>([]);
    
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
    const generated: any[]=[];
    importedListData?.data?.items?.forEach((apiData)=>{
      const currentStore: any = storeList.find((store)=>{ return store._id === apiData.store });
      generated.push({
        id: apiData?._id,
        store:currentStore?.name,
        date:apiData.date,
      })
    })

    setData(generated);
  }, [importedListData]);

  const columns: Column<Row>[] = [
    { key: "store", label: "Store" },
    { key: "date", label: "Date" },
    { key: "status", label: "Status" },
  ];
  const filterData: any = {};
  filterData.storeList = storeList;
  return (
    <div className="p-6">
      <DynamicTable data={data} columns={columns} filterData={filterData} isHeaderTotal={false}/>
    </div>
  );
}
