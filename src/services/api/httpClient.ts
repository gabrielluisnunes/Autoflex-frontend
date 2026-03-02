import axios from 'axios'
import { AUTH_STORAGE_KEY } from './authStorage'

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081/api'

export const httpClient = axios.create({
  baseURL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
})

httpClient.interceptors.request.use((config) => {
  const raw = localStorage.getItem(AUTH_STORAGE_KEY)

  if (raw) {
    try {
      const parsed = JSON.parse(raw) as { token?: string }
      if (parsed?.token) {
        config.headers.Authorization = `Bearer ${parsed.token}`
      }
    } catch {
      localStorage.removeItem(AUTH_STORAGE_KEY)
    }
  }

  return config
})

httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      localStorage.removeItem(AUTH_STORAGE_KEY)
      if (window.location.pathname !== '/login') {
        window.location.assign('/login')
      }
    }

    const message =
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      error?.message ||
      'Unexpected request error'

    return Promise.reject(new Error(message))
  },
)
