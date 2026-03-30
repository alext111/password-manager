/**
 * Client API Service Layer
 * ---------------------------------------------------------
 * This module centralizes all HTTP requests made from the
 * frontend to the backend API.
 *
 * Responsibilities:
 * - Configure Axios instance
 * - Define API endpoint wrappers
 * - Abstract HTTP logic away from UI components
 * - Provide clean, reusable service functions
 *
 * Notes:
 * - All requests are prefixed with '/api'
 * - Backend routes are defined in the server
 * - This pattern improves maintainability and separation
 *   of concerns in the frontend architecture
 */

import axios from 'axios'

const api = axios.create({
    baseURL: '/api'
})

// Attach token automatically to every request
api.interceptors.request.use(
    config => {
        const token = localStorage.getItem('token')

        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }

        return config
    },
    error => Promise.reject(error)
)

/*
// Handle 401 globally
api.interceptors.response.use(
    response => response,
    error => {
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('token')
            window.location.href = '/login'
        }
        return Promise.reject(error)
    }
)
*/
 
// Auth routes
export const registerUser = payload => api.post('/auth/register', payload)
export const loginUser = payload => api.post('/auth/login', payload)

// Credential routes
export const postCredentials = payload => api.post(`/credentials/`, payload)
export const getCredentials = () => api.get(`/credentials/`)
export const getCredentialsByWebsite = website => api.get(`/credentials/${website}`)
export const updateCredentials = (website, payload) => api.put(`/credentials/${website}`, payload)
export const deleteCredentials = website => api.delete(`/credentials/${website}`)
export const decryptPassword = website => api.get(`/decrypt/${website}`)

const apis = {
    registerUser,
    loginUser,
    postCredentials,
    getCredentials,
    getCredentialsByWebsite,
    updateCredentials,
    deleteCredentials,
    decryptPassword,
}

export default apis