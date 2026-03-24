import { createPayOSPaymentLink, getPayments } from '@/lib/services/payment.service'
import { CreatePayOSPaymentLinkBody, ListPaymentsQuery } from '@/types/payment'
import { useMutation, useQuery } from '@tanstack/react-query'

export const usePayments = (params?: ListPaymentsQuery) => {
    return useQuery({
        queryKey: ['payments', params],
        queryFn: () => getPayments(params),
    })
}

export const useCreatePayOSPaymentLink = () => {
    return useMutation({
        mutationFn: (body: CreatePayOSPaymentLinkBody) => createPayOSPaymentLink(body),
    })
}
