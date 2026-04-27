export type CampaignStatus =
  | 'DRAFT' | 'PENDING_REVIEW' | 'ACTIVE'
  | 'PAUSED' | 'COMPLETED' | 'REJECTED' | 'CANCELLED'

export type CampaignObjective =
  | 'AWARENESS' | 'TRAFFIC' | 'CONVERSIONS' | 'RETARGETING'

export interface Campaign {
  id: string
  name: string
  description?: string
  advertiserId: string
  status: CampaignStatus
  totalBudget: number
  spentBudget: number
  remainingBudget: number
  dailyBudgetCap?: number
  objective: CampaignObjective
  startDate: string
  endDate?: string
  createdAt: string
  updatedAt: string
}

export interface PagedResponse<T> {
  content: T[]
  page: number
  size: number
  totalElements: number
  totalPages: number
  last: boolean
}
