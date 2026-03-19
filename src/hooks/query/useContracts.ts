import { contractsService } from "@/lib/services/contracts.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { message } from "antd";

export const useGetContracts = () =>
  useQuery({
    queryKey: ["contracts"],
    queryFn: contractsService.get,
  });

export const useUploadContractPdf = (contractId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (contractData: Object) =>
      contractsService.create(contractId, contractData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contracts"] });
      message.success(
        "Gửi hợp đồng thành công! Vui lòng thanh toán để hoàn tất thủ tục.",
      );
    },
    onError: (error) => {
      console.error("Error uploading PDF:", error);
    },
  });
};

export const useCancelContract = (contractId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (reason: string) => contractsService.cancel(contractId, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contracts"] });
      message.success("Hợp đồng hủy thành công!");
    },
    onError: (error) => {
      console.error("Error uploading PDF:", error);
    },
  });
};
