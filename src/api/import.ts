import { importReportAPI } from "./apis";
export const uploadFile = async (file: File, store: string) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("store", store);
  const res = await importReportAPI.post("import/upload", formData, {
    withCredentials: true,
  });
  return res.data;
};

export const updateSalesData = async (id: any, data:any) => {
  const res = await importReportAPI.put("import/update/"+id, data, {
    withCredentials: true,
  });
  
  return res.data;
};



export const listImportData = async (data: any) => {
  const params: any = {};

    if (data?.status) {
    let statusArray: string[];
    if (Array.isArray(data.status)) {
      statusArray = data.status;
    } else if (typeof data.status === "string") {
      statusArray = data.status.split(",").map((s: string) => s.trim());
    } else {
      statusArray = [];
    }

    params.status = statusArray;
  }
  const res = await importReportAPI.get("import/list/", {
    params,
    withCredentials: true,
  });

  return res.data;
};
