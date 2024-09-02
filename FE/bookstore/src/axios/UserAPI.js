import axiosHandle from "./AxiosHandle";
export const GetUsers = (page, pageSize, key, sortBy) => {
    console.log(process.env.REACT_APP_URL_API + `User?page=${page}&pageSize=${pageSize}&key=${key}&sortBy=${sortBy}`);
    return axiosHandle.get(process.env.REACT_APP_URL_API + `User?page=${page}&pageSize=${pageSize}&key=${key}&sortBy=${sortBy}`);
}

export const DeleteUser = (id) => {
    return axiosHandle.delete(process.env.REACT_APP_URL_API + `User/${id}`);
}

export const CreateUser = (user) => {
    console.log(process.env.REACT_APP_URL_API + `User`)
    return axiosHandle.post(
        process.env.REACT_APP_URL_API + `User`,
        user
    );
}

export const GetUserById = (id) => {
    return axiosHandle.get(process.env.REACT_APP_URL_API + `User/${id}`);
}

export const UpdateUser = (id,user) => {
    return axiosHandle.put(process.env.REACT_APP_URL_API + `User/${id}`,user);
}