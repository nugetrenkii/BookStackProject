import axiosHandle from "./AxiosHandle";
export const GetAuthors = (page, pageSize, key, sortBy) => {
    return axiosHandle.get(process.env.REACT_APP_URL_API + `Author?page=${page}&pageSize=${pageSize}&key=${key}&sortBy=${sortBy}`);
}

export const CreateAuthor = (name) => {
    return axiosHandle.post(process.env.REACT_APP_URL_API + `Author?name=${name}`);
}

export const UpdateAuthor = (id,name) => {
    return axiosHandle.put(process.env.REACT_APP_URL_API + `Author/${id}?name=${name}`);
}

export const DeleteAuthor = (id) => {
    return axiosHandle.delete(process.env.REACT_APP_URL_API + `Author/${id}`);
}