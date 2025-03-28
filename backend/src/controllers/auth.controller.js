import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

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

export const login = (req, res) => {
    res.send("login route")
};

export const logout = (req, res) => {
    res.send("logout route")
};