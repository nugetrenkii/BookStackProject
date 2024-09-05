import axiosHandle from "./AxiosHandle";

export const GetCartByUser = (userId) => {
    return axiosHandle.get(process.env.REACT_APP_URL_API + `Cart/${userId}`);
}

export const GetSelfCart = () => {
    return axiosHandle.get(process.env.REACT_APP_URL_API + `Cart/Self`);
}

export const AddToCart = (userId,bookId,count) => {
    return axiosHandle.put(process.env.REACT_APP_URL_API + `Cart/${userId}?bookId=${bookId}&count=${count}`);
}

export const SelfAddToCart = (bookId,count) => {
    return axiosHandle.put(process.env.REACT_APP_URL_API + `Cart/Self?bookId=${bookId}&count=${count}`);
}