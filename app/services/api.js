import axios from 'axios'

const api = axios.create({
    baseURL: 'https://poseidon-api.ddns.net'
})

export default api