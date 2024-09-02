import axiosHandle from "./AxiosHandle";

export const GetShippingModes = () => {
    return axiosHandle.get(process.env.REACT_APP_URL_API + `ShippingMode?page=1&pageSize=1000&sortBy=ID`);
}

export const GetHistoryOrder = (userId, page, pageSize, key, sortBy) => {
    return axiosHandle.get(process.env.REACT_APP_URL_API + `Order/History?userId=${userId}&page=${page}&pageSize=${pageSize}&sortBy=${sortBy}`);
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