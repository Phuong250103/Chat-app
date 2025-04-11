import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import cloudinary from "../lib/cloudinary.js"; // import cloudinary de upload hinh anh
import { getReceiverSocketId, io } from "../lib/socket.js"; 

export const getUserForSidebar = async (req, res) => {
    try {
        const loggedUserId = req.user._id; // lay id cua user dang nhap tu middleware
        const fillerUsers = await User.find({ _id: { $ne: loggedUserId } }).select("-password"); // lay danh sach user khong bao gom user dang nhap, va khong lay password

        res.status(200).json(fillerUsers);
    } catch (error) {
        console.log("Loi trong qua trinh lay danh sach user: ", error.message);
        return res.status(500).json({ message: "Loi server" });
    }
};

export const getMessages = async (req, res) => {
    try {
        const { id:userToChatId} = req.params; // lay id cua user de chat tu params
        const myId = req.user._id;

        const messages = await Message.find({
            $or: [
                { senderId: myId, receiverId: userToChatId }, // tin nhan gui tu myId den userToChatId
                { senderId: userToChatId, receiverId: myId }, // tin nhan gui tu userToChatId den myId
            ]
        })

        res.status(200).json(messages);
    } catch (error) {
        console.log("Loi trong qua trinh lay danh sach tin nhan: ", error.message);
        return res.status(500).json({ message: "Loi server" });
    }
};

export const sendMessage = async (req, res) => {
    try {
        const { text, image } = req.body;
        const { id: receiverId } = req.params;
        const senderId = req.user._id;

        let imageUrl; // khoi tao bien imageUrl de chua url hinh anh
        if (image) {
            const uploadResponse = await cloudinary.uploader.upload(image); // upload hinh anh len cloudinary
            imageUrl = uploadResponse.secure_url; // lay url hinh anh tu cloudinary
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image: imageUrl,
        });

        await newMessage.save();

        const receiverSocketId = getReceiverSocketId(receiverId); // lay id socket cua nguoi nhan tin nhan 
        if (receiverSocketId){
            io.to(receiverSocketId).emit("newMessage", newMessage); 
        }

        res.status(200).json(newMessage);

    } catch (error) {
        console.log("Loi trong qua trinh gui tin nhan: ", error.message);
        return res.status(500).json({ message: "Loi server" });
    }
};