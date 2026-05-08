"use client";

import { userService } from "@/lib/services/user.service";
import { useAuthStore } from "@/stores/auth.store";
import { UpdateUserDto } from "@/types/user";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { App } from "antd";

export const useUserProfile = () => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isHydrated = useAuthStore((s) => s.isHydrated);
  return useQuery({
    queryKey: ["user", "profile"],
    queryFn: () => userService.getProfile(),
    enabled: isHydrated && isAuthenticated,
    retry: false,
  });
};

export const useUserById = (id: string, enabled = true) => {
  return useQuery({
    queryKey: ["user", id],
    queryFn: () => userService.getById(id),
    enabled: !!id && enabled,
  });
};

export const useUpdateUser = (id: string) => {
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
    mutationFn: (data: UpdateUserDto) => userService.update(id, data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["user", "profile"] });
      await syncAuthUser();
    },
    onError: (error: Error) => {
      message.error(error?.message || "Failed to update profile");
    },
  });
};

export const useUpdateUserCardImages = () => {
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
    mutationFn: (profileImageUrl: string) =>
      userService.updateCardImages(profileImageUrl),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["user", "profile"] });
      await syncAuthUser();
    },
    onError: (error: Error) => {
      console.log(error);
    },
  });
};

export const useVerifyIdentity = () => {
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
    mutationFn: (data: { identityCardFront: File; identityCardBack: File }) =>
      userService.verifyIdentity(data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["user", "profile"] });
      await syncAuthUser();
    },
  });
};

export const useSearchNational = (id: string) => {
  return useQuery({
    queryKey: ["user", "search-national", id],
    queryFn: () => userService.searchNational(id),
    enabled: !!id,
  });
};
