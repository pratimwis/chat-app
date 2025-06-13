import axios from "axios";
import toast from "react-hot-toast";


export const axiosInstance = axios.create({
  baseURL: import.meta.env.MODE === "development" ? `${import.meta.env.VITE_API_BASE_URL}`: "/api",
  withCredentials: true,
});

// Response Error Interceptor
axiosInstance.interceptors.response.use(
  response => response, // pass through success responses
  error => {
    if (error.response) {
      // Server responded but with an error status
      console.error('Backend Error:', {
        status: error.response.status,
        message: error.response.data?.message || 'Unknown server error',
      });
    } else if (error.request) {
      // Request made but no response (backend might be down)
      toast.error('No response from backend. Server might be offline.');
    } else {
      // Something else caused the error
      toast.error('Axios Error:', error.message);
    }

    return Promise.reject(error); // forward error to the caller
  }
);