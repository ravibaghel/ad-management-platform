import { useAuthStore } from '../store/authStore'

export const useAuth = () => {
  const token = useAuthStore(state => state.token)
  const advertiserId = useAuthStore(state => state.advertiserId)
  const setAuth = useAuthStore(state => state.setAuth)
  const logout = useAuthStore(state => state.logout)
  const isAuthenticated = useAuthStore(state => state.isAuthenticated)

  return {
    token,
    advertiserId,
    setAuth,
    logout,
    isAuthenticated: isAuthenticated(),
  }
}
