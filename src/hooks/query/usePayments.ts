import { getPayments } from '@/lib/services/payment.service'
import { ListPaymentsQuery } from '@/types/payment'
import { useQuery } from '@tanstack/react-query'

export const usePayments = (params?: ListPaymentsQuery) => {
    return useQuery({
        queryKey: ['payments', params],
        queryFn: () => getPayments(params),
    })
}
