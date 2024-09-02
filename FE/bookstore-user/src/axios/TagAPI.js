import axiosHandle from "./AxiosHandle";
export const GetTags = (page, pageSize, key, sortBy) => {
    return axiosHandle.get(process.env.REACT_APP_URL_API + `Tag?page=${page}&pageSize=${pageSize}&key=${key}&sortBy=${sortBy}`);
}

export const CreateTag = (name) => {
    return axiosHandle.post(process.env.REACT_APP_URL_API + `Tag?name=${name}`);
}
export const UpdateTag = (id,name) => {
    return axiosHandle.put(process.env.REACT_APP_URL_API + `Tag/${id}?name=${name}`);
}

export const DeleteTag = (id) => {
    return axiosHandle.delete(process.env.REACT_APP_URL_API + `Tag/${id}`);
}