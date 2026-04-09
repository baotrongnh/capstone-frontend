"use client";

import {
  ApartmentRatingPayload,
  ApartmentSearchQueryParams,
  apartmentService,
} from "@/lib/services/apartment.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { App } from "antd";

// QUERIES
export const useApartments = (params?: ApartmentSearchQueryParams) => {
  return useQuery({
    queryKey: ["apartments", params],
    queryFn: () => apartmentService.getList(params),
  });
};

export const useApartment = (id: string | number) => {
  return useQuery({
    queryKey: ["apartments", id],
    queryFn: () => apartmentService.getById(id),
    enabled: !!id,
  });
};

// MUTATIONS
export const useCreateApartment = () => {
  const queryClient = useQueryClient();
  const { message } = App.useApp();

  return useMutation({
    mutationFn: apartmentService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["apartments"] });
      message.success("Tạo căn hộ thành công!");
    },
    onError: (error) => {
      message.error(error?.message || "Có lỗi xảy ra!");
    },
  });
};

export const useUpdateApartment = () => {
  const queryClient = useQueryClient();
  const { message } = App.useApp();

  return useMutation({
    mutationFn: ({ id, data }: { id: string | number; data: string }) =>
      apartmentService.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["apartments"] });
      queryClient.invalidateQueries({ queryKey: ["apartments", variables.id] });
      message.success("Cập nhật thành công!");
    },
    onError: (error) => {
      message.error(error?.message || "Có lỗi xảy ra!");
    },
  });
};

export const useDeleteApartment = () => {
  const queryClient = useQueryClient();
  const { message } = App.useApp();

  return useMutation({
    mutationFn: apartmentService.delete,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["apartments"] });
      message.success("Xóa căn hộ thành công!");
    },
    onError: (error) => {
      message.error(error?.message || "Có lỗi xảy ra!");
    },
  });
};

export const useCreateCooperation = () => {
  const queryClient = useQueryClient();
  const { message } = App.useApp();

  return useMutation({
    mutationFn: apartmentService.cooperation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["apartments"] });
      message.success("Gửi yêu cầu hợp tác thành công!");
    },
    onError: (error) => {
      message.error(error?.message || "Có lỗi xảy ra!");
    },
  });
};

export const useApartmentRating = () => {
  const queryClient = useQueryClient();
  const { message } = App.useApp();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: ApartmentRatingPayload;
    }) => apartmentService.rating(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["apartments"] });
      queryClient.invalidateQueries({ queryKey: ["apartments", variables.id] });
      message.success("Cảm ơn bạn đã đánh giá căn hộ!");
    },
    onError: (error) => {
      if (error.message === "Request failed with status code 403") {
        message.error(
          "Bạn chưa thể đánh giá căn hộ này khi chưa trải nghiệm dịch vụ!",
        );
      } else {
        message.error("Đã xảy ra lỗi hệ thống, vui lòng thử lại sau!");
      }
    },
  });
};

export const useApartmentOwner = (id: string | number) => {
  return useQuery({
    queryKey: ["apartmentOwner"],
    queryFn: () => apartmentService.owner(id),
  });
};

export const useApartmentCooperationContract = (id: string | number) => {
  return useQuery({
    queryKey: ["apartmentCooperationContract", id],
    queryFn: () => apartmentService.cooperationContract(id),
  });
};
