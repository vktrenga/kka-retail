import { importReportAPI } from "./apis";
export const fetchReport = async (filter: any) => {
  const res = await importReportAPI.post("report/summary/", filter, {
    withCredentials: true,
  });
  return res.data;
};


