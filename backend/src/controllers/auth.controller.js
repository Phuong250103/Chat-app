import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import cloudinary from "../lib/cloudinary.js"; // import cloudinary de upload hinh anh

export const signup = async(req, res) => {
    const { email, fullName, password } = req.body;
    try{
        if (!email || !fullName || !password) {
            return res.status(400).json({ message: "Please enter all fields" });
        }
        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters" });
        }

        const user = await User.findOne({ email }); // tim kiem user co email trung voi email nhap vao ko

        if (user) {
            return res.status(400).json({ message: "User already exists" });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);// ham bam password    
             
        const newUser = new User({ email, fullName, password: hashedPassword });
        
        if (newUser){
            generateToken(newUser._id, res); //id cua user moi tao do mongoose tao ra ngau nhien
            await newUser.save();

            res.status(201).json({
                _id: newUser._id,
                email: newUser.email,
                fullName: newUser.fullName,
                profilePic: newUser.profilePic,
            });

        }else{
            return res.status(400).json({ message: "Invalid user data" });
        }

    }catch(error){

    }
};

export const login = async (req, res) => { //async la ham bat dong bo, cho phep su dung await ben trong
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            return res.status(400).json({ message: "Dien day du thong tin vao trong" });
        }
        const user = await User.findOne({ email }); // tim kiem user co email trung voi email nhap vao ko
        if (!user) {
            return res.status(400).json({ message: "Thong tin xac thuc khong hop le" });
        }
        const isPasswordCorrect = await bcrypt.compare(password, user.password); // so sanh password nhap vao voi password trong database
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: "Thong tin xac thuc khong hop le" });
        }
        generateToken(user._id, res); //id cua user moi tao do mongoose tao ra ngau nhien
        res.status(200).json({
            _id: user._id,
            email: user.email,
            fullName: user.fullName,
            profilePic: user.profilePic,
        });
    }catch(error){
        console.log("Loi trong qua trinh dang nhap: ", error.message);
        return res.status(500).json({ message: "Loi server" });
    }
};

export const logout = (req, res) => {
   try {
        res.cookie("jwt", "", {maxAge: 0}); // xoa cookie jwt
        res.status(200).json({ message: "Dang xuat thanh cong" });
    } catch (error) {
        console.log("Loi trong qua trinh dang xuat: ", error.message);
        return res.status(500).json({ message: "Loi server" });
    }
};

export const updateProfile = async (req, res) => {
    try {
        const {profilePic} = req.body; // lay profilePic tu body
        const userId = req.user._id; // lay userId tu token kiem tra xem user da dang nhap chua

        if (!profilePic) {
            return res.status(400).json({ message: "Vui long nhap profilePic" });
        }

        const uploadResponse = await cloudinary.uploader.upload(profilePic); // upload hinh anh len cloudinary
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { profilePic: uploadResponse.secure_url }, // lay url hinh anh tu cloudinary
            { new: true }
        );

        res.status(200).json(updatedUser); // tra ve user da duoc cap nhat

    }catch(error){
        console.log("Loi trong qua trinh cap nhat profile: ", error.message);
        return res.status(500).json({ message: "Loi server" });

    }
}

export const checkAuth = (req, res) => {
    try {
        res.status(200).json(req.user); // tra ve user da duoc xac thuc
    }catch(error){
        console.log("Loi trong qua trinh kiem tra xac thuc: ", error.message);
        return res.status(500).json({ message: "Loi server" });
    }
} 
