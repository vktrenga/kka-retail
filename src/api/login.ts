import { settingAPI } from "./apis";

export type LoginPayload = {
  email: string;
  password: string;
};

export const login = async (data: LoginPayload) => {
  const res = await settingAPI.post("auth/login", data);
  document.cookie = `access_token=${res.data.data.token}; path=/`;
  localStorage.setItem("access_token", res.data.data.token);
  
  return res;
};
