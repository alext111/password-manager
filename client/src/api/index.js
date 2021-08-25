import axios from 'axios'

const api = axios.create({
    baseURL: 'http://localhost:3001/api'
})

//routes for api
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