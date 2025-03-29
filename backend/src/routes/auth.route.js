import express from 'express';
import { login } from '../controllers/auth.controller.js';
import { logout } from '../controllers/auth.controller.js';
import { signup } from '../controllers/auth.controller.js';
import { updateProfile, checkAuth } from '../controllers/auth.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js'; // kiem tra xem user da dang nhap chua, neu chua thi ko cho update profile

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.put("/update-profile", protectRoute, updateProfile); //protectRoute kiem tra xem user da dang nhap chua, neu chua thi ko cho update profile
router.get("/check", protectRoute, checkAuth); //neu nguoi dung duoc xac thuc thi goi ham checkAuth, neu ko thi khong can goi ham nay

export default router;