'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
    const router = useRouter();

    useEffect(() => {
        // Redirect to account page
        router.replace('/profile/account');
    }, [router]);

    return (
        <div className="flex items-center justify-center min-h-screen">
            <div>Redirecting...</div>
        </div>
    );
}
