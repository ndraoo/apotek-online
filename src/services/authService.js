import axios from "axios"

export const BASE_URL = 'http://127.0.0.1:8000/api'

export const getCsrfCookie = () => {
    return axios.get(`http://127.0.0.1:8000/sanctum/csrf-cookie`, { withCredentials: true })
}

export const getConfig = (token) => {
    const config = {
        headers: {
            "Authorization": `Bearer ${token}`,
            // "Content-type": "application/json",
        }
    }

    return config
}

