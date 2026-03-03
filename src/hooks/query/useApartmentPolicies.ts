import { viewApartmentPoliciesService } from "@/lib/services/apartmentPolicies.service";
import { useQuery } from "@tanstack/react-query";

export const useApartmentPolicies = (apartmentId: string) => {
  return useQuery({
    queryKey: ["apartmentPolicies", apartmentId],
    queryFn: async () => viewApartmentPoliciesService.get(apartmentId),

    enabled: !!apartmentId,
  });
};
