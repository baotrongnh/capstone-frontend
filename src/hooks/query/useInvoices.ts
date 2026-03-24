import { getInvoiceById, getInvoices } from "@/lib/services/invoice.service"
import { GetInvoiceByIdPath, ListInvoicesQuery } from "@/types/invoice"
import { useQuery } from "@tanstack/react-query"

export const useInvoices = (params?: ListInvoicesQuery) => {
    return useQuery({
        queryKey: ["invoices", params],
        queryFn: () => getInvoices(params),
    })
}

export const useInvoice = (id?: GetInvoiceByIdPath['id']) => {
    return useQuery({
        queryKey: ["invoice", id],
        queryFn: () => {
            if (!id) throw new Error("Invoice id is required")
            return getInvoiceById(id)
        },
        enabled: Boolean(id),
    })
}
