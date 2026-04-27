import { useState } from 'react'
import { useCampaigns } from '../hooks/useCampaigns'
import CreateCampaignModal from '../components/campaigns/CreateCampaignModal'
import CampaignStatusBadge from '../components/campaigns/CampaignStatusBadge'
import { ChevronLeft, ChevronRight, AlertCircle } from 'lucide-react'

export default function CampaignsPage() {
  const [page, setPage] = useState(0)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { data, isLoading, error, refetch } = useCampaigns(page, 20)

  const campaigns = data?.content ?? []
  const totalPages = data?.totalPages ?? 0
  const currentPage = (data?.page ?? 0) + 1

  if (error) {
    return (
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-gray-900">Campaigns</h2>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-primary text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-dark transition-colors"
          >
            New Campaign
          </button>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-8">
          <div className="flex items-center gap-3 text-red-600">
            <AlertCircle size={20} />
            <div>
              <p className="font-medium">Failed to load campaigns</p>
              <p className="text-sm text-red-500 mt-1">{error instanceof Error ? error.message : 'Unknown error'}</p>
            </div>
          </div>
          <button
            onClick={() => refetch()}
            className="mt-4 px-4 py-2 bg-primary text-white rounded-md text-sm font-medium hover:bg-primary-dark transition-colors"
          >
            Retry
          </button>
        </div>
        <CreateCampaignModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-gray-900">Campaigns</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-primary text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-dark transition-colors"
        >
          New Campaign
        </button>
      </div>

      <div className="bg-white rounded-lg border border-gray-200">
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <p className="mt-2 text-gray-500 text-sm">Loading campaigns...</p>
          </div>
        ) : campaigns.length === 0 ? (
          <div className="p-8 text-center text-gray-400 text-sm">
            No campaigns yet. Create your first campaign to get started.
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                      Objective
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-600 uppercase tracking-wider">
                      Budget
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                      Start Date
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {campaigns.map(campaign => (
                    <tr key={campaign.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col">
                          <p className="text-sm font-medium text-gray-900">{campaign.name}</p>
                          <p className="text-xs text-gray-500">{campaign.description || 'No description'}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <CampaignStatusBadge status={campaign.status} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {campaign.objective}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="text-sm font-medium text-gray-900">
                          ${campaign.totalBudget.toFixed(2)}
                        </div>
                        <div className="text-xs text-gray-500">
                          ${campaign.spentBudget.toFixed(2)} spent
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {new Date(campaign.startDate).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  Page {currentPage} of {totalPages} • {data?.totalElements} total campaigns
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPage(p => Math.max(0, p - 1))}
                    disabled={page === 0}
                    className="flex items-center gap-1 px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft size={16} /> Previous
                  </button>
                  <button
                    onClick={() => setPage(p => (p < totalPages - 1 ? p + 1 : p))}
                    disabled={page >= totalPages - 1}
                    className="flex items-center gap-1 px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Next <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <CreateCampaignModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  )
}
