"use client";

import ProfileLayout from "../components/profile-layout";
import { ActorType } from "@/types/auth";
import { useAuthStore } from "@/stores/auth.store";
import { useUserProfile, useUpdateUser } from "@/hooks/query/useUser";
import { usePartnerProfile, useUpdatePartnerProfile } from "@/hooks/query/usePartner";
import { UpdatePartnerDto } from "@/types/partner";
import { AccountUpdateDto } from "@/types/profile";
import { Spin } from "antd";
import AccountInformation from "../components/account-information";

export default function AccountPage() {
  const user = useAuthStore((s) => s.user);
  const id = user?.id ?? "";
  const actorType = user?.actorType ?? ActorType.USER;

  const isPartner = actorType === ActorType.PARTNER;

  const { data: userProfile, isLoading: userLoading } =
    useUserProfile(!isPartner);

  const { data: partnerProfile, isLoading: partnerLoading } =
    usePartnerProfile(isPartner);

  const { mutateAsync: updateUser } = useUpdateUser(id);
  const { mutateAsync: updatePartner } = useUpdatePartnerProfile();

  const profile = isPartner ? partnerProfile : userProfile;
  const isLoading = isPartner ? partnerLoading : userLoading;

  const handleUpdate = async (values: AccountUpdateDto) => {
    if (isPartner) {
      const partnerPayload: UpdatePartnerDto = {
        fullName: values.fullName,
        phone: values.phone,
        email: values.email,
        companyName: values.companyName,
        taxCode: values.taxCode,
        bankAccountNumber: values.bankAccountNumber,
        bankName: values.bankName,
        address: values.address,
      };
      await updatePartner(partnerPayload);
      return;
    }

    await updateUser(values);
  };

  if (isLoading || !profile) {
    return (
      <ProfileLayout actorType={actorType}>
        <div className="flex items-center justify-center py-20">
          <Spin size="large" />
        </div>
      </ProfileLayout>
    );
  }

  return (
    <ProfileLayout actorType={actorType}>
      <AccountInformation
        actorType={actorType}
        profile={profile}
        onUpdate={handleUpdate}
      />
    </ProfileLayout>
  );
}
