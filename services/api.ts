// services/api.ts

import axios from 'axios'

// Inisialisasi instance Axios
export const api = axios.create({
  baseURL: 'https://test-fe.mysellerpintar.com/api'
})

// Setter token auth (opsional, dipakai saat login sukses)
export const setAuthToken = (token: string | null) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`
  } else {
    delete api.defaults.headers.common['Authorization']
  }
}
