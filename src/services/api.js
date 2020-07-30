import axios from 'axios'

const api = axios.create({
  baseURL: "http://192.168.0.180:3333"
})

export default api