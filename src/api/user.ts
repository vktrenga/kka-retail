import { settingAPI } from "./apis";

export const userService = {
getAll: async () => {
  const res = await settingAPI.get("/users", {});
  return res;
},

add: async (data: any) => {
  const res = await settingAPI.post("/users", data);
  return res;
},

edit: async (id:any, data: any) => {
  const res = await settingAPI.put(`users/${id}`, data);
  localStorage.setItem("access_token", res.data.data.token);
  return res;
},

get: async (id: any) => {
  const res = await settingAPI.get(`/users/${id}`);
  localStorage.setItem("access_token", res.data.data.token);
  return res;
},
delete: async (id: any) => {
  const res = await settingAPI.post("/users", id);
  localStorage.setItem("access_token", res.data.data.token);
  return res;
}
}

