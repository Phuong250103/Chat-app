import { create } from 'zustand';
import toast from 'react-hot-toast';
import { axiosInstance } from '../lib/axios';

export const useChatStore = create((set) => ({
    messages: [],
    users: [],
    selectedUser: null,
    isUsersLoading: false,
    isMessagesLoading: false,
    onlineUssers: [],

    getUsers: async () => {
        set({ isUsersLoading: true });
        try {
          const res = await axiosInstance.get("/messages/users");
          set({ users: res.data });
        } catch (error) {
          toast.error("Loi khi lay danh sach nguoi dung");
        } finally {
          set({ isUsersLoading: false });
        }
      },
    
      getMessages: async (userId) => {
        set({ isMessagesLoading: true });
        try {
          const res = await axiosInstance.get(`/messages/${userId}`);
          set({ messages: res.data });
        } catch (error) {
          toast.error("Loi khi lay tin nhan");
        } finally {
          set({ isMessagesLoading: false });
        }
      },

    getSelectedUser: (user) => set({ selectedUser: user }),
}));