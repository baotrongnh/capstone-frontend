import type { RevenueOverviewQuery, RevenueOverviewResponse } from '@/types/revenue'
import { apiClient } from '../apis/client'
import { endpoints } from '../apis/endpoints'

const EMPTY_REVENUE_OVERVIEW: RevenueOverviewResponse = {
    statusCode: 200,
    message: 'Success',
    data: {
        roleContext: 'partner_receivable',
        items: [],
        total: 0,
        page: 1,
        limit: 20,
        totalPages: 1,
    },
    meta: {
        timestamp: new Date().toISOString(),
    },
}

export const getRevenueOverview = async (
    params?: RevenueOverviewQuery,
): Promise<RevenueOverviewResponse> => {
    const res = await apiClient.get(`${endpoints.invoices}/me`, { params })
    return (res.data ?? EMPTY_REVENUE_OVERVIEW) as RevenueOverviewResponse
}
