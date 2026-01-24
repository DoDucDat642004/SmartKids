import api from "@/utils/api";

export const chatService = {
  chat: async (message: string, history: any) => {
    return api.post("/chat/talk", {
      message: message,
      history: history,
    });
  },
};
