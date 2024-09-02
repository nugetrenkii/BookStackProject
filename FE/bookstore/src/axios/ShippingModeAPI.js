import axiosHandle from "./AxiosHandle";
export const GetShippingModes = (page, pageSize, key, sortBy) => {
    return axiosHandle.get(process.env.REACT_APP_URL_API + `ShippingMode?page=${page}&pageSize=${pageSize}&key=${key}&sortBy=${sortBy}`);
}

export const CreateShippingMode = (name) => {
    return axiosHandle.post(process.env.REACT_APP_URL_API + `ShippingMode?name=${name}`);
}
export const UpdateShippingMode = (id,name) => {
    return axiosHandle.put(process.env.REACT_APP_URL_API + `ShippingMode/${id}?name=${name}`);
}

export const DeleteShippingMode = (id) => {
    return axiosHandle.delete(process.env.REACT_APP_URL_API + `ShippingMode/${id}`);
}