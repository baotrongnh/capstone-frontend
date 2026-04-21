import {
    GetInvoiceByIdPath,
    GetInvoiceByIdRes,
    ListInvoicesQuery,
    ListInvoicesRes,
    ListMonthlyUtilityInvoicesQuery,
    ListMonthlyUtilityInvoicesRes,
} from '@/types/invoice'
import { apiClient } from '../apis/client'
import { endpoints } from '../apis/endpoints'

export const getInvoices = async (params?: ListInvoicesQuery): Promise<ListInvoicesRes> => {
    const res = await apiClient.get(`${endpoints.invoices}`, { params })
    return res.data
}

export const getInvoiceById = async (id: GetInvoiceByIdPath['id']): Promise<GetInvoiceByIdRes> => {
    const res = await apiClient.get(`${endpoints.invoices}/${id}`)
    return res.data
}

export const getMonthlyUtilityInvoices = async (params?: ListMonthlyUtilityInvoicesQuery): Promise<ListMonthlyUtilityInvoicesRes> => {
    const res = await apiClient.get(`${endpoints.invoices}/utility/monthly`, { params })
    return res.data
}
