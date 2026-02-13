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
 
// Login routes
export const postLogin = payload => api.post(`/login/`, payload)
export const getLogins = () => api.get(`/logins/`)
export const getLoginByWebsite = website => api.get(`/login/${website}`)
export const updateLogin = (website, payload) => api.put(`/login/${website}`, payload)
export const deleteLogin = website => api.delete(`/login/${website}`)
export const decryptPassword = (pw, iv) => api.get(`/decrypt/${pw}/${iv}`)

const apis = {
    postLogin,
    getLogins,
    getLoginByWebsite,
    updateLogin,
    deleteLogin,
    decryptPassword,
}

export default apis