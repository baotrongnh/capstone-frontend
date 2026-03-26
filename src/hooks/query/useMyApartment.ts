import { apartmentService } from "@/lib/services/apartment.service"
import type { OwnerApartmentResponse } from "@/lib/services/apartment.service" 
import { useQuery } from "@tanstack/react-query"

type OwnerApartmentItem = NonNullable<OwnerApartmentResponse["data"]>[number]

export const useMyApartment = (id: string | number) => {
    return useQuery<OwnerApartmentItem[]>({
        queryKey: ['my-apartment', id],
        queryFn: async () => {
            const apartments = await apartmentService.owner(id) as OwnerApartmentItem[]
            return apartments ?? []
        },
        enabled: !!id,
    })
}