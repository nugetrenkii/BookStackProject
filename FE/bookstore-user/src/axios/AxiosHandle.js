import axios from "axios";
import { toast } from "react-toastify";

const instance = axios.create(
    {
        baseURL: process.env.REACT_APP_URL_API,
        timeout: 300000
    }
);
instance.interceptors.request.use(
    (config) => {
        config.headers["Content-Type"] = "application/json";
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    error => {
        Promise.reject(error);
    }
);
instance.interceptors.response.use(
    (response) => {
      return response.data;
    },
    (error) => {
      // Checking if error has a response
      if (error.response) {
        // Handle 401 Unauthorized error (expired token or not authenticated)
        if (error.response.status === 401) {
          handleUnauthorizedError();
        }
      } else if (
        error.message === "Network Error" || // Typical network error message
        error.code === "ECONNABORTED" || // Timeout or aborted connections
        !error.response // No response, indicating server might be down
      ) {
        handleNetworkError();
      } else {
        // Catch-all for other unspecified errors
        console.error("Unhandled error:", error);
      }
      return Promise.reject(error);
    }
  );
  
  function handleUnauthorizedError() {
    // Clear the token from local storage and redirect to login
    localStorage.removeItem("token");
    toast.error("Unauthorized. Please log in again.");
    window.location.href = "/login";
  }
  
  function handleNetworkError() {
    // Clear token and redirect to login if backend is unreachable
    toast.error("Network error. Please try again later.");
    console.error("Network error!");
  }
  
export default instance;