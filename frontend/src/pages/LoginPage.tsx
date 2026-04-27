import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { campaignApi } from '../services/api'
import { useState } from 'react'

const loginSchema = z.object({
  advertiserId: z.string()
    .min(1, 'Advertiser ID is required')
    .trim(),
})

type LoginFormData = z.infer<typeof loginSchema>

export default function LoginPage() {
  const navigate = useNavigate()
  const { setAuth } = useAuth()
  const [apiError, setApiError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true)
    setApiError(null)
    try {
      const response = await campaignApi.post('/v1/auth/login', {
        advertiserId: data.advertiserId,
      })
      const { token, advertiserId } = response.data
      setAuth(token, advertiserId)
      navigate('/dashboard')
    } catch (error) {
      setApiError(error instanceof Error ? error.message : 'Login failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-surface">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg border border-gray-200 p-8">
          <h1 className="text-2xl font-semibold text-gray-900 mb-6">AdTech Platform</h1>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Advertiser ID
              </label>
              <input
                type="text"
                {...register('advertiserId')}
                placeholder="e.g. advertiser-1"
                className="w-full px-4 py-2 border border-gray-300 rounded-md text-gray-900 placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                disabled={isLoading}
              />
              {errors.advertiserId && (
                <p className="mt-1 text-sm text-red-600">{errors.advertiserId.message}</p>
              )}
            </div>

            {apiError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-800">{apiError}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary text-white py-2 rounded-md font-medium hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            Demo: Enter any advertiser ID to continue
          </p>
        </div>
      </div>
    </div>
  )
}
