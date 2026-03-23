"use client";

import ProfileLayout from "../components/profile-layout";
import { useAuthStore } from "@/stores/auth.store";
import { useUserProfile, useUpdateUser } from "@/hooks/query/useUser";
import { AccountUpdateDto } from "@/types/profile";
import { Spin } from "antd";
import AccountInformation from "../components/account-information";

export default function AccountPage() {
  const user = useAuthStore((s) => s.user);
  const id = user?.id ?? "";

  const {
    data: profile,
    isLoading,
    isError,
  } = useUserProfile();

  const { mutateAsync: updateUser } = useUpdateUser(id);

  const handleUpdate = async (values: AccountUpdateDto) => {
    if (!id) {
      throw new Error("Missing user id");
    }
    await updateUser(values);
  };

  if (isLoading) {
    return (
      <ProfileLayout>
        <div className="flex items-center justify-center py-20">
          <Spin size="large" />
        </div>
      </ProfileLayout>
    );
  }

  if (isError || !profile) {
    return (
      <ProfileLayout>
        <div className="py-20 text-center text-muted">
          Unable to load account information.
        </div>
      </ProfileLayout>
    );
  }

  return (
    <ProfileLayout>
      <AccountInformation profile={profile} onUpdate={handleUpdate} />
    </ProfileLayout>
  );
}
