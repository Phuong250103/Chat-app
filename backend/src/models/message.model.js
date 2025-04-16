import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
    {
        senderId:{ // id cua nguoi gui tin nhan
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true, // bat buoc phai co id cua nguoi gui
        },
        receiverId:{ // id cua nguoi nhan tin nhan
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true, // bat buoc phai co id cua nguoi nhan
        },
        text:{ 
            type: String,
            required: function () {         
                return !(this.image || this.file); // chỉ bắt buộc nếu không có image hoặc file
            },
        },
        image: {
            type: String,
        },
        file: {
            name: {
                type: String,
            },
            content: {
                type: String,
            },
        },
    },
    { timestamps: true } // thoi gian tao va cap nhat
);

const Message = mongoose.model("Message", messageSchema); // tao model Message
export default Message; // export model Message