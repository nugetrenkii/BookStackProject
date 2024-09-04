import axios from "axios";

export const UploadImageAPI = async(file) => {
    const formData = new FormData();
    formData.append("file", file)
    formData.append("upload_preset", "ml_default")

    var data
    var res = await axios.post(
        // "https://api.cloudinary.com/v1_1/bong-oliver/image/upload",
        "https://api.cloudinary.com/v1_1/wibu009/image/upload",
        formData
    ).then((response) => {
        data = response.data.url
    })

    return data
}