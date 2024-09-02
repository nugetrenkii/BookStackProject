import axiosHandle from "./AxiosHandle";

export const CreateRating = (rating) => {
    return axiosHandle.post(
        process.env.REACT_APP_URL_API + `Rating`,
        rating
    );
}

export const GetRatingByBook = (bookId, page) => {
    return axiosHandle.get(process.env.REACT_APP_URL_API + `Rating/Book?bookId=${bookId}&page=${page}`,);
}