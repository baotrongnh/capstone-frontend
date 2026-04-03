import { contractsService } from "@/lib/services/contracts.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { message } from "antd";
import { AxiosError } from "axios";

export const useGetContracts = () =>
  useQuery({
    queryKey: ["contracts"],
    queryFn: contractsService.get,
  });

export const useUploadContractPdf = (contractId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (contractData: object) =>
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

export const useCancelCooperation = (cooperationId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (reason: string) =>
      contractsService.cancelCooperation(cooperationId, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contracts"] });
      message.success("Hợp đồng hợp tác hủy thành công!");
    },
    onError: (error) => {
      console.error("Error canceling cooperation:", error);
    },
  });
};

export const useSignCooperationContract = (contractId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (signatureData: object) =>
      contractsService.signCooperationContract(contractId, signatureData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contracts"] });
      message.success("Ký hợp đồng hợp tác thành công!");
    },
    onError: (error) => {
      console.error("Error signing cooperation contract:", error);
    },
  });
};

export const useRenewContract = (contractId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: object) => contractsService.renew(contractId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contracts"] });
      message.success("Gia hạn hợp đồng thành công!");
    },
    onError: (error: AxiosError<{ message: string }>) => {
      const statusCode = error?.response?.status;
      const backendMessage = error?.response?.data?.message;

      let displayMessage = "Lỗi khi gia hạn hợp đồng";

      if (statusCode === 409) {
        displayMessage =
          "Hợp đồng này đã được gia hạn, vui lòng gia hạn hợp đồng 'Gia hạn'.";
      } else if (backendMessage) {
        displayMessage = backendMessage;
      }

      message.error(displayMessage);
      console.error("Error renewing contract:", error);
    },
  });
};

export const useAddMemberContract = (nationalId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: object) =>
      contractsService.addMember(nationalId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contracts"] });
      message.success("Thêm thành viên vào hợp đồng thành công!");
    },
    onError: (error: AxiosError<{ message: string }>) => {
      const statusCode = error?.response?.status;
      const backendMessage = error?.response?.data?.message;

      let displayMessage = "Có lỗi xảy ra khi thêm thành viên vào hợp đồng.";

      if (statusCode === 409) {
        displayMessage = "Người dùng này đã là thành viên của hợp đồng.";
      } else if (backendMessage) {
        displayMessage = backendMessage;
      }

      message.error(displayMessage);
      console.error("Error adding member to contract:", error);
    },
  });
};
