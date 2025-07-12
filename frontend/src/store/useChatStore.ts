import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";
import type { UserType, MessageType } from "../lib/types";

type ChatStore = {
  messages: MessageType[];
  users: UserType[];
  selectedUser: UserType | null;
  isUsersLoading: boolean;
  isMessagesLoading: boolean;
  isSearchingUsers: boolean;
  allUsers: UserType[];
  setSelectedUser: (user: UserType | null) => void;
  getUsersForSidebar: () => Promise<void>;
  getMessages: (userId: string) => Promise<void>;
  sendMessage: (messageData: {
    text: string;
    image: string | null;
  }) => Promise<void>;
  subscribeToMessages: () => void;
  unsubscribeFromMessages: () => void;
  getAllUsers: (query: string) => Promise<void>;
  addUser: boolean;
  setAddUser: (value: boolean) => void;
};

export const useChatStore = create<ChatStore>((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,
  isSearchingUsers: false,
  allUsers: [],
  addUser: false,

  setAddUser: (value) => {
    set({ addUser: value });
  },

  setSelectedUser: (user) => {
    set({ selectedUser: user });
  },

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

  getAllUsers: async (query) => {
    set({ isSearchingUsers: true });
    if (query.trim() === "") {
      set({ allUsers: [] });
      set({ isSearchingUsers: false });
      return;
    }
    try {
      const response = await axiosInstance.get(
        `/chat/all-users?search=${query}`
      );
      set({ allUsers: response.data });
    } catch (error) {
      toast.error("Failed to fetch users.");
    } finally {
      set({ isSearchingUsers: false });
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
      const res = await axiosInstance.post(
        `/chat/send/${selectedUser?._id}`,
        messageData
      );
      set({ messages: [...messages, res.data] });
      get().setAddUser(false);
      get().getUsersForSidebar();
    } catch (error: any) {
      toast.error(error.response.data.message);
    }
  },

  subscribeToMessages: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;

    const socket = useAuthStore.getState().socket;

    socket.on("newMessage", (newMessage: MessageType) => {
      const isMessageSentFromSelectedUser =
        newMessage.senderId === selectedUser._id;
      if (!isMessageSentFromSelectedUser) return;

      set({
        messages: [...get().messages, newMessage],
      });
    });
  },
  unsubscribeFromMessages: async () => {
    const socket = useAuthStore.getState().socket;
    socket.off("newMessage");
  },
}));
