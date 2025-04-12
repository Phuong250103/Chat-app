import express from 'express';
import { protectRoute } from '../middleware/auth.middleware.js';
import { getUserForSidebar, getMessages, sendMessage } from '../controllers/message.controller.js';

const router = express.Router();

router.get("/users", protectRoute, getUserForSidebar); // lay danh sach user de hien thi tren sidebar
router.get("/:id", protectRoute, getMessages);  // lay danh sach tin nhan giua 2 user
router.post("/send/:id", protectRoute, sendMessage); // gui tin nhan


export default router;