import Cookies from "js-cookie";
import axios from "axios";
const BASE_URL = import.meta.env.VITE_FETCH_URL;
// const BASE_URL = "https://time-table-h6xp.onrender.com/"

export default async function fetchDataFromApi(url, params, method) {
  let uid = Cookies.get("uid");

  try {
    const data = await axios.request({
      method: method,
      url: url,
      baseURL: BASE_URL,
      headers: {
        Authorization: uid || "",
      },
      data: params,
      withCredentials: true,
    });
    return data;
  } catch (error) {
    return error;
  }
}
