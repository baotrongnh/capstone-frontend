import { ListInvoicesQuery, ListInvoicesRes } from "@/types/invoice";
import { apiClient } from "../apis/client";
import { endpoints } from "../apis/endpoints";

export const getInvoices = async (params?: ListInvoicesQuery): Promise<ListInvoicesRes> => {
    const res = await apiClient.get(`${endpoints.invoices}`, {params})
    return res.data
}