import axiosHandle from "./AxiosHandle";

export const UpdateUser = (id,user) => {
    return axiosHandle.put(process.env.REACT_APP_URL_API + `User/${id}`,user);
}

export const GetAddressByUser = (id) => {
    return axiosHandle.get(process.env.REACT_APP_URL_API + `Address/User/${id}`);
}

export const CreateAddress = (address) => {
    return axiosHandle.post(process.env.REACT_APP_URL_API + `Address`,address);
}