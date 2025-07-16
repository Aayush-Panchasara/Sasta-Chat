import { create } from "zustand";
import axiosInstance from "../utils/axiosInstance.js";
import toast from "react-hot-toast";
import { useChatStore } from "./useChatStore.js";
import { io } from "socket.io-client";

// TODO : ----------------
// const { setSelectedUser } = useChatStore();
const BASE_URL = "http://localhost:7000";

export const useAuthStore = create((set, get) => ({
  userData: null,
  isCheckingUser: true,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  onlineUsers: [],
  socket: null,

  checkUser: async () => {
    try {
      const responce = await axiosInstance.get("/api/user/get-user");
      // console.log(responce);
      set({ userData: responce.data.user });
      get().connectSocket()
    } catch (error) {
      console.log("Error:", error);
      set({ userData: null });
    } finally {
      set({ isCheckingUser: false });
    }
  },

  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const responce = await axiosInstance.post("/api/user/register", data);

      // console.log(responce);
      console.log(responce.data.createdUSer);

      set({ userData: responce.data.createdUSer });

      toast.success("Account created successfully");
      get().connectSocket()
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
      set({ isSigningUp: false });
    }
  },

  login: async (data) => { 
    set({ isLoggingIn: true });
    try {
      const responce = await axiosInstance.post("/api/user/login", data);

      set({ userData: responce.data.loggedInUser });
      console.log(responce.data.loggedInUser);

      toast.success("Logged in successfully");
      get().connectSocket()
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
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post("/api/user/logout");
      set({ userData: null });
      // setSelectedUser(null);
      useChatStore.setState({ selectedUser: null });
      toast.success("Logged out successfully");
      get().disConnectSocket()
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

  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const responce = await axiosInstance.post(
        "/api/user/update-profilepic",
        data
      );

      set({ userData: responce.data.user });
      toast.success("Profile updated successfully");
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
      set({ isUpdatingProfile: false });
    }
  },

  connectSocket: () => {
    const { userData } = get();
    if (!userData || get().socket?.connected) return;

    const socket = io(BASE_URL, {
      query: {
        userId: userData._id,
      },
    });
    socket.connect();

    set({ socket: socket });

    socket.on("getAllOnlineUsers", (userIds) => {
      set({ onlineUsers: userIds });
    });
  },

  disConnectSocket: () => {
    if(get().socket?.connected) get().socket.disconnect();
  },
}));
