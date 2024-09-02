import axiosHandle from "./AxiosHandle";
export const GetOrders = (page, pageSize, key, sortBy) => {
    return axiosHandle.get(process.env.REACT_APP_URL_API + `Order?page=${page}&pageSize=${pageSize}&key=${key}&sortBy=${sortBy}`);
}

export const GetOrderById = (id) => {
    return axiosHandle.get(process.env.REACT_APP_URL_API + `Order/${id}`);
}

export const DeleteOrder = (id) => {
    return axiosHandle.delete(process.env.REACT_APP_URL_API + `Order/${id}`);
}

export const CreateOrder = (order) => {
    return axiosHandle.post(
        process.env.REACT_APP_URL_API + `Order`,
        order
    );
}
export const UpdateOrder = (id,order) => {
    return axiosHandle.put(process.env.REACT_APP_URL_API + `Order/${id}`,order);
}