import { contractsService } from "@/lib/services/contracts.service";
import { userService } from "@/lib/services/user.service";
import { useAuthStore } from "@/stores/auth.store";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { App } from "antd";
import { AxiosError } from "axios";

export const useGetContracts = () =>
  useQuery({
    queryKey: ["contracts"],
    queryFn: contractsService.get,
  });

export const useUploadContractPdf = (contractId: string) => {
  const { message } = App.useApp();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (contractData: object) =>
      contractsService.create(contractId, contractData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contracts"] });
    },
    onError: (error) => {
      console.error("Error uploading PDF:", error);
      message.error("Có lỗi xảy ra khi tải lên PDF.");
    },
  });
};

export const useCancelContract = (contractId: string) => {
  const { message } = App.useApp();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (reason: string) => contractsService.cancel(contractId, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contracts"] });
      message.success("Hợp đồng hủy thành công!");
    },
    onError: (error) => {
      console.error("Error uploading PDF:", error);
      message.error("Có lỗi xảy ra khi tải lên PDF.");
    },
  });
};

export const useCancelCooperation = (cooperationId: string) => {
  const queryClient = useQueryClient();
  const { message } = App.useApp();
  return useMutation({
    mutationFn: (reason: string) =>
      contractsService.cancelCooperation(cooperationId, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["apartmentOwner"] });
      message.success("Hợp đồng hợp tác hủy thành công!");
    },
    onError: (error) => {
      console.error("Error canceling cooperation:", error);
      message.error("Có lỗi xảy ra khi hủy hợp đồng hợp tác.");
    },
  });
};

export const useSignCooperationContract = (contractId: string) => {
  const { message } = App.useApp();
  const queryClient = useQueryClient();
  const tokens = useAuthStore((s) => s.tokens);
  const setAuth = useAuthStore((s) => s.setAuth);
  const syncAuthUser = async () => {
    if (!tokens) {
      return;
    }

    const user = await queryClient.fetchQuery({
      queryKey: ["user", "profile"],
      queryFn: () => userService.getProfile(),
    });

    setAuth(user, tokens);
  };
  return useMutation({
    mutationFn: (signatureData: object) =>
      contractsService.signCooperationContract(contractId, signatureData),
    onSuccess: async () => {
      queryClient.invalidateQueries({
        queryKey: ["apartmentOwner"],
      });
      await syncAuthUser();
      message.success("Ký hợp đồng hợp tác thành công!");
    },
    onError: (error) => {
      console.error("Error signing cooperation contract:", error);
      message.error("Có lỗi xảy ra khi ký hợp đồng hợp tác.");
    },
  });
};

export const useRenewContract = (contractId: string) => {
  const { message } = App.useApp();
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
      } else if (
        statusCode === 400 &&
        backendMessage ===
          "Renewed contract can have at most 1 members based on apartment max occupants"
      ) {
        displayMessage =
          "Hợp đồng này vượt quá số thành viên cho phép của căn hộ!";
      } else if (backendMessage) {
        displayMessage = backendMessage;
      }

      message.error(displayMessage);
      console.error("Error renewing contract:", error);
    },
  });
};

export const useAddMemberContract = (nationalId: string) => {
  const { message } = App.useApp();

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
