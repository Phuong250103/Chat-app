import {create} from 'zustand';
import {axiosInstance} from '../lib/axios.js';

export const useAuthStore = create((set) => ({
    authUser: null, // thông tin người dùng đã xác thực
    isSigningUp: false, // trạng thái xác thực người dùng
    isLoggingIn: false, // trạng thái đăng nhập người dùng
    isUpdatingProfile: false, // trạng thái cập nhật thông tin người dùng

    isChecking: true, // trạng thái kiểm tra xác thực

    checkAuth: async () => {
        try {
            const res = await axiosInstance.get("/auth/check");
            set({authUser:res.data}); // nếu xác thực thành công, lưu thông tin người dùng vào store
        } catch (error) {
            console.error("Loi kiem tra xac thuc:", error);
            set({authUser:null}); // nếu xác thực thất bại, xóa thông tin người dùng khỏi store
            
        } finally {
            set({isChecking:false}); // cập nhật trạng thái kiểm tra xác thực
        }
    }
}));