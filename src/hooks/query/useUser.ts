"use client";

import { userService } from "@/lib/services/user.service";
import { UpdateUserDto } from "@/types/user";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { App } from "antd";

// QUERIES
export const useUserProfile = (enabled = true) => {
  return useQuery({
    queryKey: ["user", "profile"],
    queryFn: () => userService.getProfile(),
    enabled,
  });
};

export const useUserById = (id: string, enabled = true) => {
  return useQuery({
    queryKey: ["user", id],
    queryFn: () => userService.getById(id),
    enabled: !!id && enabled,
  });
};

// MUTATIONS
export const useUpdateUser = (id: string) => {
  const { message } = App.useApp();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateUserDto) => userService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user", "profile"] });
      queryClient.invalidateQueries({ queryKey: ["user", id] });
      message.success("Profile updated successfully!");
    },
    onError: (error: Error) => {
      message.error(error?.message || "Failed to update profile");
    },
  });
};

export const useUpdateUserCardImages = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (profileImageUrl: string) =>
      userService.updateCardImages(profileImageUrl),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user", "profile"] });
    },
    onError: (error: Error) => {
      console.log(error);
    },
  });
};
