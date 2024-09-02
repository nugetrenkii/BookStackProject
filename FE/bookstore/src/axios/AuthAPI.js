import axiosHandle from "./AxiosHandle";

// Login function to authenticate and store JWT
export const Login = async(username, password) => {
    try {
        const response = await axiosHandle.post(process.env.REACT_APP_URL_API + `Auth/Login`, {
            username,
            password,
        });
        if (response.code === 200 && response.data.token) {
            // Save JWT token to local storage or session storage
            localStorage.setItem("token", response.data.token);
            return response;
        }
        console.error("Login failed");
    } catch (error) {
        console.error("Login error:", error);
        throw error;
    }
};