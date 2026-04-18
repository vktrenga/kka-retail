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

// Function to approve data
export const approveData = async (data: { id: string; comment: string }) => {
  const res = await importReportAPI.post("import/approve", data, {
    withCredentials: true,
  });
  return res.data;
};

export const listImportData = async (data: any) => {
  const params = new URLSearchParams();

  if (data?.status) {
    let statusArray: string[];

    if (Array.isArray(data.status)) {
      statusArray = data.status;
    } else if (typeof data.status === "string") {
      statusArray = data.status.split(",").map((s: string) => s.trim());
    } else {
      statusArray = [];
    }

    statusArray.forEach((s) => params.append("status", s));
  }

  if (data?.fromDate) {
    params.append("from_date", data.fromDate);
  }

  if (data?.toDate) {
    params.append("to_date", data.toDate);
  }

  if (data?.store) {
    params.append("store", data.store);
  }

  console.log("Request params:", params.toString());

  const res = await importReportAPI.get(
    `import/list/?${params.toString()}`,
    {
      withCredentials: true,
    }
  );

  return res.data;
};

export const getSalesDataById = async (id: string) => {
  const res = await importReportAPI.get("import/get/"+id, {
    withCredentials: true,
  }); 
  return res.data;
};