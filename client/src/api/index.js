import axios from 'axios'

const api = axios.create({
    baseURL: 'http://localhost:3001/api'
})

//routes for api
export const postLogin = payload => api.post(`/login/`, payload)
export const getLogins = () => api.get(`/logins/`)
export const getLoginByUrl = url => api.get(`/login/${url}`)
export const updateLogin = (url, payload) => api.put(`/login/${url}`, payload)
export const deleteLogin = url => api.delete(`/login/${url}`)
export const decryptPassword = (pw, iv) => api.get(`/decrypt/${pw}/${iv}`)

const apis = {
    postLogin,
    getLogins,
    getLoginByUrl,
    updateLogin,
    deleteLogin,
    decryptPassword,
}

export default apis