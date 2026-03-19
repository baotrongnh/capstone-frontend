'use client';

import MyPropertiesComponent from '../components/my-properties';
import { ActorType } from '@/types/auth';
import { PartnerProperty } from '@/types/profile';
import { ProfileLayout } from '../components';

export default function MyPropertiesPage() {
    // TODO: Fetch partner properties from API
    const mockProperties: PartnerProperty[] = [
        {
            id: 'prop-001',
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
            ],
            baseRentPrice: 1200,
            currentTenant: {
                id: 'user-001',
                name: 'Nguyen Van A',
                email: 'nguyenvana@email.com',
                phone: '+84 901 234 567',
            },
            contractEndDate: '2026-12-31',
            monthlyRevenue: 1200,
        },
        {
            id: 'prop-002',
            buildingName: 'Green Valley Residences',
            apartmentNumber: 'B-102',
            address: '456 Le Loi Boulevard',
            city: 'Ho Chi Minh City',
            district: 'District 3',
            totalArea: '55',
            numberOfBedrooms: 1,
            numberOfBathrooms: 1,
            status: 'available',
            images: [
                'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
            ],
            baseRentPrice: 800,
            monthlyRevenue: 0,
        },
        {
            id: 'prop-003',
            buildingName: 'The Metropolitan',
            apartmentNumber: 'C-501',
            address: '789 Nguyen Hue Street',
            city: 'Ho Chi Minh City',
            district: 'District 1',
            totalArea: '110',
            numberOfBedrooms: 3,
            numberOfBathrooms: 2,
            status: 'occupied',
            images: [
                'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800',
                'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=800',
                'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800',
            ],
            baseRentPrice: 2000,
            currentTenant: {
                id: 'user-002',
                name: 'Tran Thi B',
                email: 'tranthib@email.com',
                phone: '+84 902 345 678',
            },
            contractEndDate: '2026-06-30',
            monthlyRevenue: 2000,
        },
        {
            id: 'prop-004',
            buildingName: 'Harbor View',
            apartmentNumber: 'D-210',
            address: '321 Vo Thi Sau',
            city: 'Ho Chi Minh City',
            district: 'District 3',
            totalArea: '68',
            numberOfBedrooms: 2,
            numberOfBathrooms: 1,
            status: 'maintenance',
            images: null,
            baseRentPrice: 950,
            monthlyRevenue: 0,
        },
        {
            id: 'prop-005',
            buildingName: 'Sunrise Tower',
            apartmentNumber: 'A-408',
            address: '123 Main Street',
            city: 'Ho Chi Minh City',
            district: 'District 1',
            totalArea: '80',
            numberOfBedrooms: 2,
            numberOfBathrooms: 2,
            status: 'reserved',
            images: [
                'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800',
            ],
            baseRentPrice: 1300,
            monthlyRevenue: 0,
        },
    ];

    return (
        <ProfileLayout actorType={ActorType.PARTNER}>
            <MyPropertiesComponent properties={mockProperties} />
        </ProfileLayout>
    );
}
