import axious from 'axios';

export const axiosInstance = axious.create({
    baseURL: "http://localhost:5001/api",
    withCredentials: true,
});