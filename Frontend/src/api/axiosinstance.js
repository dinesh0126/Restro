import axios from 'axios'
import useAuthStore from '../store/authstore'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL
const API_URL =
    import.meta.env.VITE_API_BASE_URL ||
    (BACKEND_URL ? `${BACKEND_URL.replace(/\/$/, "")}/api/v1` : "/api/v1")

const axiosInstance = axios.create({
    baseURL: API_URL, 
    withCredentials: true,
})

axiosInstance.interceptors.request.use((config) => {
    const token = useAuthStore.getState().accessToken
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

export default axiosInstance
