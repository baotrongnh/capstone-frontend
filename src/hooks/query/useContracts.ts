import { contractsService } from "@/lib/services/contracts.service";
import { GetContractsResponse } from "@/types/contracts";
import { useQuery } from "@tanstack/react-query";

export const useGetContracts = () => {
  return useQuery<GetContractsResponse>({
    queryKey: ["contracts"],
    queryFn: contractsService.get,
  });
};
