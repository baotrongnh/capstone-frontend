'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { App, Spin } from 'antd';
import { useAuthStore } from '@/stores/auth.store';

export default function ProfilePage() {
    const router = useRouter();
    const user = useAuthStore((state) => state.user);
    const isHydrated = useAuthStore((state) => state.isHydrated);
    const { message } = App.useApp();
    const t = useTranslations('Profile');

    useEffect(() => {
        if (!isHydrated) {
            return;
        }

        if (!user) {
            message.error(t('authRequired'));
            router.replace('/');
            return;
        }
        router.replace('/profile/account');
    }, [isHydrated, message, router, t, user]);

    return (
        <div className="flex items-center justify-center min-h-screen">
            <div><Spin size="large" /></div>
        </div>
    );
}
