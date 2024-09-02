import axiosHandle from "./AxiosHandle";

export const CreateUrlPayment = (orderId, total) => {
    return axiosHandle.post(process.env.REACT_APP_URL_API + `VnPay?orderId=${orderId}&total=${total}`);
}

export const CheckPaymenUrl = (url) => {
    return axiosHandle.get(process.env.REACT_APP_URL_API + `VnPay${url}`)
}