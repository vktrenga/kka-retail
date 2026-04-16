import { createApi } from "./apiFactory";

export const settingAPI = createApi(
  process.env.NEXT_PUBLIC_AUTH_USER_STORE_BASE_URL!
);


export const importReportAPI = createApi(
  process.env.NEXT_PUBLIC_IMPORT_REPORT_BASE_URL!
);
