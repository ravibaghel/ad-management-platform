import { z } from 'zod'

export const createCampaignSchema = z.object({
  name: z.string()
    .min(3, 'Campaign name must be at least 3 characters')
    .max(255, 'Campaign name must be at most 255 characters'),

  description: z.string()
    .max(1000, 'Description must be at most 1000 characters')
    .optional()
    .or(z.literal('')),

  totalBudget: z.coerce.number()
    .min(1, 'Total budget must be at least $1.00'),

  dailyBudgetCap: z.coerce.number()
    .min(0.01, 'Daily budget cap must be at least $0.01')
    .optional()
    .or(z.literal('') as any),

  objective: z.enum(['AWARENESS', 'TRAFFIC', 'CONVERSIONS', 'RETARGETING'],
    { errorMap: () => ({ message: 'Please select a valid objective' }) }),

  startDate: z.string()
    .datetime({ message: 'Please select a valid start date' })
    .refine(
      (date) => new Date(date) > new Date(),
      'Start date must be in the future'
    ),

  endDate: z.string()
    .datetime()
    .optional()
    .or(z.literal(''))
    .refine(
      (date) => !date || new Date(date) > new Date(),
      'End date must be in the future'
    ),
}).refine(
  (data) => {
    if (!data.endDate) return true
    return new Date(data.endDate) > new Date(data.startDate)
  },
  {
    message: 'End date must be after start date',
    path: ['endDate'],
  }
)

export type CreateCampaignFormData = z.infer<typeof createCampaignSchema>
