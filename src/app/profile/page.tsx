'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Spin } from 'antd';

export default function ProfilePage() {
    const router = useRouter();

    useEffect(() => {
        router.replace('/profile/account');
    }, [router]);

    return (
        <div className="flex items-center justify-center min-h-screen">
            <div><Spin size="large" /></div>
        </div>
    );
}
