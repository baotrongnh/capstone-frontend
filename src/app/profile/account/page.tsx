'use client';

import ProfileLayout from '../components/profile-layout';
import AccountInformation from '../components/account-information';
import { ActorType } from '@/types/auth';
import { useAuthStore } from '@/stores/auth.store';
import { useUserProfile, useUpdateUser } from '@/hooks/query/useUser';
import { usePartnerProfile } from '@/hooks/query/usePartner';
import { UpdateUserDto } from '@/types/user';
import { Spin } from 'antd';

export default function AccountPage() {
    const user = useAuthStore((s) => s.user);
    const id = user?.id ?? '';
    const actorType = user?.actorType ?? ActorType.USER;

    const isPartner = actorType === ActorType.PARTNER;

    const {
        data: userProfile,
        isLoading: userLoading,
    } = useUserProfile(!isPartner);

    const {
        data: partnerProfile,
        isLoading: partnerLoading,
    } = usePartnerProfile(isPartner);

    const { mutateAsync: updateUser } = useUpdateUser(id);

    const profile = isPartner ? partnerProfile : userProfile;
    const isLoading = isPartner ? partnerLoading : userLoading;

    const handleUpdate = async (values: UpdateUserDto) => {
        if (!isPartner) {
            await updateUser(values);
        }
        // Partner update not yet supported by API
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

