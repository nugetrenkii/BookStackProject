import axiosHandle from "./AxiosHandle";

export const UpdateUser = (id,user) => {
    return axiosHandle.put(process.env.REACT_APP_URL_API + `User/${id}`,user);
}

export const SelfUpdateUser = (user) => {
    return axiosHandle.put(process.env.REACT_APP_URL_API + `User/Self`,user);
}

export const GetAddressByUser = (id) => {
    return axiosHandle.get(process.env.REACT_APP_URL_API + `Address/User/${id}`);
}

export const GetSelfAddress = () => {
    return axiosHandle.get(process.env.REACT_APP_URL_API + `Address/User/Self`);
}

export const CreateAddress = (address) => {
    return axiosHandle.post(process.env.REACT_APP_URL_API + `Address`,address);
}

export const SelfCreateAddress = (address) => {
    return axiosHandle.post(process.env.REACT_APP_URL_API + `Address/User/Self`,address);
}

export const UpdateAddress = (id, address) => {
    return axiosHandle.put(process.env.REACT_APP_URL_API + `Address/${id}`,address);
}

export const DeleteAddress = (id) => {
    return axiosHandle.delete(process.env.REACT_APP_URL_API + `Address/${id}`);
}