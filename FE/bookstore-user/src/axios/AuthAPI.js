import axiosHandle from "./AxiosHandle";
export const Login = (username, password) => {
    return axiosHandle.post(process.env.REACT_APP_URL_API + `Auth/Login`, { username, password });
}

export const RegisterAPI = (user) => {
    return axiosHandle.post(process.env.REACT_APP_URL_API + `Auth/Register`,user);
}

export const GetUserById = (id) => {
    return axiosHandle.get(process.env.REACT_APP_URL_API + `User/${id}`);
}

export const LoginWithGoogle = (accessToken) => {
    return axiosHandle.post(process.env.REACT_APP_URL_API + `Auth/LoginWithGoogle?accessToken=${accessToken}`);
}

export const LoginWithFacebook = (accessToken) => {
    return axiosHandle.post(process.env.REACT_APP_URL_API + `Auth/LoginWithFacebook?accessToken=${accessToken}`);
}