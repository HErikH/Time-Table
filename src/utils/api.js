import axios from "axios";
const BASE_URL = "http://localhost:4000/"
// const BASE_URL = "https://time-table-h6xp.onrender.com/"

export async function fetchDataFromApi(url, params, method) {
    try {
        const data = await axios.request({
            method: method,
            url: url, 
            baseURL: BASE_URL,
            data: params, 
            withCredentials: true
        })
        return data
    } catch (error) {
        return error
    }
}

