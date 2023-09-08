import axios from "axios";
import { refreshLoginApi } from "./redux/login/apiCalls";
import { store } from "./redux/store"

const BASE_URL = "http://localhost:9000"

export const publicRequest = axios.create({
  baseURL: BASE_URL
})

export const UserData = () => {
  let persist = localStorage.getItem("persist:root")
  let userData
  if(persist) {
    const login = JSON.parse(persist).login
    if(login) {
      userData = JSON.parse(login).userData
    }
  }
 return userData
}

export const privateRequest = async (method, url, data = null) => {
  try {
    let response;
    let token = UserData()?.accessToken;
    let headers = {}
    if(token) {
      headers.token = `Bearer ${token}`;
      headers['Cache-Control'] = 'no-cache'; // set cache-control header to zero
      response = await axios({ method, url: `${BASE_URL}${url}`, data, headers });
    } else {
      response = {data: []}
    }
    return response;
  } catch (error) {
    throw error;
  }
};

export const refreshToken = async () => {
  try {
    const res = await axios.post(BASE_URL + "/auth/refreshToken", { token: UserData()?.refreshToken}, {headers: {token: `Bearer ${UserData()?.accessToken}`}})
    console.log("res: ", res.data)
    store.dispatch(refreshLoginApi(res.data))
    return res.data
  } catch (err) {
    console.log("err.refreshToken: ", err?.response?.data)
  }
}

export const get = async (url) => privateRequest('GET', url);

export const post = async (url, data) => privateRequest('POST', url, data);

export const put = async (url, data) => privateRequest('PUT', url, data);

export const remove = async (url) => privateRequest('DELETE', url);

