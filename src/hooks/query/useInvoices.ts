import { getInvoices } from "@/lib/services/invoice.service"
import { ListInvoicesQuery } from "@/types/invoice"
import { useQuery } from "@tanstack/react-query"

export const useInvoices = (params?: ListInvoicesQuery) => {
    return useQuery({
        queryKey: ["invoices", params],
        queryFn: () => getInvoices(params),
    })
}
