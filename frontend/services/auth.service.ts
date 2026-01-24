import api from "@/utils/api";

export const authService = {
  register: (data: any) => {
    return api.post("/users", data);
  },

  login: async (data: any) => {
    const response = await api.post("/auth/login", data);
    return response;
  },

  logout: async () => {
    return api.post("/auth/logout");
  },

  getProfile: async () => {
    return api.get("/auth/profile");
  },

  forgotPassword: (email: string) => {
    return api.post("/auth/forgot-password", { email });
  },
};
