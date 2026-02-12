import { api } from "./index";

type TLoginRequest = {
  username: string;
  password: string;
};

type TUserRole = "admin" | "user";

type TLoginResponse = {
  token: string;
  user: {
    id: string;
    username: string;
    role: TUserRole;
  };
};

type TUser = {
  id: string;
  username: string;
  role: TUserRole;
};

export const authApi = {
  login: (data: TLoginRequest) => api.post<TLoginResponse>("/auth/login", data, true),
  me: () => api.get<TUser>("/auth/me"),
};
