import { getRevenueOverview } from '@/lib/services/revenue.service'
import type {
    RevenueOverviewQuery,
    RevenueOverviewResponse,
} from '@/types/revenue'
import { useQuery } from '@tanstack/react-query'

export const useRevenueOverview = (params?: RevenueOverviewQuery) => {
    return useQuery<RevenueOverviewResponse>({
        queryKey: [
            'revenue-overview',
            params?.actorScope ?? null,
            params?.paidFrom ?? null,
            params?.paidTo ?? null,
            params?.page ?? null,
            params?.limit ?? null,
        ],
        queryFn: () => getRevenueOverview(params),
        enabled: Boolean(params?.paidFrom && params?.paidTo),
    })
}
