import axios from 'axios'

const api = axios.create({
    baseURL: 'http://poseidon-api.ddns.net'
})

export default api