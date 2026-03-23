'use client';

import ProfileLayout from '../components/profile-layout';
import MyApartment from '../components/my-apartment';
import { UserApartment } from '@/types/profile';
import { useAuthStore } from '@/stores/auth.store';

export default function MyApartmentPage() {
    const user = useAuthStore((s) => s.user);
    const id = user?.id ?? '';

    const mockApartment: UserApartment = {
        id: '1',
        buildingName: 'Sunrise Tower',
        apartmentNumber: 'A-305',
        address: '123 Main Street',
        city: 'Ho Chi Minh City',
        district: 'District 1',
        totalArea: '75',
        numberOfBedrooms: 2,
        numberOfBathrooms: 2,
        status: 'occupied',
        images: [
            'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
            'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
            'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800'
        ],
        baseRentPrice: 1200,
        contract: {
            id: 'contract-001',
            apartmentId: '1',
            tenantId: id,
            startDate: '2026-01-01',
            endDate: '2026-12-31',
            monthlyRent: 1200,
            depositAmount: 2400,
            status: 'active',
            contractUrl: '/documents/contract-001.pdf'
        },
        // Electric meter readings
        currentElectricReading: 1250,
        previousElectricReading: 1100,
        electricityUnitPrice: 0.15,
        // Water meter readings
        currentWaterReading: 45,
        previousWaterReading: 38,
        waterUnitPrice: 2.5
    };

    return (
        <ProfileLayout>
            <MyApartment apartment={mockApartment} />
        </ProfileLayout>
    );
}
