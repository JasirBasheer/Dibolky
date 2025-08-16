import axios from "axios";
import { toast } from "sonner";

const customAxios = axios.create({
  baseURL: import.meta.env.VITE_BACKEND || "http://localhost:5050",
  withCredentials: true,
});

// customAxios.interceptors.response.use(
//   (res) => res,
//   (err) => {
//     if (err.response?.status === 500) toast.error("Server error!");
//     return Promise.reject(err);
//   }
// );

export default customAxios;
