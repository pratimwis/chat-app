import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";

export const useChatStore = create((set,get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  setSelectedUser: (user) => 
  {
    set({ selectedUser: user });
  },
  isUsersLoading: false,
  isMessagesLoading: false,

  getUsersForSidebar: async () => {
    set({ isUsersLoading: true });
    try {
      const response = await axiosInstance.get(`/chat/users`);
      set({ users: response.data });
    } catch (error) {
      toast.error("Failed to fetch all users.");
    } finally {
      set({ isUsersLoading: false });
    }
  },
  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const response = await axiosInstance.get(`/chat/${userId}`);
      set({ messages: response.data });
    } catch (error) {
      toast.error("Failed to fetch messages.");
    } finally {
      set({ isMessagesLoading: false });
    }
  },
   sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    try {
      const res = await axiosInstance.post(`/chat/send/${selectedUser._id}`, messageData);
      set({ messages: [...messages, res.data] });
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

}));
