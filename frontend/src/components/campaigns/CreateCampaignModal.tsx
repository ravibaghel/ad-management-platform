import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { X } from 'lucide-react'
import { createCampaignSchema, CreateCampaignFormData } from '../../types/schemas'
import { useCreateCampaign } from '../../hooks/useCampaigns'

interface CreateCampaignModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function CreateCampaignModal({ isOpen, onClose }: CreateCampaignModalProps) {
  const createMutation = useCreateCampaign()
  const [apiError, setApiError] = useState<string | null>(null)

  const { register, handleSubmit, formState: { errors }, reset } = useForm<CreateCampaignFormData>({
    resolver: zodResolver(createCampaignSchema),
  })

  const onSubmit = async (data: CreateCampaignFormData) => {
    setApiError(null)
    try {
      await createMutation.mutateAsync(data)
      reset()
      onClose()
    } catch (error) {
      setApiError(error instanceof Error ? error.message : 'Failed to create campaign')
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg border border-gray-200 max-w-2xl w-full max-h-96 overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Create Campaign</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          {apiError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-800">{apiError}</p>
            </div>
          )}

          {/* Campaign Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Campaign Name *
            </label>
            <input
              type="text"
              placeholder="e.g. Summer Sale Campaign"
              {...register('name')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              placeholder="Campaign description..."
              {...register('description')}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
            {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>}
          </div>

          {/* Budget Row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Total Budget ($) *
              </label>
              <input
                type="number"
                placeholder="1000.00"
                step="0.01"
                {...register('totalBudget')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              />
              {errors.totalBudget && <p className="mt-1 text-sm text-red-600">{errors.totalBudget.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Daily Budget Cap ($)
              </label>
              <input
                type="number"
                placeholder="100.00"
                step="0.01"
                {...register('dailyBudgetCap')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              />
              {errors.dailyBudgetCap && <p className="mt-1 text-sm text-red-600">{(errors.dailyBudgetCap as any).message}</p>}
            </div>
          </div>

          {/* Objective */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Campaign Objective *
            </label>
            <select
              {...register('objective')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            >
              <option value="">Select an objective...</option>
              <option value="AWARENESS">Awareness</option>
              <option value="TRAFFIC">Traffic</option>
              <option value="CONVERSIONS">Conversions</option>
              <option value="RETARGETING">Retargeting</option>
            </select>
            {errors.objective && <p className="mt-1 text-sm text-red-600">{errors.objective.message}</p>}
          </div>

          {/* Dates Row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date *
              </label>
              <input
                type="datetime-local"
                {...register('startDate')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              />
              {errors.startDate && <p className="mt-1 text-sm text-red-600">{errors.startDate.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
              <input
                type="datetime-local"
                {...register('endDate')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              />
              {errors.endDate && <p className="mt-1 text-sm text-red-600">{errors.endDate.message}</p>}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createMutation.isPending}
              className="flex-1 px-4 py-2 bg-primary text-white rounded-md text-sm font-medium hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {createMutation.isPending ? 'Creating...' : 'Create Campaign'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
