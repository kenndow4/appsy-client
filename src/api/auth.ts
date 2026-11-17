import { Api } from "@/lib/api";

export const loginApi = async (email: string, password: string) => {
  return Api.post("/auth/login", { email, password });
};
export const registerApi = async (name: string, email: string, password: string) => {
  const res = await Api.post("/auth/register", {name, email, password });
  return res;
}
export const getUserApi = async (token: string) => {
  return Api.get(`/auth/me`, token);
}