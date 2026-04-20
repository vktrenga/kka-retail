import { settingAPI } from "./apis";


export const storeServie = {
  getAll: async () => {
    const res = await settingAPI.get("/store/", {});
    return res;
},

}


