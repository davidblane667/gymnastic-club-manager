export type TUserRole = "admin" | "user";

export type TUser = {
  id: string;
  username: string;
  role: TUserRole;
};

export type TAuthState = {
  user: TUser | null;
  token: string | null;
  isAuthenticated: boolean;
};

export type TAuthGetters = {
  getUser: TUser | null;
  getToken: string | null;
  getIsAuthenticated: boolean;
  isAdmin: boolean;
};
