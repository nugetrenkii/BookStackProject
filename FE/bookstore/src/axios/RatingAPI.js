import axiosHandle from "./AxiosHandle";
export const GetRatings = (page, pageSize, key, sortBy) => {
    return axiosHandle.get(process.env.REACT_APP_URL_API + `Rating?page=${page}&pageSize=${pageSize}&key=${key}&sortBy=${sortBy}`);
}

export const CreateRating = (rating) => {
    return axiosHandle.post(process.env.REACT_APP_URL_API + `Rating`,rating);
}
// export const UpdateRating = (id,name) => {
//     return axiosHandle.put(process.env.REACT_APP_URL_API + `Rating/${id}?name=${name}`);
// }

export const DeleteRating = (id) => {
    return axiosHandle.delete(process.env.REACT_APP_URL_API + `Rating/${id}`);
}