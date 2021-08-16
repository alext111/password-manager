import axios from 'axios'

const api = axios.create({
    baseURL: 'http://localhost:3001/api'
})

export const postLogin = payload => api.post(`/url/`, payload)
export const getLogins = () => api.get(`/urls`)
export const getLoginByUrl = url => api.get(`/url/${url}`)
export const updateLogin = (url, payload) => api.put(`/url/${url}`, payload)
export const deleteLogin = url => api.delete(`/url/${url}`)

const apis = {
    postLogin,
    getLogins,
    getLoginByUrl,
    updateLogin,
    deleteLogin,
}

export default apis