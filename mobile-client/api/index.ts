import axios from "axios";

const api = axios.create({
  baseURL: 'https://api.example.com',
  responseType: 'json',
  headers: {
    'Content-Type': 'application/json',
  }
})

export default api