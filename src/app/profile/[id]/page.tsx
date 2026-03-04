'use client';

import { use, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ProfilePageProps } from '@/types/profile';

export default function ProfilePage({ params }: ProfilePageProps) {
    const { id } = use(params);
    const router = useRouter();

    useEffect(() => {
        // Redirect to account page
        router.replace(`/profile/${id}/account`);
    }, [id, router]);

    return (
        <div className="flex items-center justify-center min-h-screen">
            <div>Redirecting...</div>
        </div>
    );
}
