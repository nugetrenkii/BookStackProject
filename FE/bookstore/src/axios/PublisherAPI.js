import axiosHandle from "./AxiosHandle";
export const GetPublishers = (page, pageSize, key, sortBy) => {
    return axiosHandle.get(process.env.REACT_APP_URL_API + `Publisher?page=${page}&pageSize=${pageSize}&key=${key}&sortBy=${sortBy}`);
}

export const CreatePublisher = (name) => {
    return axiosHandle.post(process.env.REACT_APP_URL_API + `Publisher?name=${name}`);
}

export const UpdatePublisher = (id,name) => {
    return axiosHandle.put(process.env.REACT_APP_URL_API + `Publisher/${id}?name=${name}`);
}

export const DeletePublisher = (id) => {
    return axiosHandle.delete(process.env.REACT_APP_URL_API + `Publisher/${id}`);
}