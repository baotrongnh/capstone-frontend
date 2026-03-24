import { ListPaymentsQuery, ListPaymentsRes } from '@/types/payment'
import { apiClient } from '../apis/client'
import { endpoints } from '../apis/endpoints'

export const getPayments = async (params?: ListPaymentsQuery): Promise<ListPaymentsRes> => {
    const res = await apiClient.get(`${endpoints.payments}`, { params })
    return res.data
}
