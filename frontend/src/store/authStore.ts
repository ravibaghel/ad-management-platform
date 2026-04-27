import { create } from 'zustand'

interface AuthState {
  token: string | null
  advertiserId: string | null
  setAuth: (token: string, advertiserId: string) => void
  logout: () => void
  isAuthenticated: () => boolean
  hydrate: () => void
}

export const useAuthStore = create<AuthState>((set, get) => ({
  token: null,
  advertiserId: null,

  setAuth: (token: string, advertiserId: string) => {
    localStorage.setItem('jwt', token)
    localStorage.setItem('advertiserId', advertiserId)
    set({ token, advertiserId })
  },

  logout: () => {
    localStorage.removeItem('jwt')
    localStorage.removeItem('advertiserId')
    set({ token: null, advertiserId: null })
  },

  isAuthenticated: () => {
    return get().token !== null && get().advertiserId !== null
  },

  hydrate: () => {
    const token = localStorage.getItem('jwt')
    const advertiserId = localStorage.getItem('advertiserId')
    if (token && advertiserId) {
      set({ token, advertiserId })
    }
  },
}))

// Hydrate on init
useAuthStore.getState().hydrate()
