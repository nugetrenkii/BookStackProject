import axiosHandle from "./AxiosHandle";
export const GetStatistical = () => {
    return axiosHandle.get(process.env.REACT_APP_URL_API + `Statistical`);
}