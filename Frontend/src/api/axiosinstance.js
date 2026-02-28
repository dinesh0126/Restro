import axios from 'axios'
import useAuthStore from '../store/authstore'

const API_URL = import.meta.env.VITE_BASE_URL
console.log(API_URL)

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
