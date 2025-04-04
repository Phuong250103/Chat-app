import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import authRoutes from './routes/auth.route.js';
import messageRoutes from './routes/message.route.js';
import { connectDB } from './lib/db.js';

dotenv.config();
const app = express();

const PORT = process.env.PORT;

app.use(express.json({ limit: "5mb" })); // tang kich thuoc cho phep gui du lieu lon hon 
app.use(express.urlencoded({ limit: "5mb", extended: true }));
app.use(cookieParser()); // middleware de lay cookie tu client gui len
app.use(cors(
    {
        origin: "http://localhost:5173",  
        credentials: true, // cho phep gui cookie tu client ve server
    }       
));

app.use("/api/auth", authRoutes);
app.use("/api/message", messageRoutes);

app.listen(PORT,() => {
    console.log('Server is running on PORT:' + PORT);
    connectDB();
})