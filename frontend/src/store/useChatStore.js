import toast from "react-hot-toast";
import { create } from "zustand";
import axiosInstance from "../utils/axiosInstance";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
  users: [],
  messages: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,

  getUsers: async () => {
    set({ isUsersLoading: true });

    try {
      const responce = await axiosInstance.get("/api/chat/users");
      set({ users: responce.data.users });
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        toast.error(error.response.data.message);
      } else {
        toast.error("An unexpected error occurred, Please try again.");
      }
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const responce = await axiosInstance.get(`/api/chat/${userId}`);
      set({ messages: responce.data.messages });
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        toast.error(error.response.data.message);
      } else {
        toast.error("An unexpected error occurred, Please try again.");
      }
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async (message) => {
    const { selectedUser, messages } = get();

    try {
      const responce = await axiosInstance.post(
        `/api/chat/send/${selectedUser._id}`,
        message
      );

      set({ messages: [...messages, responce.data.newmessage] });
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        toast.error(error.response.data.message);
      } else {
        toast.error("An unexpected error occurred, Please try again.");
      }
    }
  },

  subscribeToMessages: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;

    const socket = useAuthStore.getState().socket;

    socket.on("newmessage", (newmessage) => {      
      if (newmessage.senderId !== selectedUser._id) return;

      set({
        messages: [...get().messages, newmessage],
      });
    });
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("newmessage");
  },
  setSelectedUser: (user) => set({ selectedUser: user })
}));
