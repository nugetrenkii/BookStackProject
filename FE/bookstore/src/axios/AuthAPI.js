// Import the axios instance and toast
import axiosHandle from "./AxiosHandle";
import { toast } from "react-toastify";

// Login function to authenticate and store JWT
export const Login = async (username, password) => {
  try {
    // Make the API request to login
    const response = await axiosHandle.post(`/Auth/Login`, {
      username,
      password,
    });

    console.log(response);
    // Check if the response is null or undefined
    if (!response) {
      toast.error("Login failed");
      return null;
    }

    // Check if response.data or response.data.token is missing
    if (!response.data || !response.data.token) {
      toast.error("Login failed");
      return null;
    }

    // Save JWT token to local storage or session storage
    localStorage.setItem("token", response.data.token);
    return response;
  } catch (error) {
    // Handle any errors that occur during the request
    console.error("Login error:", error);

    // Display a toast notification for the error
    toast.error("Login failed. Please check your credentials and try again.");

    // Return null to indicate the login failed
    return null;
  }
};
