import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const protectRoute = async (req, res, next) => {
    try{
        const token = req.cookies.jwt; //lay jwt tu cookie
        if (!token) {
            return res.status(401).json({ message: "Ban khong duoc phep" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET); // xac thuc token
        if (!decoded) {
            return res.status(401).json({ message: "Token khong hop le" });
        }

        const user = await User.findById(decoded.userId).select("-password"); // -password de khong lay password ra; tim kiem user co id trung voi id trong token
        if (!user) {
            return res.status(401).json({ message: "khong tim thay nguoi dung" });
        }

        req.user = user; // gan user vao request de su dung sau nay
        next(); // goi ham tiep theo trong middleware

    }catch(error){

        console.log("Loi trong qua trinh xac thuc token: ", error.message);
        return res.status(500).json({ message: "Loi server" });
    }

}