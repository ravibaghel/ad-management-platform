import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { campaignApi } from '../services/api'
import { Campaign, PagedResponse, CampaignStatus } from '../types/campaign'

export const useCampaigns = (page: number = 0, size: number = 20, status?: CampaignStatus) => {
  const queryKey = ['campaigns', page, size, status]

  return useQuery({
    queryKey,
    queryFn: async () => {
      const params = new URLSearchParams()
      params.append('page', page.toString())
      params.append('size', size.toString())
      if (status) {
        params.append('status', status)
      }

      const response = await campaignApi.get<PagedResponse<Campaign>>(
        `/v1/campaigns?${params.toString()}`
      )
      return response.data
    },
  })
}

export const useCreateCampaign = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: any) => {
      const response = await campaignApi.post<Campaign>('/v1/campaigns', {
        ...data,
        startDate: new Date(data.startDate).toISOString(),
        endDate: data.endDate ? new Date(data.endDate).toISOString() : undefined,
      })
      return response.data
    },
    onSuccess: () => {
      // Invalidate all campaign queries
      queryClient.invalidateQueries({ queryKey: ['campaigns'] })
    },
  })
}

export const useUpdateCampaignStatus = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ campaignId, status }: { campaignId: string; status: CampaignStatus }) => {
      const response = await campaignApi.patch<Campaign>(
        `/v1/campaigns/${campaignId}/status`,
        {},
        { params: { status } }
      )
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] })
    },
  })
}
