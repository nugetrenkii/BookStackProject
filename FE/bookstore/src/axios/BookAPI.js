import axiosHandle from "./AxiosHandle";

export const GetBooks = (page, pageSize, key, sortBy) => {
    return axiosHandle.get(process.env.REACT_APP_URL_API + `Book?page=${page}&pageSize=${pageSize}&key=${key}&sortBy=${sortBy}`);
}

export const DeleteBook = (id) => {
    return axiosHandle.delete(process.env.REACT_APP_URL_API + `Book/${id}`);
}

export const GetBookById = (id) => {
    return axiosHandle.get(process.env.REACT_APP_URL_API + `Book/${id}`);
}

export const CreateBook = (book) => {
    return axiosHandle.post(
        process.env.REACT_APP_URL_API + `Book`,
        book
    );
}

export const UpdateBook = (id,book) => {
    return axiosHandle.put(process.env.REACT_APP_URL_API + `Book/${id}`,book);
}