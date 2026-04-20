
import { settingAPI } from "./apis";
import type { User } from "@/types/user";

export const userService = {
getAll: async () => {
  const res = await settingAPI.get("/users/", {});
  return res;
},


add: async (data: User) => {
  const res = await settingAPI.post("/users/", data);
  return res;
},

edit: async (id: string, data: Partial<User>) => {
  const res = await settingAPI.put(`users/${id}`, data);
  // localStorage.setItem("access_token", res.data.data.token); // Will refactor token handling later
  return res;
},

get: async (id: string) => {
  const res = await settingAPI.get(`/users/${id}`);
  // localStorage.setItem("access_token", res.data.data.token); // Will refactor token handling later
  return res;
},
delete: async (id: string) => {
  const res = await settingAPI.delete(`/users/${id}`);
  // localStorage.setItem("access_token", res.data.data.token); // Will refactor token handling later
  return res;
}
}


