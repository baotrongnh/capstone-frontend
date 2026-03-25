import { provincesService } from '@/lib/services/provinces.service'
import { useQuery } from '@tanstack/react-query'

export const useProvinces = () =>
     useQuery({
          queryKey: ['provinces'],
          queryFn: provincesService.getAll,
          staleTime: Infinity,
     })

export const useWards = (provinceCode: number | undefined) =>
     useQuery({
          queryKey: ['wards', provinceCode],
          queryFn: () => provincesService.getWards(provinceCode!),
          enabled: !!provinceCode,
          staleTime: 0,
     })
