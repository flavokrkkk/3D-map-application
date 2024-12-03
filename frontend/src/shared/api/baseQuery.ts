import axios, { CreateAxiosDefaults } from "axios"
import { TokenService } from "@entities/token"
import { EBaseUrls } from "../utils"
import { catchError } from "../helpers/catchError"

export const baseQueryInstance: CreateAxiosDefaults = {
  baseURL: EBaseUrls.BASE_URL,
  withCredentials: true,
  headers: {
    ["Content-Type"]: "application/json",
    ["Accept"]: "application/json",
    ["Access-Control-Allow-Origin"]: "https://map-app-whgm.vercel.app",
    ["Access-Control-Allow-Credentials"]: true
  }
}

export const axiosForAuth = axios.create(baseQueryInstance)

export const axiosWithAuth = axios.create(baseQueryInstance)

axiosWithAuth.interceptors.request.use(config => {
  const token = TokenService.getAccessToken()
  if (config && config.headers && token) {
    config.headers["Authorization"] = `Bearer ${token}`
  } else {
    TokenService.deleteAccessToken()
  }

  return config
})

axiosWithAuth.interceptors.response.use(
  response => {
    return response
  },
  async function (error) {
    const originalRequest = error.config
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      try {
        TokenService.deleteAccessToken()
      } catch (error) {
        if (catchError(error) === "jwt expired") TokenService.deleteAccessToken()
      }

      return axiosWithAuth(originalRequest)
    }
    return Promise.reject(error)
  }
)
