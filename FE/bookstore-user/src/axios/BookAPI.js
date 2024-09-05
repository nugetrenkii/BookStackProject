import axiosHandle from "./AxiosHandle";

export const GetBooks = (page, pageSize, key, sortBy) => {
    return axiosHandle.get(process.env.REACT_APP_URL_API + `Book?page=${page}&pageSize=${pageSize}&key=${key}&sortBy=${sortBy}`);
}

export const GetBookTags = (page, pageSize, key, sortBy, tagId) => {
    return axiosHandle.get(process.env.REACT_APP_URL_API + `Book?page=${page}&pageSize=${pageSize}&key=${key}&sortBy=${sortBy}&tagId=${tagId}`);
}

export const GetBookById = (id) => {
    return axiosHandle.get(process.env.REACT_APP_URL_API + `Book/${id}`);
}

export const GetBooksRecomend = (id) => {
    return axiosHandle.get(process.env.REACT_APP_URL_API + `Book/Recommendations`);
}

export const GetTopRatedBooks = (count) => {
    return axiosHandle.get(process.env.REACT_APP_URL_API + `Book/TopRated?topCount=${count}`);
}

export const GetTopOrderedBooks = (count) => {
    return axiosHandle.get(process.env.REACT_APP_URL_API + `Book/TopOrdered?topCount=${count}`);
}

export const GetBookByIds = (ids) => {
    return axiosHandle.post(process.env.REACT_APP_URL_API + `Book/ids`, ids);
}