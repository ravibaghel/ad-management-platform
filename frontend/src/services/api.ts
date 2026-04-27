import axios from 'axios'

const campaignApi = axios.create({
  baseURL: import.meta.env.VITE_CAMPAIGN_API_URL || '/api',
  headers: { 'Content-Type': 'application/json' },
})

// Mock mode for testing without backend
const MOCK_MODE = true

if (MOCK_MODE) {
  campaignApi.interceptors.response.use(
    response => response,
    error => {
      const isNetworkError = error.response?.status === 404 || error.code === 'ERR_NETWORK'

      if (isNetworkError && error.config) {
        // Mock auth login
        if (error.config.url?.includes('/auth/login')) {
          const data = error.config.data ? JSON.parse(error.config.data) : {}
          return Promise.resolve({
            data: {
              token: `mock-jwt-${Date.now()}`,
              advertiserId: data.advertiserId || 'test-user'
            },
            status: 200,
            statusText: 'OK',
            headers: {},
            config: error.config
          } as any)
        }

        // Mock campaign list
        if (error.config.url?.includes('/campaigns') && error.config.method === 'get') {
          return Promise.resolve({
            data: {
              content: [
                {
                  id: 'mock-1',
                  name: 'Sample Campaign',
                  description: 'Mock data for testing',
                  status: 'ACTIVE',
                  totalBudget: 1000,
                  spentBudget: 250,
                  remainingBudget: 750,
                  dailyBudgetCap: 100,
                  objective: 'TRAFFIC',
                  startDate: '2026-04-27T10:00:00',
                  endDate: '2026-05-27T10:00:00',
                  createdAt: new Date().toISOString(),
                  updatedAt: new Date().toISOString(),
                  advertiserId: 'test-user'
                }
              ],
              page: 0,
              size: 20,
              totalElements: 1,
              totalPages: 1,
              last: true
            },
            status: 200,
            statusText: 'OK',
            headers: {},
            config: error.config
          } as any)
        }

        // Mock campaign creation
        if (error.config.url?.includes('/campaigns') && error.config.method === 'post') {
          const data = error.config.data ? JSON.parse(error.config.data) : {}
          return Promise.resolve({
            data: {
              id: `mock-${Date.now()}`,
              ...data,
              spentBudget: 0,
              remainingBudget: data.totalBudget,
              status: 'DRAFT',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            },
            status: 201,
            statusText: 'Created',
            headers: {},
            config: error.config
          } as any)
        }
      }

      return Promise.reject(error)
    }
  )
}

campaignApi.interceptors.request.use(config => {
  const token = localStorage.getItem('jwt')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export { campaignApi }
