import { provincesService } from '@/lib/services/provinces.service'
import { useQuery } from '@tanstack/react-query'

export const useProvinces = (afterMerge: boolean) =>
     useQuery({
          queryKey: ['provinces', afterMerge],
          queryFn: () => provincesService.getAll(afterMerge),
          staleTime: Infinity,
     })

export const useDistricts = (provinceCode: number | undefined, afterMerge: boolean) =>
     useQuery({
          queryKey: ['districts', provinceCode, afterMerge],
          queryFn: () => provincesService.getDistricts(provinceCode!, afterMerge),
          enabled: !!provinceCode,
          staleTime: Infinity,
     })
