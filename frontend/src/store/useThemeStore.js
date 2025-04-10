import { create } from "zustand";

export const useThemeStore = create((set) => ({ //chat-theme là key trong localStorage
  theme: localStorage.getItem("chat-theme") || "coffee", // lấy theme từ localStorage hoặc mặc định là "coffee"
  setTheme: (theme) => {localStorage.setItem("chat-theme", theme);
  set({ theme }); // cập nhật theme trong localStorage
  },
}));