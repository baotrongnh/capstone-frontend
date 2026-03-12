import { AiVerification, UpdateUserDto, UpdateUserResponse, UserDetail, UserIdentity } from "@/types/user";
import { apiClient } from "../apis/client";
import { endpoints } from "../apis/endpoints";

export const userService = {
  getProfile: async (): Promise<UserDetail> => {
    const { data } = await apiClient.get(`${endpoints.users}/profile`);
    return data.data;
  },

  getById: async (id: string): Promise<UserDetail> => {
    const { data } = await apiClient.get(`${endpoints.users}/${id}`);
    return data.data;
  },

  update: async (
    id: string,
    userData: UpdateUserDto,
  ): Promise<UpdateUserResponse> => {
    const { data } = await apiClient.patch(
      `${endpoints.users}/${id}`,
      userData,
    );
    return data.data;
  },

  updateCardImages: async (
    profileImageUrl: string,
  ): Promise<UpdateUserResponse> => {
    const payload = {
      profileImageUrl,
    };
    const { data } = await apiClient.patch(
      `${endpoints.users}/profile/identity-card`,
      payload,
    );
    return data.data;
  },

  uploadIdentityCard: async (data: {
    front: File;
    back?: File;
  }): Promise<void> => {
    const formData = new FormData();
    formData.append('identityCardFront', data.front);
    if (data.back) {
      formData.append('identityCardBack', data.back);
    }
    await apiClient.patch(
      `${endpoints.users}/profile/identity-card`,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } },
    );
  },

  verifyIdentity: async (data: {
    identityCardFront: File;
    identityCardBack: File;
  }): Promise<UserDetail & { identity: UserIdentity; aiVerification: AiVerification }> => {
    const formData = new FormData();
    formData.append('identityCardFront', data.identityCardFront);
    formData.append('identityCardBack', data.identityCardBack);
    const { data: res } = await apiClient.post(
      `${endpoints.users}/profile/verify-identity`,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } },
    );
    return res.data;
  },
};
