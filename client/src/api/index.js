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
export const postCredentials = payload => api.post(`/credentials/`, payload)
export const getCredentials = () => api.get(`/credentials/`)
export const getCredentialsByWebsite = website => api.get(`/credentials/${website}`)
export const updateCredentials = (website, payload) => api.put(`/credentials/${website}`, payload)
export const deleteCredentials = website => api.delete(`/credentials/${website}`)
export const decryptPassword = website => api.get(`/decrypt/${website}`)

const apis = {
    postCredentials,
    getCredentials,
    getCredentialsByWebsite,
    updateCredentials,
    deleteCredentials,
    decryptPassword,
}

export default apis