'use client';

import { use } from 'react';
import ProfileLayout from '../../components/profile-layout';
import AccountInformation from '../../components/account-information';
import { ActorType } from '@/types/auth';
import { UserProfile, AccountPageProps } from '@/types/profile';

export default function AccountPage({ params }: AccountPageProps) {
    const { id } = use(params);

    const mockProfile: UserProfile = {
        id: id,
        name: 'John Doe',
        email: 'john.doe@example.com',
        avatar: undefined,
        phone: '+1 234 567 8900',
        address: '123 Main Street, City, Country',
        actorType: ActorType.USER,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };

    const handleUpdateProfile = async (values: Partial<UserProfile>) => {
        console.log('Updating profile:', values);
        await new Promise(resolve => setTimeout(resolve, 1000));
    };

    return (
        <ProfileLayout userId={id} actorType={mockProfile.actorType}>
            <AccountInformation
                profile={mockProfile}
                onUpdate={handleUpdateProfile}
            />
        </ProfileLayout>
    );
}
