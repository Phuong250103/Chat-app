import {create} from 'zustand';
import {axiosInstance} from '../lib/axios.js';
import toast from 'react-hot-toast';
import { io } from 'socket.io-client';

const BASE_URL = "http://localhost:5001"; // URL của server socket

export const useAuthStore = create((set, get) => ({
    authUser: null, // thông tin người dùng đã xác thực
    isSigningUp: false, // trạng thái xác thực người dùng
    isLoggingIn: false, // trạng thái đăng nhập người dùng
    isUpdatingProfile: false, // trạng thái cập nhật thông tin người dùng

    isChecking: true, // trạng thái kiểm tra xác thực
    onlineUsers: [], // danh sách người dùng trực tuyến
    socket: null, // socket kết nối

    checkAuth: async () => {
        try {
            const res = await axiosInstance.get("/auth/check");
            set({authUser:res.data}); // nếu xác thực thành công, lưu thông tin người dùng vào store
            get().connectSocket(); // kết nối socket khi xác thực thành công
        } catch (error) {
            console.error("Loi kiem tra xac thuc:", error);
            set({authUser:null}); // nếu xác thực thất bại, xóa thông tin người dùng khỏi store
            
        } finally {
            set({isChecking:false}); // cập nhật trạng thái kiểm tra xác thực
        }
    },

    signup: async (data) => {
       set ({isSigningUp: true}); // cập nhật trạng thái xác thực người dùng
       try {
        const res = await axiosInstance.post("/auth/signup", data);
        toast.success("Đăng ký thành công!");
        set({authUser: res.data}); // lưu thông tin người dùng vào store
        get().connectSocket(); // kết nối socket khi đăng ký thành công
       } catch (error) {
        toast.error("Đăng ký thất bại!");
       }finally {
        set({isSigningUp: false});
       }
    },

    logout: async () => {
        try {
            await axiosInstance.post("/auth/logout");
            set({authUser: null});
            toast.success("Đăng xuất thành công!");
            get().disconnectSocket(); // ngắt kết nối socket khi đăng xuất thành công
        } catch (error) {
            toast.error("Đăng xuất thất bại!");
        }
    },

    login: async (data) => {
        set({isLoggingIn: true}); // cập nhật trạng thái đăng nhập người dùng
        try {
            const res = await axiosInstance.post("/auth/login", data);
            set({authUser: res.data}); // lưu thông tin người dùng vào store
            toast.success("Đăng nhập thành công!");

            get().connectSocket(); // kết nối socket khi đăng nhập thành công
        } catch (error) {
            toast.error("Đăng nhập thất bại!");
        } finally {
            set({isLoggingIn: false});
        }
    },

    updateProfile: async (data) => {
        set({isUpdatingProfile: true});
        try {
            const res = await axiosInstance.put("/auth/update-profile", data);
            set({authUser: res.data});
            toast.success("Cập nhật thông tin thành công!");
        } catch (error) {
            toast.error("Cập nhật thông tin thất bại!");
        } finally {
            set({isUpdatingProfile: false});
        }
    },

    connectSocket: () =>{
        const {authUser} = get(); // lấy thông tin người dùng từ store
        if(!authUser || get().socket?.connected) return; // nếu không có thông tin người dùng, không kết nối socket
        const socket = io(BASE_URL, {
            query: {
                userId: authUser._id
            }, // gửi id người dùng vào query params
        });
        socket.connect(); // kết nối đến server socket

        set({socket: socket}); // lưu socket vào store

        socket.on("getOnlineUsers", (userIds) => {
            set({onlineUsers: userIds}); // cập nhật danh sách người dùng trực tuyến
        });
    },
    disconnectSocket: () => {
        if (get().socket?.connected) get().socket.disconnect(); // ngắt kết nối socket nếu đang kết nối
    },
}));