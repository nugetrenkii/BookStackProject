import axiosHandle from "./AxiosHandle";

export const GetShippingModes = () => {
    return axiosHandle.get(process.env.REACT_APP_URL_API + `ShippingMode?page=1&pageSize=1000&sortBy=ID`);
}

export const GetHistoryOrder = (page, pageSize, key, sortBy) => {
    return axiosHandle.get(process.env.REACT_APP_URL_API + `Order/Self?page=${page}&pageSize=${pageSize}&sortBy=${sortBy}`);
}

export const GetOrderById = (id) => {
    return axiosHandle.get(process.env.REACT_APP_URL_API + `Order/${id}`);
}

export const CreateOrder = (order) => {
    return axiosHandle.post(
        process.env.REACT_APP_URL_API + `Order`,
        order
    );
}

export const SelfCreateOrder = (order) => {
    return axiosHandle.post(
        process.env.REACT_APP_URL_API + `Order/Self`,
        order
    );
}