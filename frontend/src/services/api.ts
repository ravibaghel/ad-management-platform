import axios from 'axios'

const campaignApi = axios.create({
  baseURL: import.meta.env.VITE_CAMPAIGN_API_URL ?? '/api',
  headers: { 'Content-Type': 'application/json' },
})

campaignApi.interceptors.request.use(config => {
  const token = localStorage.getItem('jwt')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export { campaignApi }
