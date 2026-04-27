import { CampaignStatus } from '../../types/campaign'
import clsx from 'clsx'

interface CampaignStatusBadgeProps {
  status: CampaignStatus
}

const statusColorMap: Record<CampaignStatus, { bg: string; text: string }> = {
  DRAFT: { bg: 'bg-gray-100', text: 'text-gray-800' },
  PENDING_REVIEW: { bg: 'bg-yellow-100', text: 'text-yellow-800' },
  ACTIVE: { bg: 'bg-green-100', text: 'text-green-800' },
  PAUSED: { bg: 'bg-blue-100', text: 'text-blue-800' },
  COMPLETED: { bg: 'bg-slate-100', text: 'text-slate-800' },
  REJECTED: { bg: 'bg-red-100', text: 'text-red-800' },
  CANCELLED: { bg: 'bg-red-100', text: 'text-red-800' },
}

export default function CampaignStatusBadge({ status }: CampaignStatusBadgeProps) {
  const colors = statusColorMap[status]

  return (
    <span className={clsx('px-3 py-1 rounded-full text-xs font-medium', colors.bg, colors.text)}>
      {status.replace('_', ' ')}
    </span>
  )
}
